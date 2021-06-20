import React, { Component } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../services/firebase";

export default class Home extends Component {
  render() {
    return (
      <div className="home">
        <div className='_background'></div>
        <div className=''>
          <section>
            <div className="jumbotron-fluid">
              <div className="container py-5">
                <h1 className="transparent text-center jumbotron display-4">
                  Bienvenido a Padel Fogars De La Selva
                </h1>
                <p className="transparent text-center jumbotron lead">
                  Disfruta de nuestras instalciones y de el mejor trato.
                </p>
                {auth().currentUser ? (
                  <div className="mt-4 text-center">
                    <div className="d-flex flex-column">
                    <section className="d-flex justify-content-around row">
                        <Link to="/contacto" className="transparent btn btn-light pt-5 pb-5 w-2 mb-5" style={{width: "10rem"}}>
                            Contacto
                        </Link>
                          <Link to="/reserva" className="transparent btn btn-light pt-5 pb-5 w-2 mb-5" style={{width: "10rem"}}>
                            Reservar
                          </Link>
                          <Link to="/misreservas" className="transparent btn btn-light pt-5 pb-5 w-2 mb-5" style={{width: "10rem"}}>
                            Mis Reservas
                          </Link>
                          <Link to="/tarifas" className="transparent btn btn-light pt-5 pb-5 w-2 mb-5" style={{width: "10rem"}}>
                            Tarifas
                          </Link>
                    </section>
                    </div>
                    <Link
                      className="transparent btn btn-light m-5"
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
