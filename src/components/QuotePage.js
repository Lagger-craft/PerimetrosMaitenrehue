import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import './QuotePage.css';

const QuotePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    rut: '',
    phone: '',
    address: '',
    email: '',
    fenceHeight: '1.90m',
    fenceType: 'Cerco Vibrado Estándar', // Nuevo campo
    linearMeters: '',
    message: '',
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [validated, setValidated] = useState(false); // Estado para validación de Bootstrap

  const formatRut = (value) => {
    // Limpiar el RUT de caracteres no numéricos y puntos
    let cleaned = value.replace(/[^0-9kK]/g, '');

    // Convertir a mayúscula la K si existe
    cleaned = cleaned.toUpperCase();

    // Aplicar formato: XX.XXX.XXX-X
    let formatted = '';
    if (cleaned.length > 1) {
      formatted = cleaned.slice(-1);
      cleaned = cleaned.slice(0, -1);
    }

    while (cleaned.length > 3) {
      formatted = '.' + cleaned.slice(-3) + formatted;
      cleaned = cleaned.slice(0, -3);
    }

    if (cleaned.length > 0) {
      formatted = cleaned + formatted;
    }

    if (formatted.length > 0 && value.includes('-')) {
      formatted = formatted.replace(/\.(?=[0-9]{3}-)/g, ''); // Evitar doble punto antes del guion
      formatted = formatted.replace(/-(?=[0-9]{3})/g, ''); // Evitar doble guion
    }

    if (formatted.length > 0 && !formatted.includes('-')) {
      formatted = formatted.slice(0, -1) + '-' + formatted.slice(-1);
    }

    return formatted;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'rut') {
      newValue = formatRut(value);
    }

    setFormData(prevState => {
      const newState = { ...prevState, [name]: newValue };
      // Actualizar fenceType basado en fenceHeight
      if (name === 'fenceHeight') {
        newState.fenceType = value === 'Otra' ? 'Cerco Vibrado Personalizado' : `Cerco Vibrado ${value}`;
      }
      return newState;
    });
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity() === false) {
      setValidated(true);
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    setMessage(null);
    setError(null);
    setValidated(false); // Reset validation state on successful attempt

    try {
      const response = await fetch('http://localhost:5000/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar la cotización');
      }

      setMessage('¡Cotización enviada exitosamente! Nos pondremos en contacto contigo pronto.');
      setFormData({
        name: '',
        rut: '',
        phone: '',
        address: '',
        email: '',
        fenceHeight: '1.90m',
        fenceType: 'Cerco Vibrado Estándar', // Resetear también
        linearMeters: '',
        message: '',
      });
      setValidated(false); // Reset validation state on successful submission

    } catch (err) {
      setError(err.message);
    }
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
                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Nombre Completo</Form.Label>
                        <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
                        <Form.Control.Feedback type="invalid">Por favor, ingresa tu nombre completo.</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formRut">
                        <Form.Label>RUT</Form.Label>
                        <Form.Control type="text" name="rut" value={formData.rut} onChange={handleChange} required pattern="^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]{1}$" />
                        <Form.Control.Feedback type="invalid">Por favor, ingresa un RUT válido (ej. 12.345.678-9).</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formPhone">
                        <Form.Label>Número de Teléfono</Form.Label>
                        <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
                        <Form.Control.Feedback type="invalid">Por favor, ingresa tu número de teléfono.</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Correo Electrónico</Form.Label>
                        <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                        <Form.Control.Feedback type="invalid">Por favor, ingresa un correo electrónico válido.</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3" controlId="formAddress">
                    <Form.Label>Dirección / Comuna</Form.Label>
                    <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} required />
                    <Form.Control.Feedback type="invalid">Por favor, ingresa tu dirección o comuna.</Form.Control.Feedback>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formFenceHeight">
                        <Form.Label>Altura del Cerco</Form.Label>
                        <Form.Select name="fenceHeight" value={formData.fenceHeight} onChange={handleChange} required>
                          <option value="">Selecciona una altura</option>
                          <option>1.90m</option>
                          <option>2.10m</option>
                          <option>2.40m</option>
                          <option>Otra</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">Por favor, selecciona la altura del cerco.</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formLinearMeters">
                        <Form.Label>Metros Lineales (aprox.)</Form.Label>
                        <Form.Control type="number" name="linearMeters" value={formData.linearMeters} onChange={handleChange} required min="1" />
                        <Form.Control.Feedback type="invalid">Por favor, ingresa los metros lineales.</Form.Control.Feedback>
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
