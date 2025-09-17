import React, { useState, Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Importar el AuthProvider
import AppNavbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FenceGallery from "./components/FenceGallery";
import WorksSection from "./components/WorksSection";
import Footer from "./components/Footer";
import InfoModal from "./components/InfoModal";

// Lazy loading de componentes de ruta
const Login = lazy(() => import("./components/auth/Login.jsx"));
const Register = lazy(() => import("./components/auth/Register.jsx"));
const QuotePage = lazy(() => import("./components/QuotePage"));

function App() {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <AuthProvider> {/* Envolver la aplicación con el AuthProvider */}
      <div className="App">
        <AppNavbar />
        <Suspense fallback={<div className="text-center text-white p-5">Cargando...</div>}>
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
            <Route path="/cotizar" element={<QuotePage />} />
          </Routes>
        </Suspense>
      </div>
    </AuthProvider>
  );
}

export default App;
