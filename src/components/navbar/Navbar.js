import React from "react";
import { auth } from "../../services/firebase";
import { Nav } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import { withRouter } from "react-router-dom";

class Navigation extends React.Component {
  

  render() {
    return (
      <div className="navBar">
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand href="/">Padel Fogars</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {auth().currentUser ? (
              <Nav className="mr-auto">
                <Nav.Link href="/contacto">Contacto</Nav.Link>
                <Nav.Link href="/reserva">Reserva</Nav.Link>
                <Nav.Link href="/tarifas">Tarifas</Nav.Link>
                <Nav.Link href="/misreservas">Mis Reservas</Nav.Link>
              </Nav>
            ) : (
              <Nav className="mr-auto">
                <Nav.Link href="/login">LogIn</Nav.Link>
                <Nav.Link href="/signup">SignUp</Nav.Link>
                <Nav.Link href="/contacto">Contacto</Nav.Link>
                <Nav.Link href="/login">Tarifas</Nav.Link>
              </Nav>
            )}
            
          </Navbar.Collapse>
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                Bienvenido: <a href="misreservas">{auth().currentUser.email}</a>
              </Navbar.Text>
            </Navbar.Collapse>
          </Navbar>
      </div>
    );
  }
}

export default withRouter(Navigation);
