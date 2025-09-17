import React from 'react';
import { Link } from 'react-router-dom';
import { Modal, Button, Image } from 'react-bootstrap';
import './ModalCommon.css'; // Importar el CSS común para modales

const FenceDetailModal = ({ show, handleClose, fence }) => {
  if (!fence) {
    return null;
  }

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
        <Button as={Link} to="/cotizar" variant="primary" onClick={handleClose}>
          Cotizar este cerco
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FenceDetailModal;
