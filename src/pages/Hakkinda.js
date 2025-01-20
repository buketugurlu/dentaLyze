import React from "react";
import "./hakkinda.css";
import Header from "../components/header/header"; // Header bileşeni
import Nav from "../components/nav/nav"; // Nav bileşeni
import Footer from "../components/footer/footer";

const Hakkinda = () => {
  return (
    <div>
        <Header />
        <Nav />
        <div className="hakkinda-container">
      <h1>Hakkımızda</h1>
      <p>
        <span className="highlight">DentaLyze</span>, diş röntgenlerinde yüksek doğrulukla analizler yapmak ve 6 farklı diş hastalığını tespit etmek için <span className="highlight">YOLOv8</span> gibi son teknoloji derin öğrenme modellerini kullanan bir projedir. Amacımız, diş hekimlerine yardımcı olarak teşhis sürecini hızlandırmak ve iyileştirmek.
      </p>

      <h2>Tespit Edilen Hastalıklar</h2>
      <ul>
        <li>
          <strong>Sağlıklı Dişler:</strong> 
          <p>Röntgen görüntülerinde hiçbir anormal yapı tespit edilmediğinde dişler sağlıklı olarak değerlendirilir.</p>
        </li>
        <li>
          <strong>Çürükler:</strong> 
          <p>Diş yüzeyinde kararma, boşluk veya diş minesinin bozulmasıyla oluşan çürükler, görüntü analiziyle algılanır.</p>
        </li>
        <li>
          <strong>Gömülü Dişler:</strong> 
          <p>Diş eti altında kalan ve çıkmamış dişler röntgen üzerinden tespit edilir.</p>
        </li>
        <li>
          <strong>Kök veya Taç Kırıkları:</strong> 
          <p>Dişin kök veya taç kısmındaki çatlaklar ve kırıklar, yapısal bozukluklar üzerinden algılanır.</p>
        </li>
        <li>
          <strong>Enfeksiyonlar:</strong> 
          <p>Diş kökü çevresindeki iltihaplanmalar, görüntüdeki anormal dokular yardımıyla belirlenir.</p>
        </li>
        <li>
          <strong>Çatlak Dişler:</strong> 
          <p>Diş üzerinde ince çizgiler veya kırılma belirtileri görüntü analiziyle fark edilir.</p>
        </li>
      </ul>

      <div className="team">
        <h3>Takımımız</h3>
        <p>
          Bu proje, <span className="highlight">İnsan mı Makine mi?</span> yarışmasında finale kalan bir projedir. <br />
          İzmir Bakırçay Üniversitesi 4. sınıf öğrencileri <span className="highlight">Cemre Doğan</span> ve <span className="highlight">Buket Uğurlu</span> tarafından geliştirilmiştir. 
        </p>
        <img src="/insan-mi-makine-mi.jpg" alt="Cemre Doğan ve Buket Uğurlu" />
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default Hakkinda;
