import { useState, useEffect, useCallback, useContext, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";
import {
  Telephone,
  Facebook,
  PersonCircle,
  PersonFillGear,
  Whatsapp,
} from "react-bootstrap-icons";
import AuthContext from "../context/AuthContext"; // Importar el contexto
import useScreenSize from "../hooks/useScreenSize"; // Hook para detectar tamaño de pantalla
import "./Navbar.css";
import logo from "../assets/mi-logo.png";

const AppNavbar = memo(() => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { isMobile } = useScreenSize(); // Detectar si es móvil

  const { user, logout } = useContext(AuthContext); // Usar el contexto
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Llama a la función logout del contexto
    navigate("/"); // Redirige a la página principal
  };

  // URLs para contacto
  const phoneNumber = "+56987761691";
  const whatsappURL = `https://wa.me/56987761691?text=${encodeURIComponent("Hola, me interesa obtener información sobre sus cercos vibrados. ¿Podrían ayudarme?")}`;
  const phoneURL = `tel:${phoneNumber}`;

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
            {!(user && user.role === "admin") && (
              <>
                {/* Botón principal - WhatsApp en móvil, teléfono en desktop */}
                <Button
                  href={isMobile ? whatsappURL : phoneURL}
                  target={isMobile ? "_blank" : "_self"}
                  rel={isMobile ? "noopener noreferrer" : ""}
                  variant="outline-light"
                  className="d-flex align-items-center me-2"
                  size="sm"
                  title={isMobile ? "Contactar por WhatsApp" : "Llamar por teléfono"}
                >
                  {isMobile ? (
                    <>
                      <Whatsapp className="me-2" />
                      <span className="d-none d-lg-inline">WhatsApp</span>
                      <span className="d-lg-none">WhatsApp</span>
                    </>
                  ) : (
                    <>
                      <Telephone className="me-2" />
                      <span className="d-none d-lg-inline">{phoneNumber}</span>
                      <span className="d-lg-none">Llamar</span>
                    </>
                  )}
                </Button>
                
                {/* Botón secundario - Solo en desktop o como alternativa en móvil */}
                {!isMobile && (
                  <Button
                    href={whatsappURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline-success"
                    className="d-flex align-items-center me-2"
                    size="sm"
                    title="Contactar por WhatsApp"
                  >
                    <Whatsapp className="me-2" />
                    <span className="d-none d-xl-inline">WhatsApp</span>
                    <span className="d-xl-none">WA</span>
                  </Button>
                )}
              </>
            )}
            {!(user && user.role === "admin") && (
              <Button
                href="https://www.facebook.com/empresafamiliarag.ltda/"
                target="_blank"
                rel="noopener noreferrer"
                variant="outline-light"
                className="d-flex align-items-center me-3"
                size="sm"
              >
                <Facebook className="me-2" />
                Facebook
              </Button>
            )}

            {user && user.role === "admin" ? (
              <div className="admin-nav-links">
                <Link
                  to="/administracion/dashboard"
                  className="btn btn-outline-light"
                >
                  <span className="d-none d-sm-inline">Ver </span>Cotizaciones
                </Link>
                <Link
                  to="/administracion/bodega"
                  className="btn btn-light"
                >
                  <span className="d-none d-sm-inline">Gestión </span>Bodega
                </Link>
                <NavDropdown
                  title={userIcon}
                  id="admin-nav-dropdown"
                  align="end"
                >
                  <NavDropdown.ItemText>
                    <strong>{user.username}</strong>
                    <br />
                    <small className="text-muted">Administrador</small>
                  </NavDropdown.ItemText>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Cerrar Sesión
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
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
