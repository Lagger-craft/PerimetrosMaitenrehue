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
import "./AdminDashboard.css";
import "../ModalCommon.css"; // Reutilizar estilos comunes de modal

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
        const response = await fetch("http://localhost:5000/api/quotes", {
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
      <div className="admin-dashboard-section text-center text-white p-5">
        Cargando cotizaciones...
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard-section text-center text-danger p-5">
        Error: {error}
      </div>
    );
  }

  return (
    <section className="admin-dashboard-section">
      <Container>
        <h2 className="text-center mb-5 text-uppercase fw-semibold text-white">
          Panel de Administración - Cotizaciones
        </h2>
        <Row xs={1} md={2} lg={3} className="g-4">
          {quotes.length > 0 ? (
            quotes.map((quote) => (
              <Col key={quote.id}>
                <Card className="quote-admin-card h-100">
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="fw-bold">{quote.name}</Card.Title>
                    <Card.Text>
                      <strong>RUT:</strong> {quote.rut}
                      <br />
                      <strong>Altura Cerco:</strong> {quote.fenceHeight}
                    </Card.Text>
                    <Button
                      variant="primary"
                      onClick={() => handleShowDetail(quote)}
                      className="mt-auto"
                    >
                      Más Información
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <Alert variant="info">No hay cotizaciones para mostrar.</Alert>
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
      >
        <Modal.Header closeButton>
          <Modal.Title>Detalles de Cotización</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedQuote && (
            <>
              <p>
                <strong>Nombre:</strong> {selectedQuote.name}
              </p>
              <p>
                <strong>RUT:</strong> {selectedQuote.rut}
              </p>
              <p>
                <strong>Teléfono:</strong> {selectedQuote.phone}
              </p>
              <p>
                <strong>Email:</strong> {selectedQuote.email}
              </p>
              <p>
                <strong>Dirección/Comuna:</strong> {selectedQuote.address}
              </p>
              <p>
                <strong>Altura del Cerco:</strong> {selectedQuote.fenceHeight}
              </p>
              <p>
                <strong>Metros Lineales:</strong> {selectedQuote.linearMeters}
              </p>
              <p>
                <strong>Mensaje Adicional:</strong>{" "}
                {selectedQuote.message || "N/A"}
              </p>
              <p>
                <strong>Fecha de Solicitud:</strong>{" "}
                {new Date(selectedQuote.timestamp).toLocaleString()}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetail}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default AdminDashboard;
