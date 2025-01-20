import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./PatientDetails.css";
import Header from "../components/header/header";
import Nav from "../components/nav/nav";
import Footer from "../components/footer/footer";

const PatientDetails = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [xrays, setXrays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [prescription, setPrescription] = useState("");
  const [controlDate, setControlDate] = useState("");
  const handleSave = () => {
    console.log("Teşhis:", diagnosis);
    console.log("Tedavi Planı:", treatmentPlan);
    console.log("Reçete:", prescription);
    console.log("Kontrol Tarihi:", controlDate);
    alert("Veriler kaydedildi!");
  };

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const patientResponse = await fetch(`http://localhost:5000/api/patients/${id}`);
        if (!patientResponse.ok) {
          throw new Error("Hasta bilgileri alınamadı.");
        }
        const patientData = await patientResponse.json();

        const xrayResponse = await fetch(`http://localhost:5000/api/patient/${id}/xrays`);
        if (!xrayResponse.ok) {
          throw new Error("Röntgen bilgileri alınamadı.");
        }
        const xrayData = await xrayResponse.json();

        const xraysWithResults = await Promise.all(
          xrayData.map(async (xray) => {
            const resultResponse = await fetch(
              `http://localhost:5000/api/xray/${xray.id}/results`
            );
            const resultData = await resultResponse.json();
            return { ...xray, analysis_results: resultData };
          })
        );
    

        setPatient(patientData);
        setXrays(xraysWithResults);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
  }, [id]);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata: {error}</p>;

  return (
    <div>
      <Header />
      <Nav />
      <div className="patient-details-container">
        <h2>Hasta Detayları</h2>
        {patient && (
          <div className ="patient-info-container">     
            <p>Ad Soyad: {patient.name}</p>
            <p>Doğum Tarihi: {new Date(patient.birth_date).toLocaleDateString()}</p>
            <p>Cinsiyet: {patient.gender}</p>
          </div>
        )}

        <h2>Röntgenler</h2>
        {xrays.length > 0 ? (
          xrays.map((xray) => (
            <div key={xray.id} className="xray-container">
              <img
                src={xray.image_url}
                alt="Orijinal Röntgen"
                className="xray-image"
              />
             <img
  src={`http://34.76.254.4:8080/runs/detect/predict/${xray.image_url.split("/").pop()}`}
  alt="Analiz Röntgen"
  className="xray-image"
  onLoad={async () => {
    try {
      const response = await fetch('http://localhost:5000/api/upload-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: `http://34.76.254.4:8080/runs/detect/predict/${xray.image_url.split("/").pop()}`
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Yükleme başarılı:', data.gcsUrl);
      } else {
        console.error('Yükleme hatası:', await response.text());
      }
    } catch (err) {
      console.error('API çağrısı sırasında hata:', err);
    }
  }}
/>
              <div className="information-container">
                <h3>Analiz Sonuçları</h3>
                <ul>
                  {xray.analysis_results && xray.analysis_results.length > 0 ? (
                    xray.analysis_results.map((result, index) => (
                      <li key={index}>
                        {result.result_text} - Güven Skoru: {Number(result.confidence_score).toFixed(2)}
                      </li>
                    ))
                  ) : (
                    <p>Analiz sonucu bulunamadı.</p>
                  )}
                </ul>
              </div>
            </div>
        
          ))
        ) : (
          <p>Röntgen bulunamadı.</p>
        )}
        <div className="new-diagnosis">
          <h3>Yeni Teşhis ve Tedavi</h3>
          <label>Yeni Teşhis</label>
          <input
            type="text"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Yeni teşhis girin"
          />
          <label>Tedavi Planı</label>
          <textarea
            value={treatmentPlan}
            onChange={(e) => setTreatmentPlan(e.target.value)}
            placeholder="Tedavi planını girin"
          />
          <label>Reçete</label>
          <textarea
            value={prescription}
            onChange={(e) => setPrescription(e.target.value)}
            placeholder="Reçete detaylarını girin"
          />
          <label>Kontrol Tarihi</label>
          <input
            type="date"
            value={controlDate}
            onChange={(e) => setControlDate(e.target.value)}
            className="date-picker"
          />
          <button className="save-button" onClick={handleSave}>
            Kaydet
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PatientDetails;
