import React from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Image } from 'react-bootstrap';
import { Whatsapp } from 'react-bootstrap-icons';
import './ModalCommon.css'; // Importar el CSS común para modales

const FenceDetailModal = ({ show, handleClose, fence }) => {
  if (!fence) {
    return null;
  }

  const whatsappURL = "https://wa.me/56987761691?text=" + encodeURIComponent(`Hola, me interesa el ${fence.title}. ¿Podrían darme más información y cotización?`);
  
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
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{fence.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Image src={fence.image} fluid rounded className="mb-4" />
        <p>{fence.description}</p>
        {/* Aquí se podría añadir más información detallada en el futuro */}
        <ul>
            <li><strong>Altura:</strong> {fence.height}</li>
            <li><strong>Material:</strong> Hormigón vibrado de alta resistencia</li>
            <li><strong>Acabado:</strong> Liso o con textura</li>
            <li><strong>Uso recomendado:</strong> Residencial, industrial, agrícola</li>
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        <Button 
          onClick={handleWhatsAppClick}
          variant="success" 
          className="d-flex align-items-center"
        >
          <Whatsapp className="me-2" />
          Cotizar por WhatsApp
        </Button>
        <Button as={Link} to="/cotizar" variant="primary" onClick={handleClose}>
          Cotizar en el sitio
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FenceDetailModal;
