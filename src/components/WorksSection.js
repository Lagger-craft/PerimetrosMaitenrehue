import React from 'react';
import { Container, Row, Col, Figure } from 'react-bootstrap';
import './WorksSection.css';

const workExamples = [
  {
    id: 1,
    image: 'https://via.placeholder.com/600x400?text=Proyecto+1',
    caption: 'Proyecto residencial en Puerto Varas: 50 metros lineales de cerco vibrado.',
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/600x400?text=Proyecto+2',
    caption: 'Cierre perimetral en Osorno: 80 metros lineales para parcela.',
  },
];

const WorksSection = () => {
  return (
    <section className="works-section py-5">
      <Container>
        <h2 className="text-center mb-5 text-uppercase fw-semibold">Imágenes Trabajos Realizados</h2>
        <Row className="justify-content-center">
          {workExamples.map((work) => (
            <Col md={6} key={work.id} className="mb-4">
              <Figure className="w-100">
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
