import React from 'react';
import { useState, useEffect } from "react";
import { Card, CardGroup, CardImg, Row } from "react-bootstrap";
import { db } from "../../services/firebase";

let reservations = [];

export default function Personal() {
    const [reserva, setReserva] = useState(null);

    async function reservas() {
        try{
            db.ref("reservas").on("value", (snapshot) => {
        
                snapshot.forEach((snap) => {
                    reservations.push(snap.val());
                });
                reservations.sort(function (a, b) {
                    return a.timestamp - b.timestamp;
                }) 
                setReserva(reservations);
                console.log(reserva);
                });
        }catch(error){
            console.log(error)
        }
    }

    useEffect(() => {
       reservas()
       //eslint-disable-next-line
    }, [])
        
    return (
        <div>
           <Row xs={2} md={5} className="justify-content-md-center">
        {reservations.map((res) => {
            return(
                <Card className="m-2">
                    <Card.Body>
                    {(() => {
                    if (res.email === "clase" || res.email === "Clase") {
                return (
                    <Card.Img variant="top" src="clase.jpg" />               
                )
                }else if (res.pista === "Pista 1" && res.email !== "Clase" ) {
                return (
                    <Card.Img variant="top" src="pista1.jpg" />
                )
                } else if (res.pista === "Pista 1" && res.email !== "clase") {
                return (
                    <Card.Img variant="top" src="pista1.jpg" />               
                )
                } else if (res.pista === "Pista 2" && res.email !== "clase") {
                return (
                    <Card.Img variant="top" src="pista2.jpg" />               
                )
                } else if (res.pista === "Pista 2" && res.email !== "Clase") {
                return (
                    <Card.Img variant="top" src="pista2.jpg" />               
                )
                } 
                    })()}
                        <Card.Title>{res.email}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{res.start}</Card.Subtitle>
                        <Card.Subtitle className="mb-2 text-muted">{res.end}</Card.Subtitle>
                        <Card.Text>
                        {res.pista}
                        </Card.Text>
                    </Card.Body>
                </Card>
                   
            )
        })}
        </Row>
        </div>
    )
}


// {(res.pista === "Pista 1" && res.title !== "Clase" && res.title !== "clase")
// ?   <Card.Img variant="top" src="http://www.valldaurasport.com/media/image/noticias/web/20_Foto.1569103285.jpg" />
// :   <Card.Img variant="top" src="https://indusmetaltorres.es/wp-content/uploads/2018/04/Pista-padel-Carteya-verde-6005-1024x704.jpg" />
// }