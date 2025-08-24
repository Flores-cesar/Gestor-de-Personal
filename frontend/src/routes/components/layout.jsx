import { NavLink } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

export default function Layout({ children }) {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="shadow-sm">
        <Container>
          <Navbar.Brand
            as={NavLink}
            to="/descripcion"
            className="fw-bold d-flex align-items-center"
            style={{ fontSize: "1.5rem" }}
          >
            <span
              className="me-2 d-inline-flex align-items-center justify-content-center"
              style={{
                width: "35px",
                height: "35px",
                backgroundColor: "#0d6efd",
                borderRadius: "8px",
                fontSize: "1.2rem",
              }}
            >
              👥
            </span>
            Gestión de Personal
          </Navbar.Brand>

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={NavLink} to="/empleados" className="fw-medium px-3">
                👨‍💼 Empleados
              </Nav.Link>

              <Nav.Link as={NavLink} to="/departamentos" className="fw-medium px-3">
                🏢 Departamentos
              </Nav.Link>

              <Nav.Link as={NavLink} to="/roles" className="fw-medium px-3">
                🎖️ Roles
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Contenido principal */}
      <div
        style={{
          paddingTop: "80px", // espacio para el navbar fixed
          width: "100%",
          minHeight: "calc(100vh - 80px - 80px)", // alto dinámico
          backgroundColor: "#f8f9fa",
        }}
      >
        <Container fluid className="py-4">
          {children}
        </Container>
      </div>

      <footer
        className="bg-dark text-light py-4 mt-auto"
        style={{
          position: "relative",
          bottom: 0,
          width: "100%",
        }}
      >
        <Container>
          <div className="row align-items-center">
            <div className="col-12 col-md-6 mb-2 mb-md-0">
              <p className="mb-0 text-light">
                &copy; {new Date().getFullYear()} Gestión de Personal.
                <small className="text-light opacity-75 ms-2">
                  Todos los derechos reservados.
                </small>
              </p>
            </div>
          </div>
        </Container>
      </footer>
      
    </>
  );
}
