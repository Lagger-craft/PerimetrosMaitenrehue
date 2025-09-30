import React, { useState } from 'react';
import { Container, Card, Button, Alert, Form, Row, Col } from 'react-bootstrap';
import { Whatsapp, Telephone, Clipboard, Check } from 'react-bootstrap-icons';

const WhatsAppTestPage = () => {
  const [copied, setCopied] = useState('');
  const [customMessage, setCustomMessage] = useState('Hola, me interesa obtener información sobre sus cercos vibrados. ¿Podrían ayudarme?');
  
  const phoneNumber = "56987761691";
  
  // URLs de prueba
  const testUrls = {
    basic: `https://wa.me/${phoneNumber}`,
    withMessage: `https://wa.me/${phoneNumber}?text=${encodeURIComponent(customMessage)}`,
    alternative1: `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(customMessage)}`,
    alternative2: `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(customMessage)}`,
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  const openWhatsApp = (url, method) => {
    console.log(`Intentando abrir: ${url} con método: ${method}`);
    
    switch(method) {
      case 'href':
        window.location.href = url;
        break;
      case 'open':
        window.open(url, '_blank', 'noopener noreferrer');
        break;
      case 'click':
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        break;
      default:
        window.open(url, '_blank');
    }
  };

  const detectDevice = () => {
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);
    const isMobile = /Mobi|Android/i.test(userAgent);
    const width = window.innerWidth;
    
    return {
      userAgent,
      isIOS,
      isAndroid,
      isMobile,
      width,
      platform: navigator.platform
    };
  };

  const deviceInfo = detectDevice();

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(180deg, #1D3557 0%, #274C77 45%, #4A83A6 100%)',
      padding: '2rem 0'
    }}>
      <Container>
        <h1 className="text-white text-center mb-4">🧪 WhatsApp Debug - PerímetrosMaitenrehue</h1>
        
        {/* Información del dispositivo */}
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">📱 Información del Dispositivo</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <p><strong>User Agent:</strong> {deviceInfo.userAgent}</p>
                <p><strong>Platform:</strong> {deviceInfo.platform}</p>
                <p><strong>Ancho ventana:</strong> {deviceInfo.width}px</p>
              </Col>
              <Col md={6}>
                <p><strong>Es iOS:</strong> {deviceInfo.isIOS ? '✅' : '❌'}</p>
                <p><strong>Es Android:</strong> {deviceInfo.isAndroid ? '✅' : '❌'}</p>
                <p><strong>Es Móvil:</strong> {deviceInfo.isMobile ? '✅' : '❌'}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Mensaje personalizable */}
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">✏️ Personalizar Mensaje</h5>
          </Card.Header>
          <Card.Body>
            <Form.Group>
              <Form.Label>Mensaje de WhatsApp:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Escribe tu mensaje aquí..."
              />
            </Form.Group>
          </Card.Body>
        </Card>

        {/* URLs de prueba */}
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">🔗 URLs de Prueba</h5>
          </Card.Header>
          <Card.Body>
            {Object.entries(testUrls).map(([key, url]) => (
              <div key={key} className="mb-3 p-3 border rounded">
                <h6 className="text-capitalize">{key.replace(/([A-Z])/g, ' $1')}</h6>
                <p className="text-muted small" style={{ wordBreak: 'break-all' }}>{url}</p>
                <div className="d-flex gap-2 flex-wrap">
                  <Button 
                    size="sm" 
                    variant="success" 
                    onClick={() => openWhatsApp(url, 'href')}
                  >
                    <Whatsapp className="me-1" />
                    Usar window.location.href
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline-success" 
                    onClick={() => openWhatsApp(url, 'open')}
                  >
                    <Whatsapp className="me-1" />
                    Usar window.open
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline-primary" 
                    onClick={() => openWhatsApp(url, 'click')}
                  >
                    <Whatsapp className="me-1" />
                    Usar createElement
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline-secondary" 
                    onClick={() => copyToClipboard(url, key)}
                  >
                    {copied === key ? <Check className="me-1" /> : <Clipboard className="me-1" />}
                    {copied === key ? 'Copiado!' : 'Copiar'}
                  </Button>
                </div>
              </div>
            ))}
          </Card.Body>
        </Card>

        {/* Instrucciones */}
        <Card className="mb-4">
          <Card.Header className="bg-info text-white">
            <h5 className="mb-0">📋 Instrucciones de Prueba</h5>
          </Card.Header>
          <Card.Body>
            <Alert variant="info">
              <h6>🔍 Qué probar:</h6>
              <ol>
                <li><strong>En móvil:</strong> Debería abrir la app nativa de WhatsApp</li>
                <li><strong>En desktop:</strong> Debería abrir WhatsApp Web</li>
                <li><strong>Sin WhatsApp:</strong> Debería mostrar opción de instalar</li>
              </ol>
            </Alert>
            
            <Alert variant="warning">
              <h6>🚨 Solución de problemas:</h6>
              <ul>
                <li>Si no abre la app: Usa la URL "alternative2" (whatsapp://)</li>
                <li>Si no funciona en GitHub Pages: Puede ser HTTPS/HTTP mixed content</li>
                <li>Si el mensaje no aparece: Revisa la codificación de caracteres</li>
              </ul>
            </Alert>
            
            <Alert variant="success">
              <h6>✅ URLs recomendadas por plataforma:</h6>
              <ul>
                <li><strong>iOS/Android:</strong> https://wa.me/</li>
                <li><strong>Desktop:</strong> https://web.whatsapp.com/</li>
                <li><strong>Fallback:</strong> https://api.whatsapp.com/send</li>
              </ul>
            </Alert>
          </Card.Body>
        </Card>

        {/* Botón de regreso */}
        <div className="text-center">
          <Button 
            variant="outline-light" 
            onClick={() => window.history.back()}
            size="lg"
          >
            ← Volver al sitio
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default WhatsAppTestPage;