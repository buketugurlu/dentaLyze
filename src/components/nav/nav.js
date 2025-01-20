import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./nav.css";

const Nav = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Kullanıcı oturum bilgisi
  const navigate = useNavigate();

  useEffect(() => {
    // localStorage'dan oturum bilgisini kontrol et
    const user = localStorage.getItem("user");
    if (user) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user"); // Kullanıcı oturum bilgisini sil
    setIsAuthenticated(false);
    navigate("/giris"); // Çıkış yapınca giriş sayfasına yönlendir
  };

  return (
    <nav className="nav">
      <Link to="/anasayfa">Anasayfa</Link>
      <Link to="/ozellikler">Özellikler</Link>
      <Link to="/nasil-calisir">Nasıl Çalışır</Link>
      <Link to="/hakkinda">Hakkında</Link>
      <Link to="/iletisim">İletişim</Link>
      {!isAuthenticated ? (
        <Link to="/giris">Giriş Yap</Link>
      ) : (
        <>
          <Link to="/patients">Hasta Listesi</Link>
          <button onClick={handleLogout} className="logout-button">Çıkış Yap</button>
        </>
      )}
    </nav>
  );
};

export default Nav;
