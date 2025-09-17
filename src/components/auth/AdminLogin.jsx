import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Person, Lock } from 'react-bootstrap-icons';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import AuthContext from '../../context/AuthContext';
import './AuthCommon.css'; // Usar el CSS común para autenticación

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const loggedInUser = await login(username, password); // La función login devuelve el usuario logueado
      
      if (loggedInUser && loggedInUser.role === 'admin') {
        navigate('/administracion/dashboard'); // Redirigir al dashboard de admin
      } else {
        // Si el usuario no es admin, o si login no devuelve un usuario (error de credenciales)
        // logout() para limpiar cualquier token de un usuario no-admin que pudiera haberse guardado
        // aunque la función login del contexto ya debería manejar esto si el rol no es admin.
        // Aquí forzamos el error si no es admin.
        if (loggedInUser) {
            // Si se logueó como usuario normal, lo deslogueamos y mostramos error
            await logout(); 
            setError('Acceso denegado: Solo administradores pueden ingresar aquí.');
        } else {
            // Si hubo un error de credenciales (login ya lo maneja, pero por seguridad)
            setError('Credenciales inválidas para administrador.');
        }
      }
    } catch (err) {
      setError(err.message || 'Error al intentar iniciar sesión como administrador.');
    }
  };

  return (
    <div className="wrapper">
      <Container>
        <Row className="justify-content-md-center">
          <Col md={6} lg={4}>
            <div className="login-form-container">
              <h1 className="text-center mb-4">Acceso de Administrador</h1>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3 input-box" controlId="formBasicUsername">
                  <Form.Control
                    type="text"
                    placeholder="Usuario Administrador"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <Person className="icon" />
                </Form.Group>

                <Form.Group className="mb-3 input-box" controlId="formBasicPassword">
                  <Form.Control
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Lock className="icon" />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Ingresar como Administrador
                </Button>

                <div className="login-link mt-3 text-center">
                  <p>
                    <Link to="/">Volver a la página principal</Link>
                  </p>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminLogin;
