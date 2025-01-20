import React from "react";
import "./features.css";

const Features = () => {
  return (
    <section className="features-section" id="ozellikler">
      <h2>Desteklenen Durumlar</h2>
      <div className="features">
        <div className="feature-item">
          <img src="/features1.jpg" alt="Çürükler" />
          <h3>Çürükler</h3>
          <p>Yüksek doğrulukla röntgen görüntülerinde çürükleri hızlıca tespit edin.</p>
        </div>
        <div className="feature-item">
          <img src="/features2.jpg" alt="Gömülü Dişler" />
          <h3>Gömülü Dişler</h3>
          <p>Tedavi planlaması için gömülü dişleri belirleyin.</p>
        </div>
        <div className="feature-item">
          <img src="/features3.jpg" alt="Kök veya Taç Kırıkları" />
          <h3>Kök veya Taç Kırıkları</h3>
          <p>Doğru bir teşhis için kök veya taç kırıklarını tespit edin.</p>
        </div>
        <div className="feature-item">
          <img src="/features4.jpg" alt="Enfeksiyonlar" />
          <h3>Enfeksiyonlar</h3>
          <p>Diş ve çevresindeki dokulardaki enfeksiyonları hızlıca tespit ederek tedavi sürecini kolaylaştırın.</p>
        </div>
        <div className="feature-item">
          <img src="/features5.jpg" alt="Çatlak Dişler" />
          <h3>Çatlak Dişler</h3>
          <p>Erken teşhis ile çatlak dişleri belirleyin ve diş kaybını önlemek için uygun tedavi planlayın.</p>
        </div>
      </div>
    </section>
  );
};

export default Features;
