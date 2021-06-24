import React, { Component } from "react";
import { auth } from "../../services/firebase";
import { db } from "../../services/firebase";
import { makeStyles } from "@material-ui/core/styles";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { Button, Form } from "react-bootstrap";
import Appointments from "./Appointments";

import "./Reservation.css";
import moment from "moment";
import "moment/locale/es";

let firstAvaliableHour = ["09:00", "10:00"];
let firstAvaliableHour2 = ["09:00", "10:00"];

export default class Reservations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: auth().currentUser,
      date: moment().locale("es").format("DD MMMM yyyy"),
      start: `${moment().format("DD MMMM yyyy")} ${firstAvaliableHour.slice(0,1)}`,
      end: `${moment().format("DD MMMM yyyy")} ${firstAvaliableHour.slice(1,2)}`,
      pista: "Pista 1",
      priorityId: 1,
      reserved: [],
      reservations: [],
    };
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleEndChange = this.handleEndChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePistChange = this.handlePistChange.bind(this);
    this.handleAvaliableField = this.handleAvaliableField.bind(this);
    this.myRef = React.createRef();
  }

  async componentDidMount() {
    this.setState({ readError: null });
    try {
      db.ref("reservas").on("value", (snapshot) => {
        let reservations = [];

        snapshot.forEach((snap) => {
          reservations.push(snap.val());
        });
        reservations.sort(function (a, b) {
          return a.timestamp - b.timestamp;
        });
        this.setState({
          reservations,
          rRule: "RRULE:INTERVAL=1;FREQ=DAILY;COUNT=1",
          date: moment().format("DD MMMM yyyy"),
          start: `${moment().format("DD MMMM yyyy")} ${firstAvaliableHour.slice(0,1)}`,
          end: `${moment().format("DD MMMM yyyy")} ${firstAvaliableHour.slice(1,2)}`,
          timestamp: Date.now()
        });
        reservations.forEach((res) => {
          if ( new Date(res.end) < new Date() && res.rRule === "RRULE:INTERVAL=1;FREQ=DAILY;COUNT=1"){
            db.ref("reservas/" + res.timestamp).remove()
          }
        })
      });
    } catch (error) {
      this.setState({ readError: error.message });
    }
  }

  handleDateChange(event, date) {
    //this.changeHours();
    this.setState({
      date: moment(date).format("DD MMMM yyyy"),
      start: `${moment(date).format("DD MMMM yyyy")} ${firstAvaliableHour.slice(0,1)}`,
      end: `${moment(date).format("DD MMMM yyyy")} ${firstAvaliableHour.slice(1,2)}`,
    });
  }

  handleEndChange(event) {
    this.setState({
      end: moment(this.state.start).add(`${"0"}${event.target.value}${":00:00"}`).format("DD MMMM yyyy HH:mm"),
    });
  }

  // async componentDidUpdate(snapshot) {
  //   if (this.state !== snapshot) {
  //     try{
  //       let reservedIntervals = []
  //       let reservedHours = [];
    
  //       let hours = [ "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30" ];
    
  //       //eslint-disable-next-line array-callback-return
  //       this.state.reservations.filter((f) => {
  //         if (f.date === this.state.date && f.pista === this.state.pista) {
  //           reservedHours.push(f.start.slice(-5));
  //         }
  //       });
    
  //       for(let i=0; i<hours.length; i++){
  //         if(reservedHours.includes(hours[i])){
  //         reservedIntervals.push(hours[i-1], hours[i], hours[i+1]);
  //         }
  //       }
       
  //      firstAvaliableHour = hours.filter((item) =>  !reservedIntervals.includes(item))
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  //}

   async handlePistChange(event) {
    if(event.target.value === "Pista 1"){
      let reservedIntervals = []
      let reservedHours = [];
  
      let hours = [ "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30" ];
  
      //eslint-disable-next-line array-callback-return
      this.state.reservations.filter((f) => {
        if (f.date === this.state.date && f.pista === "Pista 1") {
          reservedHours.push(f.start.slice(-5));
        }
      });
  
      for(let i=0; i<hours.length; i++){
        if(reservedHours.includes(hours[i])){
        reservedIntervals.push(hours[i-1], hours[i], hours[i+1]);
        }
      }
     
     firstAvaliableHour = hours.filter((item) =>  !reservedIntervals.includes(item))
    }else{
      let reservedIntervals = []
      let reservedHours = [];
  
      let hours = [ "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30" ];
  
      //eslint-disable-next-line array-callback-return
      this.state.reservations.filter((f) => {
        if (f.date === this.state.date && f.pista === "Pista 2") {
          reservedHours.push(f.start.slice(-5));
        }
      });
  
      for(let i=0; i<hours.length; i++){
        if(reservedHours.includes(hours[i])){
        reservedIntervals.push(hours[i-1], hours[i], hours[i+1]);
        }
      }
     
     firstAvaliableHour2 = hours.filter((item) =>  !reservedIntervals.includes(item))
    }

     this.setState({
       pista: event.target.value,
       priorityId: event.target.value === "Pista 1" ? 1 : 2,
       start: `${moment().format("DD MMMM yyyy")} ${firstAvaliableHour.slice(0,1)}`,
       end: `${moment().format("DD MMMM yyyy")} ${firstAvaliableHour.slice(1,2)}`,
      });
    }

  async handleAvaliableField(event) {
    let startHour = `${moment(this.state.date).format("DD MMMM yyyy")} ${event.target.value}`;
    
    this.setState({
      start: `${moment(this.state.date).format("DD MMMM yyyy")} ${event.target.value}`,
      end: `${moment(startHour).add("01:00:00").format("DD MMMM yyyy HH:mm")}`,
    });
  }

  async handleSubmit(event, timestamp) {
    this.setState({ writeError: null });
    try {
      await db.ref("reservas/" + this.state.timestamp).set({
        date: this.state.date,
        start: this.state.start,
        end: this.state.end,
        timestamp: this.state.timestamp,
        uid: this.state.user.uid,
        email: "Reservada",
        pista: this.state.pista,
        priorityId: this.state.priorityId,
        rRule: this.state.rRule
      });
    } catch (error) {
      this.setState({ writeError: error.message });
    }
  }

  render() {  
    return (
      <div className="reserva">
        <div className="date">
          <br></br>
          Bienvenido{" "}
          <strong className="text-info">{this.state.user.email}</strong>
          <form
            style={{ padding: "30px" }}
            onSubmit={this.handleSubmit}
            className={makeStyles.container}
            noValidate
          >
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <>
                <KeyboardDatePicker
                  variant="inline"
                  ampm={false}
                  label="Selecciona Fecha"
                  value={this.state.date}
                  onChange={this.handleDateChange}
                  //onClick={this.changeHours()}
                  onError={console.log}
                  disablePast
                  format="DD MMMM yyyy"
                  minutesStep={15}
                  autoOk={true}
                />
              </>
            </MuiPickersUtilsProvider>
            <br></br>
            <br></br>
            <Form.Group 
            onChange={ (event) => { this.handlePistChange(event) } }
            style={{ width: "250px", margin: "auto" }}>
              <Form.Control
                size="sm"
                as="select"
                defaultValue="Selecciona Pista"
              >
                <option>Selecciona Pista</option>
                <option>Pista 1</option>
                <option>Pista 2</option>
              </Form.Control>
            </Form.Group>
            <Form.Group
              onChange={this.handleAvaliableField}
              style={{ width: "250px", margin: "auto" }}
            >
              <Form.Control
                size="sm"
                as="select"
                defaultValue="Selecciona hora..."
              > 
              <option>Selecciona hora...</option>
              {this.state.pista === "Pista 1" ? 
                firstAvaliableHour.map((t) => {
                  return (
                    <option>{t}</option>);
                })
                :
                firstAvaliableHour2.map((t) => {
                  return (
                    <option>{t}</option>);
                })
              }
              
              </Form.Control>
            </Form.Group>
            {/* <Form.Group style={{ width: "250px", margin: "auto" }}>
              <Form.Label>Horas De Juego</Form.Label>
              <Form.Control
                onChange={this.handleEndChange}
                onClick={this.changeHours()}
                size="sm"
                as="select"
              >
                <option>1</option>
                <option>2</option>
              </Form.Control>
            </Form.Group> */}
            <Button
              style={{ marginTop: "16px" }}
              type="submit"
              variant="primary"
            >
              Reservar
            </Button>
          </form>
        </div>
        <br></br>
        <div className="date">
          <Appointments />
        </div>
      </div>
    );
  }
}