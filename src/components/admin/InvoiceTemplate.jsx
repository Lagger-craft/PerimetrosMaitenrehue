import React, { useState, useEffect } from "react";
import { Container, Row, Col, Table, Card } from "react-bootstrap";
import "./InvoiceTemplate.css";

const InvoiceTemplate = ({ formData, selectedQuote, invoiceNumber, currentDate, isViewMode = false }) => {
  const [invoiceData, setInvoiceData] = useState({
    // Datos de la empresa
    companyName: "Perimetros Maitenrehue",
    companySlogan: "Especialistas en Cercos Vibrados",
    companyAddress: "Dirección de la Empresa",
    companyCity: "Angol, La Araucanía, Chile",
    companyPhone: "+56 9 XXXX XXXX",
    companyFax: "Fax: +56 45 XXX XXX",
    
    // Datos de la cotización/factura
    documentTitle: isViewMode ? "FACTURA" : "COTIZACIÓN",
    issueDate: currentDate || new Date().toLocaleDateString('es-CL'),
    quotationNumber: invoiceNumber || "100",
    clientId: "CLI-001",
    validUntil: isViewMode ? "Factura generada" : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-CL'), // 30 días
    preparedBy: "Administrador",
    
    // Datos logísticos
    seller: "Vendedor Principal",
    orderNumber: "",
    shipDate: "Por definir",
    shippingMethod: "Transporte propio",
    fobPoint: "Angol, Chile",
    terms: "Pago contra entrega",
    
    // Totales
    subtotal: 0,
    taxRate: 19, // IVA Chile
    salesTax: 0,
    other: 0,
    total: 0
  });

  const [items, setItems] = useState([
    // Items por defecto basados en cotización
  ]);

  useEffect(() => {
    if (selectedQuote || formData) {
      // Generar items basados en la cotización o formulario
      let newItems = [];
      
      if (selectedQuote) {
        // Crear items basados en la cotización
        newItems = [
          {
            quantity: selectedQuote.linearMeters || 1,
            description: `Cerco Vibrado ${selectedQuote.fenceHeight} - ${selectedQuote.fenceType}`,
            unitPrice: calculateUnitPrice(selectedQuote.fenceHeight, selectedQuote.linearMeters),
            taxes: 0,
            amount: 0
          }
        ];
      }
      
      // Calcular amounts
      newItems = newItems.map(item => ({
        ...item,
        amount: (item.quantity * item.unitPrice) + item.taxes
      }));
      
      setItems(newItems);
      calculateTotals(newItems);
    }
  }, [selectedQuote, formData]);

  const calculateUnitPrice = (height, meters) => {
    // Precios estimados por metro lineal según altura
    const priceMap = {
      "1.50m": 45000,
      "1.90m": 55000,
      "2.10m": 65000,
      "2.40m": 75000,
      "Otra": 60000
    };
    return priceMap[height] || 60000;
  };

  const calculateTotals = (itemsList) => {
    const subtotal = itemsList.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const salesTax = subtotal * (invoiceData.taxRate / 100);
    const total = subtotal + salesTax + invoiceData.other;
    
    setInvoiceData(prev => ({
      ...prev,
      subtotal,
      salesTax,
      total
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  return (
    <div className="invoice-template" id="invoice-template">
      <Container fluid className="invoice-container">
        {/* ENCABEZADO */}
        <Row className="invoice-header mb-4">
          <Col md={8}>
            <div className="company-info">
              <h1 className="company-name">{invoiceData.companyName}</h1>
              <p className="company-slogan">{invoiceData.companySlogan}</p>
              <div className="company-details mt-3">
                <p className="mb-1">{invoiceData.companyAddress}</p>
                <p className="mb-1">{invoiceData.companyCity}</p>
                <p className="mb-1">{invoiceData.companyPhone}</p>
                <p className="mb-0">{invoiceData.companyFax}</p>
              </div>
            </div>
          </Col>
          <Col md={4} className="text-end">
            <div className="document-info">
              <h2 className="document-title">{invoiceData.documentTitle}</h2>
              <div className="document-details mt-3">
                <p><strong>Fecha de emisión:</strong> {invoiceData.issueDate}</p>
                <p><strong>Número de cotización:</strong> {invoiceData.quotationNumber}</p>
                <p><strong>ID del cliente:</strong> {invoiceData.clientId}</p>
                <p><strong>Validez hasta:</strong> {invoiceData.validUntil}</p>
                <p><strong>Preparado por:</strong> {invoiceData.preparedBy}</p>
              </div>
            </div>
          </Col>
        </Row>

        {/* DATOS DEL CLIENTE */}
        <Row className="client-section mb-4">
          <Col>
            <Card className="client-card">
              <Card.Body>
                <h4 className="section-title">
                  {isViewMode ? "Facturado a:" : "Cotización para:"}
                </h4>
                <div className="client-details">
                  <p><strong>Nombre:</strong> {formData?.firstName} {formData?.lastName}</p>
                  {formData?.companyName && (
                    <p><strong>Compañía:</strong> {formData.companyName}</p>
                  )}
                  <p><strong>Dirección:</strong> {formData?.streetAddress}</p>
                  <p><strong>Ciudad:</strong> {formData?.city}, {formData?.region}</p>
                  {formData?.postalCode && (
                    <p><strong>Código postal:</strong> {formData.postalCode}</p>
                  )}
                  <p><strong>Teléfono:</strong> {formData?.phone}</p>
                  <p><strong>Email:</strong> {formData?.email}</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* COMENTARIOS O INSTRUCCIONES */}
        <Row className="comments-section mb-4">
          <Col>
            <Card className="comments-card">
              <Card.Body>
                <h5>Comentarios o instrucciones:</h5>
                <p className="comments-text">
                  {formData?.orderNotes || "Ninguno"}
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* TABLA DE DETALLES LOGÍSTICOS */}
        <Row className="logistics-section mb-4">
          <Col>
            <Table className="logistics-table">
              <thead className="table-header-blue">
                <tr>
                  <th>Vendedor</th>
                  <th>Número de O/C</th>
                  <th>Fecha de envío</th>
                  <th>Envío mediante</th>
                  <th>Punto F.O.B.</th>
                  <th>Términos</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{invoiceData.seller}</td>
                  <td>{invoiceData.orderNumber}</td>
                  <td>{invoiceData.shipDate}</td>
                  <td>{invoiceData.shippingMethod}</td>
                  <td>{invoiceData.fobPoint}</td>
                  <td>{invoiceData.terms}</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>

        {/* TABLA DE PRODUCTOS O SERVICIOS */}
        <Row className="items-section mb-4">
          <Col>
            <Table className="items-table">
              <thead className="table-header">
                <tr>
                  <th>Cantidad</th>
                  <th>Descripción</th>
                  <th>Precio unitario</th>
                  <th>Impuestos</th>
                  <th>Monto</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.quantity}</td>
                    <td>{item.description}</td>
                    <td>{formatCurrency(item.unitPrice)}</td>
                    <td>{formatCurrency(item.taxes)}</td>
                    <td>{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No hay items para mostrar
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>
        </Row>

        {/* RESUMEN DE TOTALES */}
        <Row className="totals-section mb-4">
          <Col md={8}></Col>
          <Col md={4}>
            <Card className="totals-card">
              <Card.Body>
                <div className="totals-details">
                  <div className="total-line">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(invoiceData.subtotal)}</span>
                  </div>
                  <div className="total-line">
                    <span>Tasa de impuesto ({invoiceData.taxRate}%):</span>
                    <span>{invoiceData.taxRate}%</span>
                  </div>
                  <div className="total-line">
                    <span>Impuesto a las ventas:</span>
                    <span>{formatCurrency(invoiceData.salesTax)}</span>
                  </div>
                  <div className="total-line">
                    <span>Otros:</span>
                    <span>{formatCurrency(invoiceData.other)}</span>
                  </div>
                  <hr />
                  <div className="total-line total-final">
                    <strong>
                      <span>Total final:</span>
                      <span>{formatCurrency(invoiceData.total)}</span>
                    </strong>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* PIE DE PÁGINA */}
        <Row className="footer-section">
          <Col>
            <div className="invoice-footer">
              <p className="footer-text">
                Si desea realizar alguna consulta con respecto a esta cotización, 
                no dude en contactarnos. Estamos aquí para ayudarle.
              </p>
              <h4 className="thank-you">¡GRACIAS POR SU COMPRA!</h4>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default InvoiceTemplate;