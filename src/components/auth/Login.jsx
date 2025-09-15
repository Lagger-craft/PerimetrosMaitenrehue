import React from "react";
import { Person, Lock } from "react-bootstrap-icons";
import "./Login.css";

const Login = () => {
  return (
    <div className="wrapper">
      <form action="">
        <h1>Iniciar Session</h1>
        <div className="input-box">
          <input type="text" placeholder="Usuario" required />
          <Person className="icon" />
        </div>
        <div className="input-box">
          <input type="password" placeholder="Contraseña" required />
          <Lock className="icon" />
        </div>

        <div className="remember-forgot">
          <label>
            <input type="checkbox" />
            Recuérdame
          </label>
          <a href="../../../PerimetrosMaitenrehue">¿Olvidaste tu contraseña?</a>
        </div>

        <button type="submit">Ingresar</button>

        <div className="register-link">
          <p>
            ¿No tienes una cuenta? <a href="/register">Regístrate</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
