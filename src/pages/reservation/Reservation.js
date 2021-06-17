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
    this.changeHours();
    try {
      db.ref("reservas").on("value", (snapshot) => {
        let reservations = [];

        snapshot.forEach((snap) => {
          reservations.push(snap.val());
        });
        reservations.sort(function (a, b) {
          return a.timestamp - b.timestamp;
        });
        let reservedHours = [];
        // eslint-disable-next-line array-callback-return
        reservations.filter((f) => {
          if (f.date === this.state.date && f.pista === this.state.pista) {
            reservedHours.push(f.start.slice(-5));
          }
        });
        let hours = [ "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

        hours = hours.filter((item) => !reservedHours.includes(item));
        firstAvaliableHour = hours;
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

  changeHours() {
    let reservedHours = [];
    // eslint-disable-next-line array-callback-return
    this.state.reservations.filter((f) => {
      if (f.date === this.state.date && f.pista === this.state.pista) {
        reservedHours.push(f.start.slice(-5));
      }
    });
    let hours = [ "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

    hours = hours.filter((item) => !reservedHours.includes(item));
    firstAvaliableHour = hours;
  }

  handleDateChange(event, date) {
    this.changeHours();
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

   handlePistChange(event) {
    this.setState({
      pista: event.target.value,
      priorityId: event.target.value === "Pista 1" ? 1 : 2,
      start: `${moment().format("DD MMMM yyyy")} ${firstAvaliableHour.slice(0,1)}`,
      end: `${moment().format("DD MMMM yyyy")} ${firstAvaliableHour.slice(1,2)}`,
    });
  }

  handleAvaliableField(event) {
    let reservedHours = [];
    let startHour = `${moment(this.state.date).format("DD MMMM yyyy")} ${event.target.value}`;
    // eslint-disable-next-line array-callback-return
    this.state.reservations.filter((f) => {
      if (f.date === this.state.date && f.pista === this.state.pista) {
        reservedHours.push(f.start.slice(-5));
      }
    });
    let hours = [ "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00" ];

    firstAvaliableHour = hours.filter((item) => !reservedHours.includes(item));

    this.setState({
      reserved: reservedHours,
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
                  onClick={this.changeHours()}
                  onError={console.log}
                  disablePast
                  format="DD MMMM yyyy"
                  minutesStep={15}
                  autoOk={true}
                />
                {/* <KeyboardTimePicker
                    ampm={false}
                    variant="inline"
                    label="With keyboard"
                    value={this.state.end}
                    onChange={this.handleEndChange}
                    disablePast
                    minutesStep={15}
                    autoOk={true}
                  /> */}
              </>
            </MuiPickersUtilsProvider>
            <br></br>
            <br></br>
            <Form.Group style={{ width: "250px", margin: "auto" }}>
              <Form.Control
                onChange={ (event) => { this.handlePistChange(event) ; this.changeHours()} }
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
                onClick={this.handleAvaliableField}
                size="sm"
                as="select"
                defaultValue="Selecciona hora..."
              > 
              <option>Selecciona hora...</option>
                {firstAvaliableHour.map((t) => {
                  return (
                    <option>{t}</option>);
                })}
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
