import React from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { Telephone, Facebook } from "react-bootstrap-icons";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer pt-5 pb-4">
      <Container>
        <Row className="justify-content-center text-center text-md-start">
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="fw-bold">CercoVibrados del Sur de Chile</h5>
            <p>Construyendo seguridad y belleza en cada cerco.</p>
          </Col>
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="fw-bold">Contacto</h5>
            <Nav className="flex-column footer-contact-nav">
              <Nav.Link
                href="tel:+56987761691"
                className="p-0 d-inline-flex align-items-center"
              >
                <Telephone className="me-2" />
                +56 9 8776 1691
              </Nav.Link>
              <Nav.Link
                href="https://www.facebook.com/empresafamiliarag.ltda/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-0 d-inline-flex align-items-center mt-2"
              >
                <Facebook className="me-2" />
                Empresafamiliarag.Ltda
              </Nav.Link>
            </Nav>
          </Col>
          <Col md={4}>
            <h5 className="fw-bold">Información Legal</h5>
            <ul className="list-unstyled">
              <li>Razón Social: Empresafamiliarag Ltda</li>
              <li>Giro: Fabricación e instalación de cercos</li>
            </ul>
          </Col>
        </Row>
        <hr className="my-4" />
        <div className="text-center">
          <p>
            &copy; {new Date().getFullYear()} CercoVibrados del Sur de Chile.
            Todos los derechos reservados.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
