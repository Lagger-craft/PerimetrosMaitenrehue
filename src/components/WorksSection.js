import React from "react";
import { Container, Row, Col, Figure } from "react-bootstrap";
import "./WorksSection.css";
import tb_term from "../assets/tb_terminado.jpg";
import tb_term2 from "../assets/tb_terminado2.jpg";

const workExamples = [
  {
    id: 1,
    image: tb_term,
    caption:
      "Este cerco vibrado es la solución ideal para marcar los límites de forma clara y profesional. Con su diseño simple y robusto, ofrecemos una delimitación segura y de bajo mantenimiento que se integra perfectamente en entornos de parcelas o terrenos residenciales. Una inversión en durabilidad y estética para tu propiedad.",
  },
  {
    id: 2,
    image: tb_term2,
    caption:
      "Cada proyecto es único, y en este caso, nuestro cerco vibrado fue instalado para proporcionar protección y privacidad a una vivienda. Sus paneles con líneas horizontales no solo ofrecen la solidez que nos caracteriza, sino que también añaden un toque moderno que complementa la arquitectura de tu hogar. La tranquilidad de tu familia es nuestra prioridad.",
  },
];

const WorksSection = () => {
  return (
    <section className="works-section py-5">
      <Container>
        <h2 className="text-center mb-5 text-uppercase fw-semibold">
          Imágenes Trabajos Realizados
        </h2>
        <Row className="justify-content-center">
          {workExamples.map((work) => (
            <Col md={6} key={work.id} className="mb-4 d-flex">
              <Figure className="w-100 h-100">
                <Figure.Image
                  className="w-100 shadow-sm rounded"
                  alt={work.caption}
                  src={work.image}
                />
                <Figure.Caption className="text-center text-muted mt-2">
                  {work.caption}
                </Figure.Caption>
              </Figure>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default WorksSection;
