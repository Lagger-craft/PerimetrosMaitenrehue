import React, { useState, useCallback } from "react";
import { Container, Row } from "react-bootstrap";
import "./FenceGallery.css";
import FenceDetailModal from "./FenceDetailModal"; // Importar el nuevo modal
import FenceCard from "./FenceCard"; // Importar el nuevo componente FenceCard

// Importaciones de imágenes
import palmetasImage from "../assets/palmetas.webp";
import cercoHomeImage from "../assets/Cerco-home.webp";
import cercoTrabajoImage from "../assets/cerco_trabajo.webp";
import cercoStockImage from "../assets/cercoHouse.webp";
import pilaPlametaImage from "../assets/palmetaLow.webp";

const fenceTypes = [
  {
    id: 1,
    image: palmetasImage,
    title: "Producción Local de Calidad",
    description:
      "Nuestras palmetas son fabricadas localmente, asegurando la más alta calidad y durabilidad. Apoyamos la economía local con productos de confianza.",
    height: "1.5mtrs",
  },
  {
    id: 2,
    image: cercoHomeImage,
    title: "Protección para tu Hogar",
    description:
      "Ofrecemos soluciones robustas y estéticas para la seguridad de tu hogar. Nuestros cercos no solo protegen, sino que también embellecen tu propiedad.",
    height: "1.9mtrs",
  },
  {
    id: 3,
    image: cercoTrabajoImage,
    title: "Instalación Fácil y Rápida",
    description:
      "Contamos con un equipo de expertos que garantiza una instalación eficiente y profesional, minimizando las molestias y asegurando un acabado perfecto.",
    height: "2.1mtrs",
  },
  {
    id: 4,
    image: cercoStockImage,
    title: "Cimentando Seguridad",
    description:
      "La base de nuestros cercos es la seguridad. Utilizamos materiales de primera para construir cimientos sólidos que perduran en el tiempo.",
    height: "2.4mtrs",
  },
  {
    id: 5,
    image: pilaPlametaImage,
    title: "El Cerco que Imaginaste",
    description:
      "Nos adaptamos a tus necesidades con diseños personalizados. Sea cual sea tu visión, podemos construir el cerco perfecto para ti.",
    height: "Variable",
  },
];

const FenceGallery = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFence, setSelectedFence] = useState(null);

  const handleShowModal = useCallback((fence) => {
    setSelectedFence(fence);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedFence(null);
  }, []);

  return (
    <>
      <section className="fence-gallery py-5">
        <Container>
          <h2 className="text-center mb-5 text-uppercase fw-semibold">
            Tipos de Cercos – Diseños y Materiales
          </h2>
          <Row
            xs={1}
            md={2}
            lg={3}
            xl={5}
            className="g-4 justify-content-center"
          >
            {fenceTypes.map((fence) => (
              <FenceCard
                key={fence.id}
                fence={fence}
                handleShowModal={handleShowModal}
              />
            ))}
          </Row>
        </Container>
      </section>

      <FenceDetailModal
        show={showModal}
        handleClose={handleCloseModal}
        fence={selectedFence}
      />
    </>
  );
};

export default FenceGallery;
