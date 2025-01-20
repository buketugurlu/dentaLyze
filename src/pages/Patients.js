import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer/footer";
import Header from "../components/header/header";
import Nav from "../components/nav/nav";
import "./patients.css";

const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = React.useState([]);

  // Hastaları yükle
  React.useEffect(() => {
    fetch("http://localhost:5000/api/patients")
      .then((res) => res.json())
      .then((data) => setPatients(data))
      .catch((err) => console.error("Hastalar alınırken hata oluştu:", err));
  }, []);

  // 1) Analizi tetikle + Detay sayfasına yönlendir
  const analyzeAndGoToDetails = async (patientId) => {
    try {
      const formData = new FormData();
      formData.append("patient_id", patientId);

      const response = await fetch("http://34.76.254.4:8080/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Analiz başarısız");
      }

      const data = await response.json();
      console.log("Analyze response:", data);
      alert("Analiz tamamlandı!");
      navigate(`/patient/${patientId}`);
    } catch (err) {
      console.error("Analiz isteğinde hata oluştu:", err);
      alert("Analiz sırasında hata oluştu: " + err.message);
    }
  };

  // Hasta silme
  const deletePatient = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/patients/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        alert("Hasta başarıyla silindi");
        setPatients((prev) => prev.filter((patient) => patient.id !== id));
      } else {
        alert("Hasta silme başarısız");
      }
    } catch (err) {
      console.error("Hasta silinirken hata oluştu:", err);
    }
  };

  // Completed röntgenleri gör sayfasına yönlendirme
  const goToCompletedXrays = (patientId) => {
    navigate(`/patient/${patientId}/completed`);
  };

  return (
    <div>
      <Header />
      <Nav />
      <div className="patients-container">
        <h1>Hasta Listesi</h1>
        <table className="patients-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ad Soyad</th>
              <th>Doğum Tarihi</th>
              <th>Cinsiyet</th>
              <th>Kayıt Tarihi</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {patients.length > 0 ? (
              patients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.id}</td>
                  <td>{patient.name}</td>
                  <td>{new Date(patient.birth_date).toLocaleDateString()}</td>
                  <td>{patient.gender}</td>
                  <td>
                    {patient.registration_date
                      ? new Date(patient.registration_date).toLocaleDateString()
                      : ""}
                  </td>
                  <td>
                    <button
                      className="patient-button"
                      onClick={() => analyzeAndGoToDetails(patient.id)}
                    >
                      Analiz Et
                    </button>

                    <button
                      className="patient-button"
                      onClick={() => deletePatient(patient.id)}
                    >
                      Sil
                    </button>

                    {/* Completed röntgenleri gör butonu */}
                    <button
                      className="patient-button"
                      onClick={() => goToCompletedXrays(patient.id)}
                    >
                      Geçmiş Analizi Gör
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">Kayıtlı hasta bulunamadı.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="patients-add-button-container">
        <button
          onClick={() => navigate("/add-patients")}
          className="patient-button"
        >
          Hasta Ekle
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default Patients;
