import React from "react";
import { Figure } from 'react-bootstrap';
import Map from "../../components/map/Map";

function Contact() {
  return (
    <div className="reserva">
      <div className="date">
      <Figure style={{padding: '20px'}}>
        <Figure.Image
          width="300rem"
          height="auto"
          alt="171x180"
          src="/foto1.jpg"
        />
        <Figure.Caption>
        <a href="mailto:g4rci1@gmail.com">Email: padelfogars@gmail.com</a>
        <br></br>
        <a href="tel:+34645940076">Tel: 645 94 00 76</a>
        </Figure.Caption>
      </Figure>
      </div>
      <Map />
    </div>
  );
}

export default Contact;
