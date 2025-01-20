from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from ultralytics import YOLO
import psycopg2
import psycopg2.pool
import os
import requests
import shutil
output_directory = 'runs/detect/predict'
if os.path.exists(output_directory):
        shutil.rmtree(output_directory)

# Flask ve CORS ayarları
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["*"]}})

# YOLOv8 modelini yükle
model = YOLO('best.pt')

# PostgreSQL bağlantı havuzu
db_pool = psycopg2.pool.SimpleConnectionPool(
    1, 10,  # Minimum ve maksimum bağlantı sayısı
    host='35.240.58.37',
    database='postgres',
    user='postgres',
    password='BC1244k.tamam'
)

# Sınıf isimleri
CLASS_NAMES = {
    0: "Healthy Teeth",
    1: "Caries",
    2: "Impacted Teeth",
    3: "BDC/BDR",
    4: "Infection",
 5: "Fractured Teeth"
}

@app.route('/analyze', methods=['POST'])
def analyze():
    """
    Hasta ID'sine göre röntgen analizini yap ve sonucu kaydet.
    """
    try:
        # Formdan patient_id alın
        patient_id = request.form.get('patient_id')
        if not patient_id:
            return jsonify({'error': 'patient_id gerekli!'}), 400

        # Veritabanından röntgen bilgilerini al
        conn = db_pool.getconn()
        cur = conn.cursor()
        cur.execute("SELECT id, image_url FROM xray_images WHERE patient_id = %s AND analysis_status = 'pending'>
        row = cur.fetchone()
        if not row:
            return jsonify({'error': 'Bu hastaya ait analiz edilmemiş röntgen bulunamadı!'}), 404

        xray_image_id, image_url = row
        original_image_path = f'uploads/{os.path.basename(image_url)}'

        # Dosyayı indir ve kaydet
        os.makedirs('uploads', exist_ok=True)
        response = requests.get(image_url, timeout=10)
        if response.status_code != 200:
            return jsonify({'error': 'Görüntü dosyası indirilemedi!'}), 400
        with open(original_image_path, 'wb') as f:
  f.write(response.content)

        # YOLO tahmini yap
        results = model.predict(original_image_path, conf=0.5, save=True)  # Otomatik kaydetme
        print("Saved results to:", results[0].path)

        if not results:
            return jsonify({'error': 'Tahmin sonuçları boş döndü!'}), 500

        # Annotated dosya yolu
        annotated_image_path = results[0].path

        # Tahmin sonuçlarını veritabanına kaydet
        detections = []
        for result in results:
            for box in result.boxes:
                class_id = int(box.cls.numpy()[0])
                confidence = float(box.conf.numpy()[0])
                class_name = CLASS_NAMES.get(class_id, "Unknown")

                cur.execute(
                    """INSERT INTO analysis_results
                       (xray_image_id, result_text, confidence_score, generated_at)
                       VALUES (%s, %s, %s, NOW())""",
                    (xray_image_id, class_name, confidence)
                )
                detections.append({'class': class_name, 'confidence': confidence})

        # analysis_status güncelle
        cur.execute("UPDATE xray_images SET analysis_status = 'completed' WHERE id = %s", (xray_image_id,))
        conn.commit()

        return jsonify({
            'message': 'Tahmin tamamlandı!',
      'detections': detections,
            'annotated_image': f"http://{request.host}/{annotated_image_path}"
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        # Bağlantıyı geri bırak
        if 'conn' in locals():
            db_pool.putconn(conn)

# Statik dosyaları servis et
@app.route('/uploads/<path:filename>')
def serve_uploaded_file(filename):
    return send_from_directory('uploads', filename)

@app.route('/runs/detect/predict/<path:filename>')
def serve_annotated_file(filename):
    return send_from_directory('runs/detect/predict', filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)