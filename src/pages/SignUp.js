import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { signup, signInWithGoogle, signInWithGitHub } from "../helpers/auth";
import { db } from "../services/firebase";


export default class SignUp extends Component {

  constructor() {
    super();
    this.state = {
      error: null,
      email: '',
      password: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.googleSignIn = this.googleSignIn.bind(this);
    this.githubSignIn = this.githubSignIn.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }
  
  async handleSubmit(event) {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
    try {
      await signup(this.state.email, this.state.password);
      await db.ref("usuarios/" + event.target.name.value).set({
        email: event.target.email.value,
        name: event.target.name.value,
        nick:  event.target.nick.value
      });
    } 
    catch (error) {
      this.setState({ error: error.message });
    }
  }

  async googleSignIn() {
    try {
      await signInWithGoogle();
    } catch (error) {
      this.setState({ error: error.message });
    }
  }

  async githubSignIn() {
    try {
      await signInWithGitHub();
    } catch (error) {
      console.log(error)
      this.setState({ error: error.message });
    }
  }

  render() {
    return (
      <div className="container">
        <form className="mt-5 py-5 px-5" onSubmit={this.handleSubmit}>
          <h1>
            Registrate en
            <Link className="title ml-2" to="/">
              Padel Fogars
            </Link>
          </h1>
          <p className="lead">Rellena los campos para empezar</p>
          <div className="form-group">
            <input
              className="form-control"
              placeholder="Nombre"
              name="name"
              type="name"
              onChange={this.handleChange}
              value={this.state.name}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              placeholder="Alias"
              name="nick"
              type="nick"
              onChange={this.handleChange}
              value={this.state.nick}
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              placeholder="Email"
              name="email"
              type="email"
              onChange={this.handleChange}
              value={this.state.email}
            ></input>
          </div>
          <div className="form-group">
            <input
              className="form-control"
              placeholder="Contrase??a"
              name="password"
              onChange={this.handleChange}
              value={this.state.password}
              type="password"
            ></input>
          </div>
          <div className="form-group">
            {this.state.error ? (
              <p className="text-danger">{this.state.error}</p>
            ) : null}
            <button className="btn btn-primary px-5" type="submit">
              Registrate
            </button>
          </div>
          <p>You can also sign up with any of these services</p>
          <button
            className="btn btn-danger mr-2"
            type="button"
            onClick={this.googleSignIn}
          >
            Registrate con Google
          </button>
          <hr></hr>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={this.githubSignIn}
          >
            Sign up with GitHub
          </button>
          <hr></hr>
          <p>
            Ya tienes una cuenta? <Link to="/login">Inicia Sesi??n</Link>
          </p>
        </form>
      </div>
    );
  }
}
