import React from 'react';
import { useState, useEffect } from "react";
import { Card, CardGroup, CardImg, Row } from "react-bootstrap";
import { auth, db } from "../../services/firebase";

let reservations = [];

export default function Personal() {
    const [reserva, setReserva] = useState([]);
    
    async function reservas() {
        try{
            db.ref("reservas").on("value", (snapshot) => {
        
                snapshot.forEach((snap) => {
                    reservations.push(snap.val());
                });
                reservations.sort(function (a, b) {
                    return a.timestamp - b.timestamp;
                }) 
                setReserva(reservations.filter((appointment) => appointment.uid === auth().currentUser.uid));
                });
            }catch(error){
                console.log(error)
            }
            reservations = reservations.filter((appointment) => appointment.uid === auth().currentUser.uid);
        }
        
        useEffect(() => {
            reservas()
            //eslint-disable-next-line
        }, [])
        
        console.log(reservations);  
        return reserva.length > 0 ? (
          <div className="reserva">
          <div className="date">
            <Row xs={1} md={5} className="justify-content-md-center m-3">
              {reserva.map((e) => {
                return (
                  auth().currentUser.uid === e.uid && (
                    <Card className="mt-3 mb-3">
                      <Card.Body>
                        {(() => {
                          if (e.email === "clase" || e.email === "Clase") {
                            return <Card.Img variant="top" src="clase.jpg" />;
                          } else if (
                            e.pista === "Pista 1" &&
                            e.email !== "Clase"
                          ) {
                            return <Card.Img variant="top" src="pista1.jpg" />;
                          } else if (
                            e.pista === "Pista 1" &&
                            e.email !== "clase"
                          ) {
                            return <Card.Img variant="top" src="pista1.jpg" />;
                          } else if (
                            e.pista === "Pista 2" &&
                            e.email !== "clase"
                          ) {
                            return <Card.Img variant="top" src="pista2.jpg" />;
                          } else if (
                            e.pista === "Pista 2" &&
                            e.email !== "Clase"
                          ) {
                            return <Card.Img variant="top" src="pista2.jpg" />;
                          }
                        })()}
                        <Card.Title>{e.email}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                          {e.start}
                        </Card.Subtitle>
                        <Card.Subtitle className="mb-2 text-muted">
                          {e.end}
                        </Card.Subtitle>
                        <Card.Text>{e.pista}</Card.Text>
                      </Card.Body>
                    </Card>
                  )
                );
              })}
            </Row>
          </div>
          </div>
        ) : (
          <div className="reserva">
          <div className="date">
            <Row xs={1} md={5} className="justify-content-md-center m-3">
              <Card className="mt-3 mb-3">
              <Card.Img variant="top" src="pala1.jpg" />
                <Card.Body>
                  <Card.Title>No tienes pistas reservadas</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
                  <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
                  <Card.Text></Card.Text>
                  <Card.Link href="reserva">Reserva Ya!!!</Card.Link>
                </Card.Body>
              </Card>
            </Row>
          </div>
          </div>
        );
}

 