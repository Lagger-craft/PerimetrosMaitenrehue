import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Offcanvas, Nav, Button } from 'react-bootstrap';
import { List, House, ClipboardData, BoxSeam, PersonFillGear, Receipt, FileText } from 'react-bootstrap-icons';
import './AdminMobileNav.css';

const AdminMobileNav = ({ user, onLogout }) => {
  const [show, setShow] = useState(false);
  const location = useLocation();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Botón de menú flotante para móviles */}
      <div className="admin-mobile-nav-trigger d-md-none">
        <Button
          variant="primary"
          className="mobile-menu-btn"
          onClick={handleShow}
        >
          <List size={20} />
        </Button>
      </div>

      {/* Offcanvas para navegación móvil */}
      <Offcanvas show={show} onHide={handleClose} placement="start">
        <Offcanvas.Header closeButton className="admin-offcanvas-header">
          <Offcanvas.Title>
            <PersonFillGear className="me-2" />
            Panel Admin
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="admin-offcanvas-body">
          <div className="admin-user-info">
            <h6>Conectado como:</h6>
            <p className="fw-bold text-primary">{user?.username}</p>
          </div>
          
          <Nav className="flex-column admin-nav-menu">
            <Nav.Item>
              <Link
                to="/"
                className={`nav-link admin-nav-link ${isActive('/') ? 'active' : ''}`}
                onClick={handleClose}
              >
                <House className="me-2" />
                Página Principal
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link
                to="/administracion/dashboard"
                className={`nav-link admin-nav-link ${isActive('/administracion/dashboard') ? 'active' : ''}`}
                onClick={handleClose}
              >
                <ClipboardData className="me-2" />
                Cotizaciones
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link
                to="/administracion/bodega"
                className={`nav-link admin-nav-link ${isActive('/administracion/bodega') ? 'active' : ''}`}
                onClick={handleClose}
              >
                <BoxSeam className="me-2" />
                Gestión de Bodega
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link
                to="/administracion/facturacion"
                className={`nav-link admin-nav-link ${isActive('/administracion/facturacion') ? 'active' : ''}`}
                onClick={handleClose}
              >
                <Receipt className="me-2" />
                Generar Factura
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link
                to="/administracion/facturas"
                className={`nav-link admin-nav-link ${isActive('/administracion/facturas') ? 'active' : ''}`}
                onClick={handleClose}
              >
                <FileText className="me-2" />
                Ver Facturas
              </Link>
            </Nav.Item>
          </Nav>

          <div className="admin-nav-footer">
            <Button
              variant="outline-danger"
              onClick={() => {
                onLogout();
                handleClose();
              }}
              className="w-100"
            >
              Cerrar Sesión
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default AdminMobileNav;