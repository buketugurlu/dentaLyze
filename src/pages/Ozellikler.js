import React from "react";
import "./ozellikler.css";
import Header from "../components/header/header"; // Header bileşeni
import Nav from "../components/nav/nav"; // Nav bileşeni
import Footer from "../components/footer/footer";

const Ozellikler = () => {
  return (
    <div>
      <Header />
      <Nav />
      <div className="features-container">
        <h1>Özellikler</h1>

        <section className="feature">
          <h2>Projenin Amacı</h2>
          <p>
            DentaLyze, diş röntgen görüntülerinden çürük, gömülü diş ve diğer dental hastalıkları tespit etmeyi amaçlayan bir yapay zeka sistemidir. 
            Proje, hem hızlı hem de doğru teşhis süreçlerini destekleyerek hasta memnuniyetini artırmayı hedefler.
          </p>
        </section>

        <section className="feature">
          <h2>Kullanılan Teknolojiler</h2>
          <ul>
            <li><strong>Derin Öğrenme Modelleri:</strong> YOLOv8, dental hastalıkların tespiti için optimize edilmiştir.</li>
            <li><strong>Veri İşleme:</strong> CLAHE algoritması ve veri artırma teknikleriyle görüntülerin detaylarını artırma.</li>
            <li><strong>Backend:</strong> Flask framework ve PostgreSQL veritabanı kullanılmıştır.</li>
            <li><strong>Frontend:</strong> React.js tabanlı kullanıcı dostu arayüz.</li>
          </ul>
        </section>

        <section className="feature">
          <h2>Model Performansı</h2>
          <p>
            YOLOv8 modeli, dental röntgen görüntülerinde %94 doğruluk oranı ve %77 F1 skoru ile yüksek performans göstermektedir.
            <br />
            <strong>Öne çıkan başarılar:</strong>
          </p>
          <ul>
            <li>Çürük tespiti: %83 doğruluk</li>
            <li>Gömülü diş tespiti: %96 doğruluk</li>
            <li>Kırık diş tespiti: %90 doğruluk</li>
          </ul>
        </section>

        <section className="feature">
          <h2>Kullanıcı Dostu Arayüz</h2>
          <p>
            Diş hekimlerinin kolayca kullanabileceği şekilde tasarlanmış olan arayüz, hastalara ait detayları ve analiz sonuçlarını sistematik bir şekilde sunar. 
            <br />Özellikler:
          </p>
          <ul>
            <li>Röntgen yükleme ve analiz</li>
            <li>Hastaya özel teşhis ve tedavi planlama</li>
            <li>Geçmiş teşhis kayıtlarına erişim</li>
          </ul>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Ozellikler;
