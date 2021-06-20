import React from "react";
import { auth, db } from "../../services/firebase";
import { Nav } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import { withRouter } from "react-router-dom";



class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: []
    }
  }

  async componentDidMount() {
    try{
      let usuarios = [];
      let user = []
      db.ref("usuarios").on("value", (snapshot) => {
        snapshot.forEach((snap) => {
          usuarios.push(snap.val());
          user = usuarios.filter((usuarios) => usuarios.email === auth().currentUser.email);
          console.log(user)
          this.setState({
            user: user
          })
        });
      })
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    console.log(this.state)
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
            {auth().currentUser && 
              <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                Bienvenido: <a href="misreservas">{ this.state.user[0] && this.state.user[0].nick }</a>
              </Navbar.Text>
            </Navbar.Collapse>
            }
          </Navbar.Collapse>
            
          </Navbar>
      </div>
    );
  }
}

export default withRouter(Navigation);
