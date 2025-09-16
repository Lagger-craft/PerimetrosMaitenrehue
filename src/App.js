import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AppNavbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FenceGallery from "./components/FenceGallery";
import WorksSection from "./components/WorksSection";
import Footer from "./components/Footer";
import InfoModal from "./components/InfoModal";
import Login from "./components/auth/Login.jsx";
import Register from "./components/auth/Register.jsx";
import QuotePage from "./components/QuotePage"; // Importar la nueva página

function App() {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <div className="App">
      <AppNavbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection handleShowModal={handleShow} />
              <FenceGallery />
              <WorksSection />
              <Footer />
              <InfoModal show={showModal} handleClose={handleClose} />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cotizar" element={<QuotePage />} /> {/* Añadir la nueva ruta */}
      </Routes>
    </div>
  );
}

export default App;
