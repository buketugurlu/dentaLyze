const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const axios = require('axios');
const path = require('path');
const bcrypt = require('bcrypt');
const { Storage } = require('@google-cloud/storage');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const bucketName = process.env.BUCKET_NAME;
const resultsBucketName = process.env.RESULTS_BUCKET_NAME;

// PostgreSQL bağlantı ayarları
const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
});

// Google Cloud Storage bağlantısı
const storage = new Storage({
  keyFilename: process.env.GOOGLE_CLOUD_KEYFILE_PATH,
  projectId: 'dentalyze-446308',
});



// 1) Hasta listeleme
app.get('/api/patients', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM patients ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Veritabanı sorgusu başarısız', details: err.message });
  }
});

app.post('/api/patients', async (req, res) => {
  const { name, birth_date, gender, registration_date } = req.body;

  try {
    // Yeni hastayı ekle
    const patientResult = await pool.query(
      `INSERT INTO patients (name, birth_date, gender, registration_date)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [name, birth_date, gender, registration_date]
    );

    const patientId = patientResult.rows[0].id;

    // Bucket'tan rastgele bir röntgen al
    const xrayImageUrl = await getRandomXrayFromBucket();
    console.log('Seçilen röntgen URL:', xrayImageUrl); // Debug için log

    // Röntgeni veritabanına kaydet
    await pool.query(
      `INSERT INTO xray_images (patient_id, image_url, upload_date, analysis_status)
       VALUES ($1, $2, NOW(), 'pending')`,
      [patientId, xrayImageUrl]
    );

    res.status(201).json({ message: 'Hasta ve röntgen başarıyla eklendi!', patientId, xrayImageUrl });
  } catch (err) {
    console.error('Hata:', err);
    res.status(500).json({ error: 'Hasta eklenemedi', details: err.message });
  }
});


// 3) Tek hasta detayı
app.get('/api/patients/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM patients WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Hasta bulunamadı' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Veritabanı sorgusu başarısız', details: err.message });
  }
});

app.delete('/api/patients/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Hastayı sil
    const result = await pool.query('DELETE FROM patients WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Hasta bulunamadı' });
    }

    // O hastaya atanmış röntgeni boşta olarak işaretle
    await pool.query(
      `UPDATE xray_images SET patient_id = NULL WHERE patient_id = $1`,
      [id]
    );

    res.json({ message: 'Hasta ve röntgen bağlantısı silindi.' });
  } catch (err) {
    console.error('Hasta silinirken hata oluştu:', err);
    res.status(500).json({ error: 'Hasta silinemedi', details: err.message });
  }
});



// 5) Belirli hastanın röntgenleri
app.get('/api/patient/:id/xrays', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM xray_images WHERE patient_id = $1 ORDER BY id ASC',
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Röntgen bilgileri yüklenemedi', details: err.message });
  }
});

// 6) Belirli röntgene ait analiz sonuçları
app.get('/api/xray/:id/results', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM analysis_results WHERE xray_image_id = $1 ORDER BY id ASC',
      [id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Analiz sonuçları yüklenemedi', details: err.message });
  }
});

const getRandomXrayFromBucket = async () => {
  try {
    const [files] = await storage.bucket(bucketName).getFiles();
    
    // Dosya listesini filtrele: sadece kullanılmamış olanlar
    const unusedFiles = files.filter(file => file.name.endsWith('.jpg'));

    if (unusedFiles.length === 0) {
      throw new Error('Kullanılmamış röntgen bulunamadı.');
    }

    // Rastgele bir dosya seç
    const randomIndex = Math.floor(Math.random() * unusedFiles.length);
    const randomFile = unusedFiles[randomIndex];

    return `https://storage.googleapis.com/${bucketName}/${randomFile.name}`;
  } catch (error) {
    console.error('Bucket\'tan röntgen alınırken hata oluştu:', error);
    throw new Error('Röntgen alınamadı.');
  }
};
////analiz sonuçlarını dentalyze_yolo_results bucketına kaydeder.
app.post('/api/upload-result', async (req, res) => {
  const { imageUrl } = req.body; // React'ten gelen analiz sonucu linki

  if (!imageUrl) {
    return res.status(400).json({ error: 'imageUrl gereklidir.' });
  }

  try {
    console.log(`[INFO] Flask'tan analiz sonucu indiriliyor: ${imageUrl}`);

    // Flask'tan dosyayı indir ve GCS'ye direkt yükle
    const response = await axios({
      url: imageUrl,
      method: 'GET',
      responseType: 'stream',
    });

    const destination = `${path.basename(imageUrl)}`; // Bucket'ta dosya adı
    const gcsFile = storage.bucket(resultsBucketName).file(destination);

    console.log(`[INFO] GCS'ye direkt yükleme başlatıldı: ${destination}`);
    const stream = gcsFile.createWriteStream({
      resumable: false, // Akışı yeniden başlatma özelliği
    });

    response.data.pipe(stream);

    stream.on('finish', async () => {
      try {
        const gcsUrl = `https://storage.googleapis.com/${resultsBucketName}/${destination}`;
        console.log(`[SUCCESS] Dosya başarıyla yüklendi.: ${gcsUrl}`);
        res.status(200).json({ message: 'Analiz sonucu başarıyla yüklendi', gcsUrl });
      } catch (error) {
        console.error(`[ERROR] Dosyayı herkese açık yaparken hata oluştu: ${error.message}`);
        res.status(500).json({ error: 'Yükleme yapıldı ancak dosya herkese açık yapılamadı', details: error.message });
      }
    });

    stream.on('error', (error) => {
      console.error(`[ERROR] GCS'ye yükleme sırasında hata oluştu: ${error.message}`);
      res.status(500).json({ error: 'Yükleme başarısız', details: error.message });
    });
  } catch (error) {
    console.error(`[ERROR] İndirme sırasında hata oluştu: ${error.message}`);
    res.status(500).json({ error: 'Yükleme başarısız', details: error.message });
  }
});

// Belirli bir hastanın analiz edilmiş röntgenini getir
app.get('/api/patient/:id/completed-xrays', async (req, res) => {
  const { id } = req.params;

  try {
    // Veritabanından orijinal röntgenleri al
    const xrays = await pool.query('SELECT image_url FROM xray_images WHERE patient_id = $1', [id]);

    if (xrays.rows.length === 0) {
      return res.status(404).json({ error: 'Bu hastaya ait röntgen bulunamadı.' });
    }

    // Bucket'tan analiz edilmiş röntgenleri kontrol et
    const [files] = await storage.bucket(resultsBucketName).getFiles();
    const completedXrays = xrays.rows.map((xray) => {
      const originalFileName = path.basename(xray.image_url); // Örneğin "1.jpg"
      const matchedFile = files.find((file) => file.name === originalFileName); // GCS'de aynı isimli dosyayı bul
      return matchedFile
        ? `https://storage.googleapis.com/${resultsBucketName}/${matchedFile.name}` // Bulunan dosyanın URL'si
        : null; // Eğer dosya bulunamazsa null döndür
    });

    res.status(200).json(completedXrays.filter((url) => url !== null)); // Sadece bulunan URL'leri döndür
  } catch (error) {
    console.error('Hata:', error);
    res.status(500).json({ error: 'Analiz sonuçları alınamadı', details: error.message });
  }
});
/////şifre hashleme işlemi
const hashPasswords = async () => {
  try {
    // Veritabanındaki tüm kullanıcıları al
    const users = await pool.query('SELECT id, username, password_hash FROM users');
    const userRows = users.rows;

    for (const user of userRows) {
      const { id, password_hash } = user;

      // Eğer şifre zaten hashlenmişse (bcrypt hash formatı $2b$ ile başlar) atla
      if (password_hash.startsWith('$2b$')) {
        console.log(`Kullanıcı ${user.username} için şifre zaten hashlenmiş, atlanıyor.`);
        continue;
      }

      // Şifreyi hashle
      const hashedPassword = await bcrypt.hash(password_hash, 10);
      console.log(`Kullanıcı ${user.username} için yeni hash: ${hashedPassword}`);

      // Hashlenmiş şifreyi güncelle
      await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [
        hashedPassword,
        id,
      ]);

      console.log(`Kullanıcı ${user.username} için şifre başarıyla güncellendi.`);
    }

    console.log('Tüm şifreler başarıyla hashlenip güncellendi.');
  } catch (err) {
    console.error('Hata:', err);
  } 
};

// Hashleme fonksiyonunu çalıştır
hashPasswords();

////giriş işlemleri
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Kullanıcıyı veritabanından al
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
    }

    const user = result.rows[0];

    // Şifre kontrolü
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
    }

    res.status(200).json({ message: 'Giriş başarılı', user: { id: user.id, role: user.role } });
  } catch (error) {
    console.error('Hata:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});


// Sunucuyu başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
