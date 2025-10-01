import React, { useState, useContext, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Modal,
} from "react-bootstrap";
import AuthContext from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { API_ENDPOINTS } from "../../config/api.js";
import AdminMobileNav from "./AdminMobileNav";
import InvoiceTemplate from "./InvoiceTemplate";
import "./InvoicePage.css";
import "../ModalCommon.css";
import "../LoadingAnimations.css";

// Comunas de la Novena Región (La Araucanía) en un radio de 80km de Angol
const NOVENA_REGION_COMUNAS = [
  "Angol",
  "Renaico", 
  "Collipulli",
  "Ercilla",
  "Los Sauces",
  "Purén",
  "Lumaco",
  "Traiguén",
  "Galvarino",
  "Lautaro",
  "Perquenco",
  "Victoria",
  "Curacautín",
  "Lonquimay",
  "Temuco",
  "Padre Las Casas",
  "Freire",
  "Pitrufquén",
  "Gorbea",
  "Loncoche",
  "Villarrica",
  "Pucón",
  "Curarrehue"
];

const InvoicePage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    country: "Chile",
    streetAddress: "",
    city: "",
    region: "La Araucanía",
    postalCode: "",
    phone: "",
    email: "",
    orderNotes: ""
  });

  const [validated, setValidated] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showInvoiceTemplate, setShowInvoiceTemplate] = useState(false);
  
  // Estados para selección de cotizaciones
  const [quotes, setQuotes] = useState([]);
  const [showQuotesModal, setShowQuotesModal] = useState(false);
  const [quotesLoading, setQuotesLoading] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  
  // Estados para la factura generada
  const [generatedInvoice, setGeneratedInvoice] = useState(null);

  // Efecto para cargar cotización desde navigation state
  useEffect(() => {
    if (location.state?.selectedQuote) {
      handleSelectQuote(location.state.selectedQuote);
      // Limpiar el state para evitar recargas innecesarias
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para cargar cotizaciones
  const fetchQuotes = async () => {
    try {
      setQuotesLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(API_ENDPOINTS.quotes, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al cargar las cotizaciones");
      }

      const data = await response.json();
      setQuotes(data);
    } catch (err) {
      setError("Error al cargar cotizaciones: " + err.message);
    } finally {
      setQuotesLoading(false);
    }
  };

  // Función para seleccionar una cotización y autocompletar
  const handleSelectQuote = (quote) => {
    // Separar nombre completo en nombre y apellido
    const nameParts = quote.name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    setFormData({
      firstName,
      lastName,
      companyName: "", // Las cotizaciones no tienen campo empresa
      country: "Chile",
      streetAddress: quote.address || "",
      city: "", // Extraeremos de la dirección si es posible
      region: "La Araucanía",
      postalCode: "",
      phone: quote.phone || "",
      email: quote.email || "",
      orderNotes: `Cotización original:
      - Altura del cerco: ${quote.fenceHeight}
      - Tipo: ${quote.fenceType}
      - Metros lineales: ${quote.linearMeters}
      ${quote.message ? `- Mensaje: ${quote.message}` : ""}`
    });

    setSelectedQuote(quote);
    setShowQuotesModal(false);
    setSuccess(`Datos cargados desde la cotización de ${quote.name}`);
  };

  // Función para abrir modal de cotizaciones
  const handleShowQuotes = async () => {
    setShowQuotesModal(true);
    await fetchQuotes();
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();

    if (form.checkValidity() === false) {
      setValidated(true);
      setError("Por favor, completa todos los campos obligatorios.");
      return;
    }

    setValidated(false);
    setShowInvoiceTemplate(true);
  };

  const handleConfirmInvoice = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(API_ENDPOINTS.invoices, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al generar la factura");
      }

      setSuccess(`¡Factura generada exitosamente! Número: ${data.invoice.invoiceNumber}`);
      setGeneratedInvoice(data.invoice);
      setShowPreviewModal(false);
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        companyName: "",
        country: "Chile",
        streetAddress: "",
        city: "",
        region: "La Araucanía",
        postalCode: "",
        phone: "",
        email: "",
        orderNotes: ""
      });

      setSelectedQuote(null);
      
      // Mostrar la plantilla de factura generada
      setTimeout(() => {
        setShowInvoiceTemplate(true);
      }, 2000);

    } catch (error) {
      console.error("Error creating invoice:", error);
      setError(error.message || "Error al generar la factura. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintInvoice = () => {
    const printContent = document.getElementById('invoice-template');
    const winPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    winPrint.document.write(`
      <html>
        <head>
          <title>Cotización</title>
          <style>
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            .invoice-container { max-width: 100%; }
            @media print {
              body { margin: 0; padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    winPrint.document.close();
  };

  const handleBackToForm = () => {
    setShowInvoiceTemplate(false);
    setGeneratedInvoice(null);
  };

  if (!user || user.role !== "admin") {
    navigate("/administracion");
    return null;
  }

  return (
    <>
      <section className="invoice-page-section">
        <Container fluid className="px-2 px-md-3">
          <h2 className="text-center mb-4 text-uppercase fw-semibold text-white">
            Generar Factura
          </h2>
          
          <Row className="justify-content-center">
            <Col xs={12} lg={8} xl={6}>
              <Card className="invoice-card">
                <Card.Body>
                  <Card.Title className="mb-4">
                    Detalles de Facturación
                  </Card.Title>
                  
                  {/* Botón para cargar desde cotización */}
                  <div className="mb-3">
                    <Button 
                      variant="outline-primary" 
                      onClick={handleShowQuotes}
                      className="w-100"
                    >
                      📋 Cargar datos desde cotización existente
                    </Button>
                    {selectedQuote && (
                      <small className="text-muted d-block mt-1">
                        Datos cargados desde cotización de: {selectedQuote.name}
                      </small>
                    )}
                  </div>
                  
                  {success && <Alert variant="success">{success}</Alert>}
                  {error && <Alert variant="danger">{error}</Alert>}

                  <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    {/* Nombre y Apellido */}
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group controlId="firstName">
                          <Form.Label>Nombre *</Form.Label>
                          <Form.Control
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="mobile-friendly-input"
                          />
                          <Form.Control.Feedback type="invalid">
                            Por favor ingresa el nombre.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="lastName">
                          <Form.Label>Apellido *</Form.Label>
                          <Form.Control
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="mobile-friendly-input"
                          />
                          <Form.Control.Feedback type="invalid">
                            Por favor ingresa el apellido.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Nombre de Empresa */}
                    <Form.Group className="mb-3" controlId="companyName">
                      <Form.Label>Nombre de la Empresa (opcional)</Form.Label>
                      <Form.Control
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="mobile-friendly-input"
                      />
                    </Form.Group>

                    {/* País/Región */}
                    <Form.Group className="mb-3" controlId="country">
                      <Form.Label>País/Región *</Form.Label>
                      <Form.Control
                        type="text"
                        name="country"
                        value={formData.country}
                        readOnly
                        className="mobile-friendly-input"
                        style={{ backgroundColor: '#f8f9fa' }}
                      />
                    </Form.Group>

                    {/* Dirección de la calle */}
                    <Form.Group className="mb-3" controlId="streetAddress">
                      <Form.Label>Dirección de la calle *</Form.Label>
                      <Form.Control
                        type="text"
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleChange}
                        required
                        className="mobile-friendly-input"
                        placeholder="Calle, número, departamento, etc."
                      />
                      <Form.Control.Feedback type="invalid">
                        Por favor ingresa la dirección.
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* Comuna y Región */}
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group controlId="city">
                          <Form.Label>Comuna *</Form.Label>
                          <Form.Select
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            className="mobile-friendly-input"
                          >
                            <option value="">Selecciona una comuna</option>
                            {NOVENA_REGION_COMUNAS.map((comuna) => (
                              <option key={comuna} value={comuna}>
                                {comuna}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Por favor selecciona la comuna.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="region">
                          <Form.Label>Región</Form.Label>
                          <Form.Control
                            type="text"
                            name="region"
                            value={formData.region}
                            readOnly
                            className="mobile-friendly-input"
                            style={{ backgroundColor: '#f8f9fa' }}
                          />
                          <Form.Text className="text-muted">
                            Servicio disponible solo en La Araucanía (80km de Angol)
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Código postal */}
                    <Form.Group className="mb-3" controlId="postalCode">
                      <Form.Label>Código postal (opcional)</Form.Label>
                      <Form.Control
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="mobile-friendly-input"
                      />
                    </Form.Group>

                    {/* Teléfono y Email */}
                    <Row className="g-3">
                      <Col md={6}>
                        <Form.Group controlId="phone">
                          <Form.Label>Teléfono *</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="mobile-friendly-input"
                          />
                          <Form.Control.Feedback type="invalid">
                            Por favor ingresa el teléfono.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="email">
                          <Form.Label>Dirección de correo electrónico *</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mobile-friendly-input"
                          />
                          <Form.Control.Feedback type="invalid">
                            Por favor ingresa un email válido.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    {/* Información adicional */}
                    <Form.Group className="mb-4" controlId="orderNotes">
                      <Form.Label>Información adicional: Notas del pedido (opcional)</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="orderNotes"
                        value={formData.orderNotes}
                        onChange={handleChange}
                        className="mobile-friendly-input"
                        placeholder="Notas sobre el pedido, instrucciones especiales, etc."
                      />
                    </Form.Group>

                    {/* Botones de acción */}
                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => navigate('/administracion/dashboard')}
                        className="me-md-2"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        variant="primary" 
                        type="submit"
                        className="touch-feedback"
                      >
                        Vista Previa de Cotización
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>

        {/* Modal de confirmación */}
        <Modal
          show={showPreviewModal}
          onHide={() => setShowPreviewModal(false)}
          centered
          size="lg"
          className="invoice-preview-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirmar Factura</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="invoice-preview">
              <h5 className="mb-3">Resumen de Facturación</h5>
              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="detail-item">
                    <strong>Cliente:</strong>
                    <span>{formData.firstName} {formData.lastName}</span>
                  </div>
                </div>
                {formData.companyName && (
                  <div className="col-sm-6">
                    <div className="detail-item">
                      <strong>Empresa:</strong>
                      <span>{formData.companyName}</span>
                    </div>
                  </div>
                )}
                <div className="col-12">
                  <div className="detail-item">
                    <strong>Dirección:</strong>
                    <span>
                      {formData.streetAddress}, {formData.city}, {formData.region}
                      {formData.postalCode && `, ${formData.postalCode}`}
                    </span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="detail-item">
                    <strong>Teléfono:</strong>
                    <span>{formData.phone}</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="detail-item">
                    <strong>Email:</strong>
                    <span>{formData.email}</span>
                  </div>
                </div>
                {formData.orderNotes && (
                  <div className="col-12">
                    <div className="detail-item">
                      <strong>Notas del pedido:</strong>
                      <span>{formData.orderNotes}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => setShowPreviewModal(false)}
              disabled={loading}
            >
              Editar
            </Button>
            <Button 
              variant="primary" 
              onClick={handleConfirmInvoice}
              disabled={loading}
              className="touch-feedback"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Generando...
                </>
              ) : (
                "Confirmar Factura"
              )}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal de Selección de Cotizaciones */}
        <Modal
          show={showQuotesModal}
          onHide={() => setShowQuotesModal(false)}
          centered
          size="lg"
          className="quotes-selection-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Seleccionar Cotización</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {quotesLoading ? (
              <div className="text-center p-4">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Cargando cotizaciones...</span>
                </div>
                <p className="mt-2">Cargando cotizaciones...</p>
              </div>
            ) : quotes.length > 0 ? (
              <div className="quotes-list">
                <p className="text-muted mb-3">
                  Selecciona una cotización para autocompletar los datos de la factura:
                </p>
                <div className="row g-3">
                  {quotes.map((quote) => (
                    <div key={quote._id} className="col-12">
                      <Card 
                        className="quote-selection-card h-100" 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSelectQuote(quote)}
                      >
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <Card.Title className="h6 mb-2">{quote.name}</Card.Title>
                              <Card.Text className="small mb-1">
                                <strong>Email:</strong> {quote.email}
                                <br />
                                <strong>Teléfono:</strong> {quote.phone}
                                <br />
                                <strong>Dirección:</strong> {quote.address}
                              </Card.Text>
                              <Card.Text className="small text-muted">
                                <strong>Cerco:</strong> {quote.fenceHeight} - {quote.linearMeters}m
                                <br />
                                <strong>Fecha:</strong> {new Date(quote.timestamp).toLocaleDateString()}
                              </Card.Text>
                            </div>
                            <Button 
                              variant="primary" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectQuote(quote);
                              }}
                            >
                              Seleccionar
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center p-4">
                <p className="text-muted">No hay cotizaciones disponibles.</p>
                <Button 
                  variant="outline-primary" 
                  onClick={() => navigate('/administracion/dashboard')}
                >
                  Ver Dashboard
                </Button>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowQuotesModal(false)}>
              Cancelar
            </Button>
          </Modal.Footer>
        </Modal>
      </section>

      {/* Modal de Vista Previa de la Plantilla de Cotización */}
      <Modal
        show={showInvoiceTemplate}
        onHide={() => setShowInvoiceTemplate(false)}
        centered
        size="xl"
        className="invoice-template-modal"
        backdrop="static"
      >
        <Modal.Header>
          <Modal.Title>Vista Previa de Cotización</Modal.Title>
          <div className="d-flex gap-2 no-print">
            <Button 
              variant="success" 
              onClick={handleConfirmInvoice}
              disabled={loading}
              size="sm"
            >
              {loading ? "Generando..." : "Confirmar y Generar"}
            </Button>
            <Button 
              variant="outline-primary" 
              onClick={handlePrintInvoice}
              size="sm"
            >
              Imprimir
            </Button>
            <Button 
              variant="outline-secondary" 
              onClick={handleBackToForm}
              size="sm"
            >
              Volver al Formulario
            </Button>
          </div>
        </Modal.Header>
        <Modal.Body style={{ padding: 0, maxHeight: '80vh', overflowY: 'auto' }}>
          <InvoiceTemplate 
            formData={formData}
            selectedQuote={selectedQuote}
            invoiceNumber={generatedInvoice?.invoiceNumber || "PREV-" + Date.now()}
            currentDate={new Date().toLocaleDateString('es-CL')}
          />
        </Modal.Body>
      </Modal>
      
      {/* Navegación móvil para administradores */}
      <AdminMobileNav user={user} onLogout={logout} />
    </>
  );
};

export default InvoicePage;