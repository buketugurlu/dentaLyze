import React from "react";
import "./nasilcalisir.css";
import Header from "../components/header/header"; // Header bileşeni
import Nav from "../components/nav/nav"; // Nav bileşeni
import Footer from "../components/footer/footer";

const NasilCalisir = () => {
  return (
    <div>
      <Header />
      <Nav />
      <div className="how-it-works-container">
        <h1>Nasıl Çalışır?</h1>
        <p>DentaLyze, diş hekimlerine dental röntgen analizlerinde yardımcı olmak için tasarlanmış bir yapay zeka destekli sistemdir. Kullanımı son derece kolaydır ve aşağıdaki adımları içerir:</p>
        
        <div className="steps">
          <div className="step">
            <h2>1. Röntgen Yükleyin</h2>
            <p>Hasta detay sayfasına giderek ilgili hastaya ait röntgen görüntüsünü sisteme yükleyin. Sistemin analiz etmesi için <strong>"Görüntü Yükle"</strong> butonuna tıklayın.</p>
          </div>
          
          <div className="step">
            <h2>2. Analiz Sonuçlarını Görün</h2>
            <p>Sistem, yüklediğiniz röntgeni otomatik olarak analiz eder ve çürük, gömülü diş, enfeksiyon gibi durumları tespit eder. Analiz sonuçları, röntgen üzerinde <strong>işaretlenmiş alanlar</strong> ile gösterilir.</p>
          </div>
          
          <div className="step">
            <h2>3. Tedavi Planınızı Belirleyin</h2>
            <p>Analiz sonuçlarına göre hastaya uygun teşhis ve tedavi planını sisteme kaydedin. Sistem, geçmiş teşhis ve tedavi kayıtlarını da görüntülemenizi sağlar.</p>
          </div>
        </div>

        <div className="benefits">
          <h2>DENTALYZE</h2>
          <br></br>
          <ul>
            <li>Hızlı ve doğru analizler.</li>
            <li>Çürük, kırık diş, enfeksiyon gibi 6 farklı dental sorunun tespiti.</li>
            <li>Kullanıcı dostu arayüz.</li>
            <li>Geçmiş teşhis ve tedavi kayıtlarının kolay erişimi.</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NasilCalisir;
