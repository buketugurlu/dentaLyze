import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; 2024 DentaLyze. Tüm hakları saklıdır.</p>
      <p>
        <a href="#gizlilik-politikasi">Gizlilik Politikası</a> |{" "}
        <a href="#kullanim-sartlari">Kullanım Şartları</a>
      </p>
    </footer>
  );
};

export default Footer;
