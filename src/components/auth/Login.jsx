import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Person, Lock } from "react-bootstrap-icons";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import AuthContext from "../../context/AuthContext"; // Importar el contexto
import "./AuthCommon.css"; // Importar el CSS común para autenticación

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext); // Usar el contexto
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(username, password); // Llamar a la función login del contexto
      navigate("/"); // Redirigir al home
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
              <h1 className="text-center mb-4">Iniciar Sesión</h1>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group
                  className="mb-3 input-box"
                  controlId="formBasicUsername"
                >
                  <Form.Control
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <Person className="icon" />
                </Form.Group>

                <Form.Group
                  className="mb-3 input-box"
                  controlId="formBasicPassword"
                >
                  <Form.Control
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Lock className="icon" />
                </Form.Group>

                <div className="remember-forgot">
                  <Form.Check type="checkbox" label="Recuérdame" />
                  <a href="WhatPassword">¿Olvidaste tu contraseña?</a>
                </div>

                <Button variant="primary" type="submit" className="w-100">
                  Ingresar
                </Button>

                <div className="register-link mt-3 text-center">
                  <p>
                    ¿No tienes una cuenta?{" "}
                    <Link to="/register">Regístrate</Link>
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

export default Login;
