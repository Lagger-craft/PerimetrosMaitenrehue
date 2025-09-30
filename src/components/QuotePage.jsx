import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Card,
  Alert,
} from "react-bootstrap";
import { ArrowRight } from "react-bootstrap-icons"; // Añadido para consistencia si se usa en otro lugar
import { API_ENDPOINTS } from "../config/api.js";
import "./QuotePage.css";
import cerco_stock from "../assets/cerco_stock.webp"; // Imagen genérica
import cerco_190 from "../assets/cerco-190.webp"; // Imagen específica para 1.90m

// Data structure for fence components based on height
const FENCE_COMPONENTS_BY_HEIGHT = {
  "1.50m": [
    "2 Placas de 50cm de alto",
    "1 Placa de 30cm de alto",
    "1 Barda (10cm de altura efectiva)",
  ],
  "1.90m": [
    "3 Placas de 50cm de alto",
    "1 Placa de 30cm de alto",
    "1 Barda (10cm de altura efectiva)",
  ],
  "2.20m": ["🚧 Proximamente"],
  Otra: [
    "Componentes para altura personalizada: Por favor, consulta con un asesor.",
  ],
};

const QuotePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    rut: "",
    phone: "",
    address: "",
    email: "",
    fenceHeight: "1.90m", // Default to 1.90m as it's the most detailed
    fenceType: "Cerco Vibrado Estándar",
    linearMeters: "",
    message: "",
  });
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [rutError, setRutError] = useState(null); // Nuevo estado para el error del RUT
  const [componentsList, setComponentsList] = useState(
    FENCE_COMPONENTS_BY_HEIGHT[formData.fenceHeight],
  );

  // useEffect para inicializar componentsList y actualizar la imagen al cargar el componente
  useEffect(() => {
    if (FENCE_COMPONENTS_BY_HEIGHT[formData.fenceHeight]) {
      setComponentsList(FENCE_COMPONENTS_BY_HEIGHT[formData.fenceHeight]);
    }
  }, [formData.fenceHeight]); // Dependencia en formData.fenceHeight para actualizar al cambiar

  // Función para validar el RUT chileno
  const validateRut = (rut) => {
    if (!/^[0-9]+[kK0-9]$/.test(rut)) {
      return false; // Formato básico incorrecto
    }

    const rutClean = rut.slice(0, -1);
    let dv = rut.slice(-1).toUpperCase();

    let sum = 0;
    let multiplier = 2;

    for (let i = rutClean.length - 1; i >= 0; i--) {
      sum += parseInt(rutClean[i], 10) * multiplier;
      multiplier++;
      if (multiplier > 7) {
        multiplier = 2;
      }
    }

    const remainder = sum % 11;
    let calculatedDv = 11 - remainder;

    if (calculatedDv === 11) {
      calculatedDv = "0";
    } else if (calculatedDv === 10) {
      calculatedDv = "K";
    } else {
      calculatedDv = String(calculatedDv);
    }

    return calculatedDv === dv;
  };

  const formatRut = (value) => {
    // Limpiar el RUT de caracteres no numéricos y puntos
    let cleaned = value.replace(/[^0-9kK]/g, "");

    // Limitar la longitud del RUT (ej. 9 dígitos para el número + 1 para el dígito verificador)
    if (cleaned.length > 9) {
      cleaned = cleaned.slice(0, 9);
    }

    // Convertir a mayúscula la K si existe
    cleaned = cleaned.toUpperCase();

    // Aplicar formato: XX.XXX.XXX-X
    let formatted = "";
    if (cleaned.length > 1) {
      formatted = cleaned.slice(-1);
      cleaned = cleaned.slice(0, -1);
    }

    while (cleaned.length > 3) {
      formatted = "." + cleaned.slice(-3) + formatted;
      cleaned = cleaned.slice(0, -3);
    }

    if (cleaned.length > 0) {
      formatted = cleaned + formatted;
    }

    if (formatted.length > 0 && !formatted.includes("-")) {
      formatted = formatted.slice(0, -1) + "-" + formatted.slice(-1);
    }

    return formatted;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "rut") {
      // Limpiar el RUT para validación y formateo
      const cleanRut = value.replace(/[^0-9kK]/g, "");
      newValue = formatRut(value);

      // Validar el RUT solo si tiene la longitud mínima para ser válido (ej. 7 dígitos + DV)
      if (cleanRut.length >= 7) {
        if (!validateRut(cleanRut)) {
          setRutError("El RUT ingresado no es válido.");
        } else {
          setRutError(null);
        }
      } else {
        setRutError(null); // Limpiar error si el RUT es demasiado corto para validar
      }
    }

    setFormData((prevState) => {
      const newState = { ...prevState, [name]: newValue };
      // Actualizar fenceType basado en fenceHeight
      if (name === "fenceHeight") {
        newState.fenceType =
          value === "Otra"
            ? "Cerco Vibrado Personalizado"
            : `Cerco Vibrado ${value}`;
        // Actualizar componentsList basado en la nueva altura
        if (FENCE_COMPONENTS_BY_HEIGHT[value]) {
          setComponentsList(FENCE_COMPONENTS_BY_HEIGHT[value]);
        } else {
          setComponentsList([]); // Limpiar si la altura no se encuentra
        }
      }
      return newState;
    });
  };

  const getImageForHeight = (height) => {
    switch (height) {
      case "1.90m":
        return cerco_190;
      default:
        return cerco_stock; // Imagen por defecto para otras alturas
    }
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    // Validar RUT antes de continuar con la validación del formulario
    if (rutError) {
      setValidated(true);
      setError("Por favor, corrige el RUT antes de enviar.");
      return;
    }

    if (form.checkValidity() === false) {
      setValidated(true);
      setError("Por favor, completa todos los campos obligatorios.");
      return;
    }

    setMessage(null);
    setError(null);
    setValidated(false); // Reset validation state on successful attempt

    try {
      const response = await fetch(API_ENDPOINTS.quotes, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al enviar la cotización");
      }

      setMessage(
        "¡Cotización enviada exitosamente! Nos pondremos en contacto contigo pronto.",
      );
      setFormData({
        name: "",
        rut: "",
        phone: "",
        address: "",
        email: "",
        fenceHeight: "1.50m",
        fenceType: "Cerco Vibrado Estándar", // Resetear también
        linearMeters: "",
        message: "",
      });
      setValidated(false); // Reset validation state on successful submission
    } catch (error) {
      setError(error.message);
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
                  Completa el formulario y te enviaremos una cotización
                  detallada a la brevedad.
                </p>
                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Nombre Completo</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Por favor, ingresa tu nombre completo.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formRut">
                        <Form.Label>RUT</Form.Label>
                        <Form.Control
                          type="text"
                          name="rut"
                          value={formData.rut}
                          onChange={handleChange}
                          required
                          isInvalid={!!rutError} // Marcar como inválido si hay rutError
                        />
                        <Form.Control.Feedback type="invalid">
                          {rutError || "Por favor, ingresa un RUT válido (ej. 12.345.678-9)."}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formPhone">
                        <Form.Label>Número de Teléfono</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Por favor, ingresa tu número de teléfono.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Correo Electrónico</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                        <Form.Control.Feedback type="invalid">
                          Por favor, ingresa un correo electrónico válido.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3" controlId="formAddress">
                    <Form.Label>Dirección / Comuna</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Por favor, ingresa tu dirección o comuna.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formFenceHeight">
                        <Form.Label>Altura del Cerco</Form.Label>
                        <Form.Select
                          name="fenceHeight"
                          value={formData.fenceHeight}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Selecciona una altura</option>
                          <option>1.50m</option>
                          <option>1.90m</option>
                          <option>2.20m</option>
                          <option>Otra</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          Por favor, selecciona la altura del cerco.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formLinearMeters">
                        <Form.Label>Metros Lineales (aprox.)</Form.Label>
                        <Form.Control
                          type="number"
                          name="linearMeters"
                          value={formData.linearMeters}
                          onChange={handleChange}
                          required
                          min="1"
                        />
                        <Form.Control.Feedback type="invalid">
                          Por favor, ingresa los metros lineales.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3" controlId="formMessage">
                    <Form.Label>Mensaje Adicional</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Indícanos cualquier detalle importante para tu proyecto."
                    />
                  </Form.Group>

                  {/* Sección de Componentes del Cerco */}
                  {formData.fenceHeight && componentsList.length > 0 && (
                    <Card className="mb-3 components-card">
                      <Card.Body>
                        <Card.Title>
                          Componentes para {formData.fenceHeight}
                        </Card.Title>
                        <ul>
                          {componentsList.map((component, index) => (
                            <li key={index}>{component}</li>
                          ))}
                        </ul>
                      </Card.Body>
                    </Card>
                  )}

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
        <Row className="justify-content-center mt-5">
          <Col md={8}>
            <img
              src={getImageForHeight(formData.fenceHeight)}
              alt="Cerco de referencia"
              className="img-fluid rounded shadow-lg"
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default QuotePage;
