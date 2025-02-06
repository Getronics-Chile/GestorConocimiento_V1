import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import styles from "../assets/css/Login.module.css"; // Únicamente LoginModule.css para evitar conflictos

function Login({ setIsAuthenticated }) {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
          console.log("El token ha expirado, cerrando sesión...");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      }
    };
    checkToken();
  }, [setIsAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8080/realms/g-manager-realm-dev/protocol/openid-connect/token",
        new URLSearchParams({
          client_id: "gestor-conocimiento-client-front",
          client_secret: "TkfMAYacpja8xr9GGh19kR9fiv5bi1dT",
          grant_type: "password",
          username: credentials.username,
          password: credentials.password,
        })
      );

      const { access_token } = response.data;
      console.log("Token de acceso:", access_token);

      const decodedToken = jwtDecode(access_token);
      console.log("Decoded Token:", decodedToken);

      const username = decodedToken.preferred_username || "Usuario";
      const roles = decodedToken.realm_access?.roles || [];

      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify({ username, roles }));

      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      console.error("Error al obtener el token:", error);
      setError("Credenciales incorrectas");
    } finally {
      setLoading(false);
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
        <form onSubmit={handleSubmit} className={styles["login-form"]}>
          <div className={styles["form-group"]}>
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
          <div className={styles["form-group"]}>
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
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

export default Login;
