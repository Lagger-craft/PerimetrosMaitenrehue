import React from "react";
import { Container, Row } from "react-bootstrap";
import "./WorksSection.css";
import WorkCard from "./WorkCard"; // Importar el nuevo componente WorkCard

// Importaciones de imágenes
import tbTerminadoImage from "../assets/tb_terminado.webp";
import tbTerminado2Image from "../assets/tb_terminado2.webp";

const workExamples = [
  {
    id: 1,
    image: tbTerminadoImage,
    caption:
      "Este cerco vibrado es la solución ideal para marcar los límites de forma clara y profesional. Con su diseño simple y robusto, ofrecemos una delimitación segura y de bajo mantenimiento que se integra perfectamente en entornos de parcelas o terrenos residenciales. Una inversión en durabilidad y estética para tu propiedad.",
  },
  {
    id: 2,
    image: tbTerminado2Image,
    caption:
      "Cada proyecto es único, y en este caso, nuestro cerco vibrado fue instalado para proporcionar protección y privacidad a una vivienda. Sus paneles con líneas horizontales no solo ofrecen la solidez que nos caracteriza, sino que también añaden un toque moderno que complementa la arquitectura de tu hogar. La tranquilidad de tu familia es nuestra prioridad.",
  },
];

const WorksSection = () => {
  return (
    <section className="works-section py-5">
      <Container>
        <h2 className="text-center mb-5 text-uppercase fw-semibold">
          Ultimos Trabajos Realizados
        </h2>
        <Row className="justify-content-center">
          {workExamples.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default WorksSection;
