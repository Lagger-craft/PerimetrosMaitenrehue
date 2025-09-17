import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  memo,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import {
  Telephone,
  Facebook,
  PersonCircle,
  PersonFillGear,
} from "react-bootstrap-icons";
import AuthContext from "../context/AuthContext"; // Importar el contexto
import "./Navbar.css";
import logo from "../assets/mi-logo.png";

const AppNavbar = memo(() => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { user, logout } = useContext(AuthContext); // Usar el contexto
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Llama a la función logout del contexto
    navigate("/"); // Redirige a la página principal
  };

  const controlNavbar = useCallback(() => {
    const currentScrollY = window.scrollY;

    if (currentScrollY < 20) {
      // Arriba del todo, siempre mostrar
      setShow(true);
    } else if (currentScrollY > lastScrollY) {
      // Bajando
      setShow(false);
    } else {
      // Subiendo
      setShow(false);
    }

    setLastScrollY(currentScrollY);
  }, [lastScrollY]);
  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [controlNavbar]);

  const userIcon =
    user?.role === "admin" ? (
      <PersonFillGear size={24} />
    ) : (
      <PersonCircle size={24} />
    );

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
            {!(user && user.role === 'admin') && (
              <Nav.Link
                href="tel:+56987761691"
                className="d-flex align-items-center me-3 contact-link"
              >
                <Telephone className="me-2" />
                +56 9 8776 1691
              </Nav.Link>
            )}
            {!(user && user.role === 'admin') && (
              <Nav.Link
                href="https://www.facebook.com/empresafamiliarag.ltda/"
                target="_blank"
                rel="noopener noreferrer"
                className="d-flex align-items-center me-3 contact-link"
              >
                <Facebook className="me-2" />
                Facebook
              </Nav.Link>
            )}

            {user && user.role === 'admin' ? (
              <>
                <Link to="/administracion/dashboard" className="btn btn-outline-light me-2">
                  Cotizaciones
                </Link>
                <Link to="/administracion/bodega" className="btn btn-light me-3">
                  Bodega
                </Link>
                <NavDropdown title={userIcon} id="basic-nav-dropdown" align="end">
                  <NavDropdown.ItemText>
                    Conectado como: <strong>{user.username}</strong>
                  </NavDropdown.ItemText>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Cerrar Sesión
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : user ? (
              <NavDropdown title={userIcon} id="basic-nav-dropdown" align="end">
                <NavDropdown.ItemText>
                  Conectado como: <strong>{user.username}</strong>
                </NavDropdown.ItemText>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Cerrar Sesión
                </NavDropdown.Item>
              </NavDropdown>
            ) : null}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
});

export default AppNavbar;
