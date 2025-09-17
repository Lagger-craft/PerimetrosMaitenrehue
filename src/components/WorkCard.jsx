import React from "react";
import { Col, Figure } from "react-bootstrap";

const WorkCard = React.memo(({ work }) => {
  return (
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
  );
});

export default WorkCard;
