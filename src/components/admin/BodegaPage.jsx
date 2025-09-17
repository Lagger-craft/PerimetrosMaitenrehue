import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import AuthContext from '../../context/AuthContext';
import './BodegaPage.css';

const BodegaPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/administracion'); // Redirigir si no es admin
    }
  }, [user, navigate]);

  return (
    <section className="bodega-page-section py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <h2 className="text-center mb-4 text-white">Página de Bodega (Administración)</h2>
            <p className="text-center text-white-50">
              Aquí se gestionará el inventario y los productos de la bodega.
              Funcionalidad en desarrollo.
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default BodegaPage;
