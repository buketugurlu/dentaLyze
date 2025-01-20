import React from "react";
import "./iletisim.css";
import Header from "../components/header/header"; // Header bileşeni
import Nav from "../components/nav/nav"; // Nav bileşeni
import Footer from "../components/footer/footer";

const Contact = () => {
  return (
    <div>
    <Header />
    <Nav />
    <div className="contact-container">
      {/* Cemre'nin İletişim Bilgileri */}
      <div className="contact-column">
        <h2>Cemre Doğan</h2>
        <ul>
          <li>
            <img src="/linkedin-logo.jpg" alt="LinkedIn - Cemre DOĞAN" />
            <a href="https://www.linkedin.com/in/cemre-do%C4%9Fan-297407235/" target="_blank" rel="noopener noreferrer">
            LinkedIn - Cemre DOĞAN
            </a>
          </li>
          <li>
            <img src="/github-logo.png" alt="GitHub - Cemre DOĞAN" />
            <a href="https://github.com/cemredogan-ceng" target="_blank" rel="noopener noreferrer">
            GitHub - Cemre DOĞAN
            </a>
          </li>
          <li>
            <img src="/email-logo.jpg" alt="E-posta" />
            <a href="mailto:cemredogan.ceng@outlook.com">
              cemredogan.ceng@outlook.com
            </a>
          </li>
          <li>
            <img src="/bakircay-logo.jpg" alt="Bakırçay Üniversitesi" />
            <a href="mailto:210601048@bakircay.edu.tr">
              210601048@bakircay.edu.tr
            </a>
          </li>
        </ul>
      </div>

      {/* Orta*/}
      <div className="contact-divider"></div>

      {/* Buket'in İletişim Bilgileri */}
      <div className="contact-column">
        <h2>Buket Uğurlu</h2>
        <ul>
          <li>
            <img src="/linkedin-logo.jpg" alt="LinkedIn - Buket UĞURLU" />
            <a href="https://www.linkedin.com/in/buket-u%C4%9Furlu-aa4482223/" target="_blank" rel="noopener noreferrer">
            LinkedIn - Buket UĞURLU
            </a>
          </li>
          <li>
            <img src="/github-logo.png" alt="GitHub - Buket UĞURLU" />
            <a href="https://github.com/buketugurlu" target="_blank" rel="noopener noreferrer">
            GitHub - Buket UĞURLU
            </a>
          </li>
          <li>
            <img src="/email-logo.jpg" alt="E-posta" />
            <a href="mailto:buketugurlu0@gmail.com">
              buketugurlu0@gmail.com
            </a>
          </li>
          <li>
            <img src="/bakircay-logo.jpg" alt="Bakırçay Üniversitesi" />
            <a href="mailto:210601028@bakircay.edu.tr">
              210601028@bakircay.edu.tr
            </a>
          </li>
        </ul>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default Contact;
