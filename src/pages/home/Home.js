import React, { Component } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../services/firebase";

export default class Home extends Component {
  render() {
    return (
      <div className="home">
        <div className='_background'></div>
        <div>
          <section>
            <div className="jumbotron-fluid py-5">
        <section>
            <div className="jumbotron-fluid">
              <div className="text-center" style={{ display: 'flex', justifyContent: 'space-around'}}>
              <Link to="/contacto" className="transparent btn btn-light" style={{margin: 'auto', width: '20%', height: '150px', paddingTop: '57px'}}>
                  Contacto
              </Link>
                <Link to="/reserva" className="transparent btn btn-light" style={{margin: 'auto', width: '20%', height: '150px', paddingTop: '57px'}}>
                   Reserva
                </Link>
                <Link to="/tarifas" className="transparent btn btn-light" style={{margin: 'auto', width: '20%', height: '150px', paddingTop: '57px'}}>
                  Tarifas
                </Link>
              </div>
            </div>
          </section>
              <div className="container text-center py-5">
                <h1 className="transparent jumbotron display-4">
                  Bienvenido a Padel Fogars De La Selva
                </h1>
                <p className="transparent jumbotron lead">
                  Disfruta de nuestras instalciones y de el mejor trato.
                </p>
                {auth().currentUser ? (
                  <div className="mt-4">
                    <Link
                      className="transparent btn btn-light px-5 mr-3 mt-4"
                      to="/"
                      onClick={() => auth().signOut()}
                    >
                      LogOut
                    </Link>
                  </div>
                ) : (
                  <div className="mt-4">
                    <Link
                      className="transparent btn btn-light px-5 mr-3 mt-4"
                      to="/signup"
                    >
                      Crear Cuenta
                    </Link>
                    <Link
                      className="transparent btn btn-light px-5 mr-3 mt-4"
                      to="/login"
                    >
                      Entra en tu cuenta
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
