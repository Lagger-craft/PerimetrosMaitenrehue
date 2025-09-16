import React from "react";
import { Link } from "react-router-dom";
import { Modal, Button, Nav } from "react-bootstrap";
import { CheckCircleFill, Telephone, Facebook } from "react-bootstrap-icons";
import "./InfoModal.css"; // Import custom modal styles

const InfoModal = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Más Información sobre PerimetrosMaitenrehue</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Somos una empresa familiar dedicada a la fabricación e instalación de
          cercos vibrados de alta calidad en el sur de Chile. Nos enorgullece
          ofrecer soluciones duraderas, estéticas y seguras para propiedades
          residenciales, comerciales e industriales.
        </p>
        <h6>Nuestras características principales:</h6>
        <ul>
          <li>
            <CheckCircleFill className="icon-check me-2" /> Materiales de
            primera calidad.
          </li>
          <li>
            <CheckCircleFill className="icon-check me-2" /> Instalación
            profesional y rápida.
          </li>
          <li>
            <CheckCircleFill className="icon-check me-2" /> Diseños
            personalizados.
          </li>
          <li>
            <CheckCircleFill className="icon-check me-2" /> Resistencia a
            condiciones climáticas extremas.
          </li>
        </ul>
        <hr />
        <h6>Contacto Directo:</h6>
        <Nav className="flex-column">
          <Nav.Link
            href="tel:+56987761691"
            className="d-flex align-items-center contact-link-modal"
          >
            <Telephone className="me-2" />
            +56 9 8776 1691
          </Nav.Link>
          <Nav.Link
            href="https://www.facebook.com/empresafamiliarag.ltda/"
            target="_blank"
            rel="noopener noreferrer"
            className="d-flex align-items-center contact-link-modal"
          >
            <Facebook className="me-2" />
            Visita nuestro Facebook
          </Nav.Link>
        </Nav>
      </Modal.Body>
      <Modal.Footer>
        <Button as={Link} to="/cotizar" variant="primary" onClick={handleClose}>
          Contactar
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Entendido
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InfoModal;
