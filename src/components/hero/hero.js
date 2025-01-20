import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./hero.css";

const Hero = () => {
const navigate = useNavigate(); // React Router'dan yönlendirme fonksiyonu
const handleOzelliklerClick = () => {
    navigate("/ozellikler"); // Özellikler sayfasına yönlendirir.
  };

const handleGirisClick = () => {
    navigate("/giris"); // Özellikler sayfasına yönlendirir.
  };
  useEffect(() => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars = Array(150)
      .fill()
      .map(() => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.5,
        speed: Math.random() * 0.5 + 0.2,
      }));

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
        star.x -= star.speed;
        if (star.x < 0) star.x = canvas.width;
      });
      requestAnimationFrame(drawStars);
    };
    drawStars();

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <section className="hero" id="anasayfa">
      <h1>AI Destekli Diş Sağlığı Analizi</h1>
      <p>
        DentaLyze, diş röntgen görüntülerindeki sorunları hızlı ve doğru bir
        şekilde teşhis etmek için gelişmiş derin öğrenme teknolojilerini
        kullanır.
      </p>
      <button onClick={handleOzelliklerClick} className="button-primary">
        Özelliklere Göz At
        </button>
      <br></br>
      <button onClick={handleGirisClick} className="button-secondary">
        Şimdi Kullanmaya Başlayın
      </button>
      <canvas></canvas>
    </section>
  );
};

export default Hero;
