import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "./FenceGallery.css";
import palmetasImage from "../assets/palmetas.jpeg"; // Importar la imagen
import cerco_home from "../assets/Cerco-home.jpg";

const fenceTypes = [
  {
    id: 1,
    image: palmetasImage, // Usar la imagen importada
    title: "Titulo",
    subtitle: "Ideal para delimitación básica",
  },
  {
    id: 2,
    image: cerco_home,
    title: "Titulo",
    subtitle: "Mayor seguridad y durabilidad",
  },
  {
    id: 3,
    image: "https://via.placeholder.com/300x200?text=Cerco+Tipo+3",
    title: "Titulo",
    subtitle: "Estilo y funcionalidad",
  },
  {
    id: 4,
    image: "https://via.placeholder.com/300x200?text=Cerco+Tipo+4",
    title: "Titulo",
    subtitle: "Para grandes superficies",
  },
  {
    id: 5,
    image: "https://via.placeholder.com/300x200?text=Cerco+Tipo+5",
    title: "Titulo",
    subtitle: "Diseño a tu medida",
  },
];

const FenceGallery = () => {
  return (
    <section className="fence-gallery py-5">
      <Container>
        <h2 className="text-center mb-5 text-uppercase fw-semibold">
          Galería de Tipos de Cercos
        </h2>
        <Row xs={1} md={2} lg={3} xl={5} className="g-4 justify-content-center">
          {fenceTypes.map((fence) => (
            <Col key={fence.id} className="d-flex">
              <Card className="h-100 shadow-sm">
                <Card.Img variant="top" src={fence.image} alt={fence.title} />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fw-bold">{fence.title}</Card.Title>
                  <Card.Text className="text-muted mt-auto">
                    {fence.subtitle}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default FenceGallery;
