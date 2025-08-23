import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

export default function Layout({children}) {
  return (
    <>

      <Navbar bg="light" data-bs-theme="light">
        <Container>
          <Navbar.Brand href="/Descripcion">Gestion de personal</Navbar.Brand>
          <Nav className="ms-auto">
            <Nav.Link href="/empleados">Empleados</Nav.Link>
            <Nav.Link href="/departamentos">Departamentos</Nav.Link>
            <Nav.Link href="/roles">Roles</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <div style={{  
        paddingTop: '40px', 
        width: '100%', 
        minHeight: 'calc(100vh - 56px - 60px)', // Ajusta el contenido principal
        }}>
        {children}
      </div>

      <footer
        style={{
          backgroundColor: '#f8f9fa', // Color de fondo similar al Navbar
          padding: '20px 0',
          textAlign: 'center',
          position: 'relative',
          bottom: 0,
          width: '100%',
          height: '60px', // Altura fija del footer
        }}
      >
        <Container>
          <p style={{ margin: 0, color: '#6c757d' }}>
            &copy; {new Date().getFullYear()} Gestión de Personal. Todos los derechos reservados.
          </p>
        </Container>
      </footer>
      
    </>
  );
}
