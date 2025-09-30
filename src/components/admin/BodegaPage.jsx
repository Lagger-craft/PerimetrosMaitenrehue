import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Table, Image, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { PencilSquare, Trash, PlusCircle } from 'react-bootstrap-icons';
import { API_ENDPOINTS, getImageUrl } from '../../config/api.js';
import './BodegaPage.css';

const BodegaPage = () => {
  const { user } = useContext(AuthContext);
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
    return <div className="text-center text-white p-5">Cargando productos...</div>;
  }

  if (error) {
    return <div className="text-center text-danger p-5">Error: {error}</div>;
  }

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
                    <tr key={product._id}>
                      <td>
                        {product.image && <Image src={getImageUrl(product.image)} rounded width="60" />}
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
                        <Button variant="outline-danger" size="sm" onClick={() => handleDeleteProduct(product._id)}>
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
          <Form.Group className="mb-3">
            <Form.Label>Imagen del Producto</Form.Label>
            <Form.Control type="file" name="imageFile" onChange={handleFileChange} accept=".png,.jpg,.jpeg,.webp" />
            {imageError && <Alert variant="danger" className="mt-2">{imageError}</Alert>}
            {imagePreview && (
              <div className="mt-3 text-center">
                <Image src={imagePreview} alt="Previsualización" fluid rounded style={{ maxHeight: '150px' }} />
              </div>
            )}
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