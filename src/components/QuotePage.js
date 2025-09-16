import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import './QuotePage.css';

const QuotePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    rut: '',
    phone: '',
    address: '',
    email: '',
    fenceHeight: '1.90m',
    linearMeters: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Por ahora, solo mostraremos los datos en la consola
    console.log('Datos del formulario de cotización:', formData);
    alert('Gracias por tu cotización. Nos pondremos en contacto contigo pronto.');
    // Aquí se podría limpiar el formulario si se desea
    // setFormData({ name: '', rut: '', phone: '', address: '', email: '', fenceHeight: '1.90m', linearMeters: '', message: '' });
  };

  return (
    <section className="quote-page-section">
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="quote-card">
              <Card.Body>
                <h2 className="text-center mb-4">Solicita tu Cotización</h2>
                <p className="text-center text-muted mb-4">
                  Completa el formulario y te enviaremos una cotización detallada a la brevedad.
                </p>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Nombre Completo</Form.Label>
                        <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formRut">
                        <Form.Label>RUT</Form.Label>
                        <Form.Control type="text" name="rut" value={formData.rut} onChange={handleChange} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formPhone">
                        <Form.Label>Número de Teléfono</Form.Label>
                        <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Correo Electrónico</Form.Label>
                        <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3" controlId="formAddress">
                    <Form.Label>Dirección / Comuna</Form.Label>
                    <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} required />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formFenceHeight">
                        <Form.Label>Altura del Cerco</Form.Label>
                        <Form.Select name="fenceHeight" value={formData.fenceHeight} onChange={handleChange}>
                          <option>1.90m</option>
                          <option>2.10m</option>
                          <option>2.40m</option>
                          <option>Otra</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formLinearMeters">
                        <Form.Label>Metros Lineales (aprox.)</Form.Label>
                        <Form.Control type="number" name="linearMeters" value={formData.linearMeters} onChange={handleChange} required />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3" controlId="formMessage">
                    <Form.Label>Mensaje Adicional</Form.Label>
                    <Form.Control as="textarea" name="message" rows={4} value={formData.message} onChange={handleChange} placeholder="Indícanos cualquier detalle importante para tu proyecto." />
                  </Form.Group>

                  <div className="d-grid">
                    <Button variant="primary" type="submit" size="lg">
                      Enviar Cotización
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default QuotePage;
