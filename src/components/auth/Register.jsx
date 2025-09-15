import React from "react";
import { Person, Lock, Envelope } from "react-bootstrap-icons";
import "./Register.css";

const Register = () => {
  return (
    <div className="wrapper">
      <form action="">
        <h1>Registro</h1>
        <div className="input-box">
          <input type="text" placeholder="Usuario" required />
          <Person className="icon" />
        </div>
        <div className="input-box">
          <input type="email" placeholder="Correo Electronico" required />
          <Envelope className="icon" />
        </div>
        <div className="input-box">
          <input type="password" placeholder="Contraseña" required />
          <Lock className="icon" />
        </div>

        <button type="submit">Registrarse</button>

        <div className="login-link">
          <p>
            \u00bfYa tienes una cuenta? <a href="/login">Inicia Sesi\u00f3n</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
