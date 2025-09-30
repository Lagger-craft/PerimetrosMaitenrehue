import React from "react";
import { Link } from "react-router-dom";
import { Modal, Button, Nav } from "react-bootstrap";
import { CheckCircleFill, Telephone, Facebook, Whatsapp } from "react-bootstrap-icons";
import "./ModalCommon.css"; // Importar el CSS común para modales

const InfoModal = ({ show, handleClose }) => {
  const whatsappURL = "https://wa.me/56987761691?text=" + encodeURIComponent("Hola, me interesa obtener información sobre sus cercos vibrados. ¿Podrían ayudarme?");
  
  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    
    // Método más robusto para abrir WhatsApp
    const link = document.createElement('a');
    link.href = whatsappURL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Fallback para móviles
    setTimeout(() => {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.location.href = whatsappURL;
      }
    }, 100);
    
    handleClose();
  };

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
            onClick={handleWhatsAppClick}
            className="d-flex align-items-center contact-link-modal whatsapp-link"
            style={{ cursor: 'pointer' }}
          >
            <Whatsapp className="me-2" />
            Contactar por WhatsApp
          </Nav.Link>
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
