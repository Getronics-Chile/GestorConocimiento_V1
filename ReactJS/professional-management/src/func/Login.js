import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../assets/css/Login.module.css"; // Únicamente LoginModule.css para evitar conflictos

function Login({ setIsAuthenticated }) {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = credentials;

    const hardcodedUsername = "admin";
    const hardcodedPassword = "1234";

    if (username === hardcodedUsername && password === hardcodedPassword) {
      setIsAuthenticated(true);
      navigate("/dashboard");
    } else {
      setError("Credenciales incorrectas");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  return (
    
    <div className={styles.background}>
      <div className={styles.container}>
        <h2 className={styles.title}>G - Manager</h2>
        <form onSubmit={handleSubmit} className={styles['login-form']}>
          <div className={styles['form-group']}>
            <input
              type="text"
              id="username"
              name="username"
              className="form-control"
              placeholder="Usuario"
              value={credentials.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles['form-group']}>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              placeholder="Contraseña"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className={styles.button}>Iniciar Sesión</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
