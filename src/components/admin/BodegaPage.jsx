import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Table, Image, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { PencilSquare, Trash, PlusCircle } from 'react-bootstrap-icons';
import { API_ENDPOINTS, getImageUrl } from '../../config/api.js';
import AdminMobileNav from './AdminMobileNav';
import './BodegaPage.css';
import '../LoadingAnimations.css';

const BodegaPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(API_ENDPOINTS.products, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Error al cargar los productos.');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user, navigate]);

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleShowModal = (product = null) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleSaveProduct = async (productData, imageFile) => {
    const token = localStorage.getItem('token');
    const method = editingProduct ? 'PUT' : 'POST';
    const url = editingProduct
      ? `${API_ENDPOINTS.products}/${editingProduct._id}`
      : API_ENDPOINTS.products;

    if (editingProduct && !window.confirm('¿Estás seguro de que quieres guardar los cambios en este producto?')) {
      return;
    }

    try {
      let bodyContent;
      const headers = {
        'Authorization': `Bearer ${token}`,
      };

      if (imageFile) {
        const formData = new FormData();
        for (const key in productData) {
          formData.append(key, productData[key]);
        }
        formData.append('image', imageFile);
        bodyContent = formData;
        // No set Content-Type header for FormData, browser sets it automatically
      } else {
        bodyContent = JSON.stringify(productData);
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(url, {
        method,
        headers,
        body: bodyContent,
      });

      if (!response.ok) {
        throw new Error('Error al guardar el producto.');
      }

      const savedProduct = await response.json();

      if (editingProduct) {
        setProducts(products.map(p => p._id === savedProduct._id ? savedProduct : p));
      } else {
        setProducts([...products, savedProduct]);
      }
      handleCloseModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${API_ENDPOINTS.products}/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al eliminar el producto.');
        }

        setProducts(products.filter(p => p._id !== productId));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const filteredProducts = products.filter(product =>
    normalizeString(product.name).includes(normalizeString(searchTerm))
  );

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner-border text-light mb-3" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">
            <Button variant="outline-danger" onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="bodega-page-section">
        <Container fluid className="px-2 px-md-3">
          <div className="bodega-header">
            <Row className="mb-3 align-items-center">
              <Col>
                <h2 className="text-white mb-0">Gestión de Bodega</h2>
              </Col>
              <Col xs="auto">
                <Button variant="success" onClick={() => handleShowModal()}>
                  <PlusCircle className="me-2" />
                  <span className="d-none d-sm-inline">Agregar </span>Producto
                </Button>
              </Col>
            </Row>
          </div>

          <Card className="shadow-sm">
            <Card.Header className="search-filters-section">
              <Form.Control
                type="text"
                placeholder="Buscar producto por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Card.Header>
            <Card.Body className="p-0">
              {/* Vista de tabla para desktop */}
              <div className="product-table-container">
                <Table responsive hover className="product-table">
                  <thead>
                    <tr>
                      <th style={{ width: '80px' }}>Imagen</th>
                      <th>Nombre</th>
                      <th style={{ width: '120px' }}>Stock</th>
                      <th style={{ width: '120px' }}>Precio</th>
                      <th style={{ width: '120px' }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(product => (
                        <tr key={product._id}>
                          <td>
                            {product.image ? (
                              <Image 
                                src={getImageUrl(product.image)} 
                                className="product-image-table"
                                alt={product.name}
                              />
                            ) : (
                              <div className="product-image-table bg-light d-flex align-items-center justify-content-center">
                                <span style={{ fontSize: '0.7rem', color: '#666' }}>Sin imagen</span>
                              </div>
                            )}
                          </td>
                          <td className="product-name">{product.name}</td>
                          <td>
                            <span className={`badge ${product.stock > 50 ? 'bg-success' : product.stock > 10 ? 'bg-warning' : 'bg-danger'}`}>
                              {product.stock} un.
                            </span>
                          </td>
                          <td className="product-price">${product.price.toLocaleString('es-CL')}</td>
                          <td className="actions-cell">
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              className="me-1" 
                              onClick={() => handleShowModal(product)}
                              title="Editar"
                            >
                              <PencilSquare />
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              onClick={() => handleDeleteProduct(product._id)}
                              title="Eliminar"
                            >
                              <Trash />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          <Alert variant="info" className="mb-0">
                            {searchTerm ? 'No se encontraron productos que coincidan con la búsqueda.' : 'No hay productos registrados.'}
                          </Alert>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {/* Vista de tarjetas para móvil */}
              <div className="mobile-products-view p-3">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <div key={product._id} className="product-mobile-card">
                      <Row className="align-items-center">
                        <Col xs="auto">
                          {product.image ? (
                            <Image 
                              src={getImageUrl(product.image)} 
                              className="product-image-mobile"
                              alt={product.name}
                            />
                          ) : (
                            <div className="product-image-mobile bg-light d-flex align-items-center justify-content-center">
                              <span style={{ fontSize: '0.7rem', color: '#666' }}>Sin imagen</span>
                            </div>
                          )}
                        </Col>
                        <Col>
                          <div className="product-info">
                            <h5 className="mb-1">{product.name}</h5>
                            <p><strong>Stock:</strong> 
                              <span className={`badge ms-2 ${product.stock > 50 ? 'bg-success' : product.stock > 10 ? 'bg-warning' : 'bg-danger'}`}>
                                {product.stock} unidades
                              </span>
                            </p>
                            <p><strong>Precio:</strong> ${product.price.toLocaleString('es-CL')}</p>
                          </div>
                          <div className="product-actions">
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              onClick={() => handleShowModal(product)}
                            >
                              <PencilSquare className="me-1" />
                              Editar
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              onClick={() => handleDeleteProduct(product._id)}
                            >
                              <Trash className="me-1" />
                              Eliminar
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  ))
                ) : (
                  <Alert variant="info" className="text-center">
                    {searchTerm ? 'No se encontraron productos que coincidan con la búsqueda.' : 'No hay productos registrados.'}
                  </Alert>
                )}
              </div>
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
      
      {/* Navegación móvil para administradores */}
      <AdminMobileNav user={user} onLogout={logout} />
    </>
  );
};

// Helper component for the form modal
const ProductFormModal = ({ show, handleClose, handleSave, product }) => {
  const [formData, setFormData] = useState({ name: '', description: '', stock: 0, price: 0, image: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData(product);
      setImagePreview(product.image ? getImageUrl(product.image) : null);
      setImageFile(null); // Clear file input on edit
    } else {
      setFormData({ name: '', description: '', stock: 0, price: 0, image: null });
      setImagePreview(null);
      setImageFile(null);
    }
    setImageError(null);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setImageError('Tipo de archivo no soportado. Solo se permiten PNG, JPG, JPEG y WebP.');
        setImagePreview(null);
        setImageFile(null);
        return;
      }
      setImageError(null);
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
      setImageFile(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (imageError) {
      return;
    }
    handleSave(formData, imageFile);
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="product-form-modal">
      <Modal.Header closeButton>
        <Modal.Title>{product ? 'Editar Producto' : 'Agregar Producto'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre del Producto</Form.Label>
                <Form.Control 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  placeholder="Ingrese el nombre del producto"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Precio (CLP)</Form.Label>
                <Form.Control 
                  type="number" 
                  name="price" 
                  value={formData.price} 
                  onChange={handleChange} 
                  required 
                  min="0"
                  placeholder="0"
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Stock</Form.Label>
                <Form.Control 
                  type="number" 
                  name="stock" 
                  value={formData.stock} 
                  onChange={handleChange} 
                  required 
                  min="0"
                  placeholder="0"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Imagen del Producto</Form.Label>
                <Form.Control 
                  type="file" 
                  name="imageFile" 
                  onChange={handleFileChange} 
                  accept=".png,.jpg,.jpeg,.webp"
                  size="sm"
                />
                {imageError && <Alert variant="danger" className="mt-2 py-2">{imageError}</Alert>}
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              name="description" 
              value={formData.description} 
              onChange={handleChange}
              placeholder="Descripción opcional del producto"
            />
          </Form.Group>
          
          {imagePreview && (
            <div className="image-preview">
              <p className="mb-2"><strong>Vista previa:</strong></p>
              <Image 
                src={imagePreview} 
                alt="Previsualización" 
                fluid 
                rounded 
                style={{ maxHeight: '120px', maxWidth: '100%' }} 
              />
            </div>
          )}
          
          <Row className="mt-4">
            <Col>
              <Button variant="secondary" onClick={handleClose} className="w-100 mb-2 mb-md-0">
                Cancelar
              </Button>
            </Col>
            <Col>
              <Button variant="primary" type="submit" className="w-100" disabled={!!imageError}>
                {product ? 'Actualizar' : 'Crear'} Producto
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default BodegaPage;