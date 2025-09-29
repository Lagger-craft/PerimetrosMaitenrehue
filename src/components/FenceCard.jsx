import React from "react";
import { Col, Card } from "react-bootstrap";

const FenceCard = React.memo(({ fence, handleShowModal }) => {
  return (
    <Col key={fence.id} className="d-flex">
      <Card 
        className="h-100 shadow-sm card-clickable" 
        onClick={() => handleShowModal(fence)}
      >
        <Card.Img variant="top" src={fence.image} alt={fence.title} />
        <Card.Body className="d-flex flex-column">
          <Card.Title className="fw-bold">{fence.title}</Card.Title>
          <Card.Text className="text-muted mt-auto">
            {fence.description.substring(0, 70)}...
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
});

export default FenceCard;
