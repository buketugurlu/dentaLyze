import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // BrowserRouter düzeltildi
import Anasayfa from "./pages/Anasayfa";
import Ozellikler from "./pages/Ozellikler";
import NasilCalisir from "./pages/NasilCalisir";
import Giris from "./pages/Giris";
import Hakkinda from "./pages/Hakkinda";
import Iletisim from "./pages/Iletisim";
import Patients from "./pages/Patients";
import PatientDetails from "./pages/PatientDetails";
import AddPatients from "./pages/AddPatients";
import PatientCompletedXrays from "./pages/PatientCompletedXrays";

const App = () => {
  return (
    <Routes>
      {/* Anasayfa yönlendirmesi */}
      <Route path="/" element={<Navigate to="/anasayfa" />} />
      {/* Diğer sayfa yolları */}
      <Route path="/anasayfa" element={<Anasayfa />} />
      <Route path="/ozellikler" element={<Ozellikler />} />
      <Route path="/nasil-calisir" element={<NasilCalisir />} />
      <Route path="/giris" element={<Giris />} />
      <Route path="/hakkinda" element={<Hakkinda />} />
      <Route path="/iletisim" element={<Iletisim />} />
      <Route path="/patients" element={<Patients />} />
      <Route path="/patient/:id" element={<PatientDetails />} />
      <Route path="/add-patients" element={<AddPatients />} />
      <Route path="/patient/:id/completed" element={<PatientCompletedXrays />} />

    </Routes>
  );
};

export default App;
