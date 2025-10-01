import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Alert,
  Badge,
  Form,
  InputGroup,
} from "react-bootstrap";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../config/api.js";
import AdminMobileNav from "./AdminMobileNav";
import InvoiceTemplate from "./InvoiceTemplate";
import "./InvoiceListPage.css";
import "../ModalCommon.css";
import "../LoadingAnimations.css";

const InvoiceListPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showInvoiceTemplateModal, setShowInvoiceTemplateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/administracion");
      return;
    }
    fetchInvoices();
  }, [user, navigate, currentPage, searchTerm, statusFilter]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
      });
      
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter) params.append("status", statusFilter);

      const response = await fetch(`${API_ENDPOINTS.invoices}?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          setError("No tienes permisos para ver las facturas.");
          await logout();
          navigate("/administracion");
          return;
        }
        throw new Error("Error al cargar las facturas.");
      }

      const data = await response.json();
      setInvoices(data.invoices);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowDetail = (invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedInvoice(null);
  };

  const handleShowFullInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowInvoiceTemplateModal(true);
  };

  const handleCloseFullInvoice = () => {
    setShowInvoiceTemplateModal(false);
    setSelectedInvoice(null);
  };

  const handlePrintInvoice = () => {
    const printContent = document.getElementById('invoice-template-view');
    const winPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    winPrint.document.write(`
      <html>
        <head>
          <title>Factura ${selectedInvoice?.invoiceNumber}</title>
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

  // Función para convertir datos de factura al formato esperado por InvoiceTemplate
  const convertInvoiceToFormData = (invoice) => {
    return {
      firstName: invoice.firstName || invoice.fullName?.split(' ')[0] || '',
      lastName: invoice.lastName || invoice.fullName?.split(' ').slice(1).join(' ') || '',
      companyName: invoice.companyName || '',
      streetAddress: invoice.streetAddress || invoice.fullAddress || '',
      city: invoice.city || '',
      region: invoice.region || 'La Araucanía',
      postalCode: invoice.postalCode || '',
      phone: invoice.phone || '',
      email: invoice.email || '',
      orderNotes: invoice.orderNotes || ''
    };
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchInvoices();
  };

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const variants = {
      draft: "secondary",
      pending: "warning", 
      paid: "success",
      cancelled: "danger"
    };
    
    const labels = {
      draft: "Borrador",
      pending: "Pendiente",
      paid: "Pagada",
      cancelled: "Cancelada"
    };

    return (
      <Badge bg={variants[status] || "secondary"}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (loading && invoices.length === 0) {
    return (
      <div className="loading-overlay">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p>Cargando facturas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="error-message">
          <h4>Error al cargar las facturas</h4>
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
      <section className="invoice-list-section">
        <Container fluid className="px-2 px-md-3">
          <h2 className="text-center mb-4 text-uppercase fw-semibold text-white">
            Gestión de Facturas
          </h2>
          
          {/* Filtros y búsqueda */}
          <Card className="filters-card mb-4">
            <Card.Body>
              <Row className="g-3">
                <Col md={6}>
                  <Form onSubmit={handleSearch}>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Buscar por nombre, empresa, email o número..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <Button variant="primary" type="submit">
                        Buscar
                      </Button>
                    </InputGroup>
                  </Form>
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={statusFilter}
                    onChange={(e) => handleStatusChange(e.target.value)}
                  >
                    <option value="">Todos los estados</option>
                    <option value="draft">Borradores</option>
                    <option value="pending">Pendientes</option>
                    <option value="paid">Pagadas</option>
                    <option value="cancelled">Canceladas</option>
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Button 
                    variant="success" 
                    onClick={() => navigate('/administracion/facturacion')}
                    className="w-100"
                  >
                    Nueva Factura
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Resumen estadístico */}
          <div className="invoice-stats-summary">
            <h4>Total Facturas: {pagination.totalInvoices || 0}</h4>
          </div>
          
          <Row xs={1} sm={2} lg={3} xl={4} className="g-3 g-md-4">
            {invoices.length > 0 ? (
              invoices.map((invoice, index) => (
                <Col key={invoice._id} className="slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <Card className="invoice-admin-card h-100 interactive-element">
                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <Card.Title className="fw-bold text-truncate" title={invoice.fullName}>
                          {invoice.fullName}
                        </Card.Title>
                        {getStatusBadge(invoice.status)}
                      </div>
                      
                      <Card.Text className="flex-grow-1">
                        <strong>Número:</strong> {invoice.invoiceNumber}
                        <br />
                        <strong>Email:</strong> {invoice.email}
                        <br />
                        {invoice.companyName && (
                          <>
                            <strong>Empresa:</strong> {invoice.companyName}
                            <br />
                          </>
                        )}
                        <strong>Total:</strong> {formatCurrency(invoice.total)}
                        <br />
                        <small className="text-muted">
                          {new Date(invoice.createdAt).toLocaleDateString()}
                        </small>
                      </Card.Text>
                      
                      <div className="d-flex gap-2 mt-auto">
                        <Button
                          variant="outline-primary"
                          onClick={() => handleShowDetail(invoice)}
                          className="touch-feedback flex-fill"
                          size="sm"
                        >
                          Ver Detalles
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => handleShowFullInvoice(invoice)}
                          className="touch-feedback flex-fill"
                          size="sm"
                        >
                          Ver Factura
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            ) : (
              <Col xs={12} className="fade-in">
                <Alert variant="info" className="text-center">
                  No hay facturas para mostrar.
                </Alert>
              </Col>
            )}
          </Row>

          {/* Paginación */}
          {pagination.totalPages > 1 && (
            <div className="pagination-controls text-center mt-4">
              <Button
                variant="outline-light"
                disabled={!pagination.hasPrev}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="me-2"
              >
                Anterior
              </Button>
              <span className="text-white mx-3">
                Página {pagination.currentPage} de {pagination.totalPages}
              </span>
              <Button
                variant="outline-light"
                disabled={!pagination.hasNext}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="ms-2"
              >
                Siguiente
              </Button>
            </div>
          )}
        </Container>

        {/* Modal de Detalles de Factura */}
        <Modal
          show={showDetailModal}
          onHide={handleCloseDetail}
          centered
          size="lg"
          className="invoice-detail-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Detalles de Factura</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedInvoice && (
              <div className="invoice-details">
                <div className="row g-3">
                  <div className="col-sm-6">
                    <div className="detail-item">
                      <strong>Número de Factura:</strong>
                      <span>{selectedInvoice.invoiceNumber}</span>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="detail-item">
                      <strong>Estado:</strong>
                      <span>{getStatusBadge(selectedInvoice.status)}</span>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="detail-item">
                      <strong>Cliente:</strong>
                      <span>{selectedInvoice.fullName}</span>
                    </div>
                  </div>
                  {selectedInvoice.companyName && (
                    <div className="col-sm-6">
                      <div className="detail-item">
                        <strong>Empresa:</strong>
                        <span>{selectedInvoice.companyName}</span>
                      </div>
                    </div>
                  )}
                  <div className="col-sm-6">
                    <div className="detail-item">
                      <strong>Teléfono:</strong>
                      <span>{selectedInvoice.phone}</span>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="detail-item">
                      <strong>Email:</strong>
                      <span>{selectedInvoice.email}</span>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="detail-item">
                      <strong>Dirección:</strong>
                      <span>{selectedInvoice.fullAddress}</span>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="detail-item">
                      <strong>Total:</strong>
                      <span>{formatCurrency(selectedInvoice.total)}</span>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="detail-item">
                      <strong>Fecha de Creación:</strong>
                      <span>{new Date(selectedInvoice.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  {selectedInvoice.orderNotes && (
                    <div className="col-12">
                      <div className="detail-item">
                        <strong>Notas del pedido:</strong>
                        <span>{selectedInvoice.orderNotes}</span>
                      </div>
                    </div>
                  )}
                  {selectedInvoice.createdBy && (
                    <div className="col-12">
                      <div className="detail-item">
                        <strong>Creada por:</strong>
                        <span>{selectedInvoice.createdBy.username}</span>
                      </div>
                    </div>
                  )}
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

        {/* Modal de Vista Completa de Factura */}
        <Modal
          show={showInvoiceTemplateModal}
          onHide={handleCloseFullInvoice}
          centered
          size="xl"
          className="invoice-template-modal"
          backdrop="static"
        >
          <Modal.Header>
            <Modal.Title>
              Factura {selectedInvoice?.invoiceNumber} - {selectedInvoice?.fullName}
            </Modal.Title>
            <div className="d-flex gap-2 no-print">
              <Button 
                variant="outline-primary" 
                onClick={handlePrintInvoice}
                size="sm"
              >
                Imprimir
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={handleCloseFullInvoice}
                size="sm"
              >
                Cerrar
              </Button>
            </div>
          </Modal.Header>
          <Modal.Body style={{ padding: 0, maxHeight: '80vh', overflowY: 'auto' }}>
            {selectedInvoice && (
              <div id="invoice-template-view">
                <InvoiceTemplate 
                  formData={convertInvoiceToFormData(selectedInvoice)}
                  selectedQuote={null}
                  invoiceNumber={selectedInvoice.invoiceNumber}
                  currentDate={new Date(selectedInvoice.createdAt).toLocaleDateString('es-CL')}
                  isViewMode={true}
                />
              </div>
            )}
          </Modal.Body>
        </Modal>
      </section>
      
      {/* Navegación móvil para administradores */}
      <AdminMobileNav user={user} onLogout={logout} />
    </>
  );
};

export default InvoiceListPage;