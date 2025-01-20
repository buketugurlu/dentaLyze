import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Addpatients.css";
import Header from "../components/header/header";
import Nav from "../components/nav/nav";
import Footer from "../components/footer/footer";

const AddPatient = () => {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          birth_date: birthDate,
          gender,
          registration_date: new Date().toISOString().slice(0, 10),
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        alert(`Hasta başarıyla eklendi! Röntgen URL'si: ${data.xrayImageUrl}`);
        navigate("/patients"); // Hasta listesine yönlendir
      } else {
        alert("Hasta ekleme başarısız!");
      }
    } catch (err) {
      console.error("Hasta eklenirken hata oluştu:", err);
      alert("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };
  

  return (
    <div className="add-patient-container">
      <Header />
      <Nav />
      <form className="add-patient-form" onSubmit={handleSubmit}>
        <h1>Yeni Hasta Ekle</h1>
        <label htmlFor="name">Ad Soyad</label>
        <input
          type="text"
          id="name"
          placeholder="Ad Soyad"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label htmlFor="birthDate">Doğum Tarihi</label>
        <input
          type="date"
          id="birthDate"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
        />
        <label htmlFor="gender">Cinsiyet</label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">Cinsiyet Seçin</option>
          <option value="Erkek">Erkek</option>
          <option value="Kadın">Kadın</option>
        </select>
        <button className="submit-button" type="submit">
          Ekle
        </button>
      </form>
      <Footer />
    </div>
  );
};

export default AddPatient;
