import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Alert,
} from "react-bootstrap";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../config/api.js";
import AdminMobileNav from "./AdminMobileNav";
import "./AdminDashboard.css";
import "../ModalCommon.css"; // Reutilizar estilos comunes de modal
import "../LoadingAnimations.css"; // Animaciones de carga

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/administracion"); // Redirigir si no es admin
      return;
    }

    const fetchQuotes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(API_ENDPOINTS.quotes, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 403) {
            setError("No tienes permisos para ver las cotizaciones.");
            await logout();
            navigate("/administracion");
          } else {
            throw new Error("Error al cargar las cotizaciones.");
          }
        }
        const data = await response.json();
        setQuotes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [user, navigate, logout]);

  const handleShowDetail = (quote) => {
    setSelectedQuote(quote);
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedQuote(null);
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Cargando cotizaciones...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="error-message">
          <h4>Error al cargar las cotizaciones</h4>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="admin-dashboard-section">
        <Container fluid className="px-2 px-md-3">
          <h2 className="text-center mb-4 text-uppercase fw-semibold text-white">
            Panel de Administración
          </h2>
          
          {/* Resumen estadístico */}
          <div className="admin-stats-summary">
            <h4>Total Cotizaciones: {quotes.length}</h4>
            <div className="mt-3">
              <Button 
                variant="success" 
                onClick={() => navigate('/administracion/facturacion')}
                className="me-2"
              >
                <span className="me-2">📄</span>
                Generar Nueva Factura
              </Button>
              <Button 
                variant="info" 
                onClick={() => navigate('/administracion/facturas')}
                className="me-2"
              >
                <span className="me-2">📋</span>
                Ver Facturas
              </Button>
            </div>
          </div>
          
          <Row xs={1} sm={2} lg={3} xl={4} className="g-3 g-md-4">
            {quotes.length > 0 ? (
              quotes.map((quote, index) => (
                <Col key={quote.id} className="slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <Card className="quote-admin-card h-100 interactive-element">
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="fw-bold text-truncate" title={quote.name}>
                        {quote.name}
                      </Card.Title>
                      <Card.Text className="flex-grow-1">
                        <strong>RUT:</strong> {quote.rut}
                        <br />
                        <strong>Altura:</strong> {quote.fenceHeight}
                        <br />
                        <strong>Metros:</strong> {quote.linearMeters}m
                      </Card.Text>
                      <Button
                        variant="primary"
                        onClick={() => handleShowDetail(quote)}
                        className="mt-auto touch-feedback mb-2"
                        size="sm"
                      >
                        Ver Detalles
                      </Button>
                      <Button
                        variant="success"
                        onClick={() => navigate('/administracion/facturacion', { state: { selectedQuote: quote } })}
                        className="touch-feedback"
                        size="sm"
                      >
                        📄 Crear Factura
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col xs={12} className="fade-in">
                <Alert variant="info" className="text-center">
                  No hay cotizaciones para mostrar.
                </Alert>
              </Col>
            )}
          </Row>
        </Container>

        {/* Modal de Detalles de Cotización */}
        <Modal
          show={showDetailModal}
          onHide={handleCloseDetail}
          centered
          size="lg"
          className="quote-detail-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Detalles de Cotización</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedQuote && (
              <div className="quote-details">
                <div className="row g-3">
                  <div className="col-sm-6">
                    <p><strong>Nombre:</strong><br/>{selectedQuote.name}</p>
                  </div>
                  <div className="col-sm-6">
                    <p><strong>RUT:</strong><br/>{selectedQuote.rut}</p>
                  </div>
                  <div className="col-sm-6">
                    <p><strong>Teléfono:</strong><br/>{selectedQuote.phone}</p>
                  </div>
                  <div className="col-sm-6">
                    <p><strong>Email:</strong><br/>{selectedQuote.email}</p>
                  </div>
                  <div className="col-12">
                    <p><strong>Dirección/Comuna:</strong><br/>{selectedQuote.address}</p>
                  </div>
                  <div className="col-sm-6">
                    <p><strong>Altura del Cerco:</strong><br/>{selectedQuote.fenceHeight}</p>
                  </div>
                  <div className="col-sm-6">
                    <p><strong>Metros Lineales:</strong><br/>{selectedQuote.linearMeters}</p>
                  </div>
                  <div className="col-12">
                    <p><strong>Mensaje Adicional:</strong><br/>{selectedQuote.message || "N/A"}</p>
                  </div>
                  <div className="col-12">
                    <p><strong>Fecha de Solicitud:</strong><br/>{new Date(selectedQuote.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDetail}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      </section>
      
      {/* Navegación móvil para administradores */}
      <AdminMobileNav user={user} onLogout={logout} />
    </>
  );
};

export default AdminDashboard;
