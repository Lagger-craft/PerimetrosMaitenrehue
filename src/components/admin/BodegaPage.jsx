import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Table, Image, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { PencilSquare, Trash, PlusCircle } from 'react-bootstrap-icons';
import './BodegaPage.css';

// Mock Data
import palmetasImg from '../../assets/palmetas.webp';
import pilaPlametaImg from '../../assets/pilaPlameta.webp';

const initialProducts = [
  {
    id: 1,
    name: 'Placa de Hormigón Estándar',
    description: 'Placa de hormigón vibrado de alta resistencia para cercos perimetrales.',
    stock: 150,
    price: 12500,
    image: palmetasImg,
  },
  {
    id: 2,
    name: 'Poste de Hormigón 1.90m',
    description: 'Poste de hormigón para cercos de 1.90m de altura.',
    stock: 80,
    price: 18000,
    image: pilaPlametaImg,
  },
  {
    id: 3,
    name: 'Placa de Hormigón con Diseño',
    description: 'Placa de hormigón con diseño de ladrillo, para un acabado más estético.',
    stock: 95,
    price: 15000,
    image: palmetasImg,
  },
];


const BodegaPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState(initialProducts);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const normalizeString = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/administracion');
    }
  }, [user, navigate]);

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleShowModal = (product = null) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      // Edit
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...productData } : p));
    } else {
      // Add
      const newProduct = {
        id: Math.max(...products.map(p => p.id)) + 1,
        ...productData,
        image: palmetasImg, // Placeholder for new products
      };
      setProducts([...products, newProduct]);
    }
    handleCloseModal();
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      setProducts(products.filter(p => p.id !== productId));
    }
  };

  const filteredProducts = products.filter(product =>
    normalizeString(product.name).includes(normalizeString(searchTerm))
  );

  return (
    <section className="bodega-page-section">
      <Container fluid>
        <Row className="mb-4 align-items-center">
          <Col>
            <h2 className="text-white">Gestión de Bodega</h2>
          </Col>
          <Col xs="auto">
            <Button variant="success" onClick={() => handleShowModal()}>
              <PlusCircle className="me-2" />
              Agregar Producto
            </Button>
          </Col>
        </Row>

        <Card className="shadow-sm">
          <Card.Header>
            <Form.Control
              type="text"
              placeholder="Buscar producto por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Card.Header>
          <Card.Body>
            <Table responsive hover className="product-table">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Stock</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <tr key={product.id}>
                      <td>
                        <Image src={product.image} rounded width="60" />
                      </td>
                      <td className="fw-bold">{product.name}</td>
                      <td>
                        <span className={`badge ${product.stock > 50 ? 'bg-success' : product.stock > 10 ? 'bg-warning' : 'bg-danger'}`}>
                          {product.stock} unidades
                        </span>
                      </td>
                      <td>${product.price.toLocaleString('es-CL')}</td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowModal(product)}>
                          <PencilSquare />
                        </Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      <Alert variant="info">No se encontraron productos.</Alert>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>

      {/* Add/Edit Modal */}
      <ProductFormModal
        show={showModal}
        handleClose={handleCloseModal}
        handleSave={handleSaveProduct}
        product={editingProduct}
      />
    </section>
  );
};

// Helper component for the form modal
const ProductFormModal = ({ show, handleClose, handleSave, product }) => {
  const [formData, setFormData] = useState({ name: '', description: '', stock: 0, price: 0 });

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({ name: '', description: '', stock: 0, price: 0 });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;
    if (name === 'stock' || name === 'price') {
      parsedValue = parseInt(value, 10);
      if (isNaN(parsedValue)) {
        parsedValue = 0;
      }
    }
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave(formData);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{product ? 'Editar Producto' : 'Agregar Producto'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre del Producto</Form.Label>
            <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} />
          </Form.Group>
          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Stock</Form.Label>
                <Form.Control type="number" name="stock" value={formData.stock} onChange={handleChange} required min="0" />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Precio</Form.Label>
                <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required min="0" />
              </Form.Group>
            </Col>
          </Row>
          <Button variant="primary" type="submit" className="w-100">
            Guardar Cambios
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default BodegaPage;