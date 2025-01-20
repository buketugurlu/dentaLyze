import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Yönlendirme için import
import "./giris.css";
import Header from "../components/header/header"; // Header bileşeni
import Nav from "../components/nav/nav"; // Nav bileşeni
import Footer from "../components/footer/footer";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // useNavigate hook'u

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error);
        return;
      }
  
      const data = await response.json();
      console.log("Giriş başarılı:", data);
  
      // Kullanıcı oturum bilgisini sakla
      localStorage.setItem("user", JSON.stringify(data.user));
  
      navigate("/patients"); // Başarılı girişte yönlendirme
    } catch (err) {
      console.error("Hata:", err);
      setError("Sunucu hatası, lütfen daha sonra tekrar deneyin.");
    }
  };
  

  return (
    <div>
      <Header />
      <Nav />
      <div className="auth-container">
        <div className="auth-box">
          <h2>Giriş Yap</h2>
          {error && <p style={{ color: "red" }}>{error}</p>} {/* Hata mesajı */}
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Kullanıcı Adı"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="auth-button">
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Auth;
