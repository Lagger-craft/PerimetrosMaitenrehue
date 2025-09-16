import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Person, Lock } from 'react-bootstrap-icons';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import './Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar el usuario');
      }

      setMessage('¡Usuario registrado con éxito! Redirigiendo a la página de inicio de sesión...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="wrapper">
      <Container>
        <Row className="justify-content-md-center">
          <Col md={6} lg={4}>
            <div className="login-form-container">
              <h1 className="text-center mb-4">Registro</h1>
              {error && <Alert variant="danger">{error}</Alert>}
              {message && <Alert variant="success">{message}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3 input-box" controlId="formBasicUsername">
                  <Form.Control
                    type="text"
                    placeholder="Usuario"
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

                <Button variant="primary" type="submit" className="w-100 mt-3">
                  Registrarse
                </Button>

                <div className="login-link mt-3 text-center">
                  <p>
                    ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link>
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

export default Register;
