import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Telephone, Facebook } from "react-bootstrap-icons";
import "./Navbar.css"; // Para estilos personalizados
import logo from "../assets/mi-logo.png";

const AppNavbar = () => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = useCallback(() => {
    if (window.scrollY > lastScrollY && window.scrollY > 50) {
      // Si se hace scroll hacia abajo y se ha pasado de 50px, se oculta.
      setShow(false);
    } else if (window.scrollY < 15) {
      // Si se hace scroll hacia arriba o se está cerca del tope, se muestra.
      setShow(true);
    } else {
      setShow(false);
    }
    setLastScrollY(window.scrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [controlNavbar]);

  return (
    <Navbar
      bg="transparent"
      expand="lg"
      fixed="top"
      className={`${!show && "navbar--hidden"}`}
      variant="dark"
    >
      <Container>
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img
            src={logo}
            alt="Logo"
            width="160"
            height="100"
            className="me-2"
          />
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center">
            <Nav.Link
              href="tel:+56987761691"
              className="d-flex align-items-center me-3 contact-link"
            >
              <Telephone className="me-2" />
              +56 9 8776 1691
            </Nav.Link>
            <Nav.Link
              href="https://www.facebook.com/empresafamiliarag.ltda/"
              target="_blank"
              rel="noopener noreferrer"
              className="d-flex align-items-center me-3 contact-link"
            >
              <Facebook className="me-2" />
              Facebook
            </Nav.Link>
            <Link to="/login" className="btn btn-outline-light me-2">
              Ingresar
            </Link>
            <Link to="/register" className="btn btn-light">
              Registrarse
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
