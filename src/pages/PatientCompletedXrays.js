import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./patientcompletedxrays.css";
import Header from "../components/header/header"; // Header bileşeni
import Nav from "../components/nav/nav"; // Nav bileşeni
import Footer from "../components/footer/footer";

const PatientCompletedXrays = () => {
  const { id } = useParams(); // URL'den hasta ID'sini al
  const [xrays, setXrays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompletedXrays = async () => {
      try {
        // Röntgen bilgilerini getir, sadece "completed" durumundakiler
        const response = await fetch(`http://localhost:5000/api/patient/${id}/xrays`);
        if (!response.ok) {
          throw new Error("Röntgen bilgileri alınamadı.");
        }
        const data = await response.json();

        // Sadece "completed" durumundakileri filtrele
        const completedXrays = data.filter((xray) => xray.analysis_status === "completed");

        // Her röntgenin analiz edilmiş URL'sini ekle
        const xraysWithAnnotatedUrls = completedXrays.map((xray) => {
          return {
            ...xray,
            annotatedUrl: `https://storage.googleapis.com/dentalyze_yolo_results/${xray.image_url.split("/").pop()}`, // Annotated URL
          };
        });

        setXrays(xraysWithAnnotatedUrls);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedXrays();
  }, [id]);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata: {error}</p>;

  return (
    <div>
      <Header />
      <Nav />
      <div className="completed-xrays-container">
        <h1>Analizi Yapılmış Röntgenler</h1>
        {xrays.length > 0 ? (
          xrays.map((xray) => (
            <div key={xray.id} className="xray-container">
              <h3>Röntgen ID: {xray.id}</h3>
              {/* Orijinal röntgen */}
              <img
                src={xray.image_url}
                alt="Orijinal Röntgen"
                className="xray-image"
                style={{ width: "700px", marginRight: "10px" }}
              />
              {/* Annotated röntgen */}
              <img
                src={xray.annotatedUrl}
                alt="Analiz Röntgen"
                className="xray-image"
                style={{ width: "700px" }}
              />
            </div>
          ))
        ) : (
          <p>Completed durumunda röntgen bulunamadı.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default PatientCompletedXrays;
