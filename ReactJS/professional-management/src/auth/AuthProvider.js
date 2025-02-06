import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import keycloak from "./keycloak";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    debugger;
    keycloak
      .init({ onLoad: 'login-required' })
      .then((auth) => {
        setIsAuthenticated(auth);
        if (auth) {
          localStorage.setItem("token", keycloak.token);
          keycloak.loadUserInfo().then(setUser);
          navigate("/dashboard"); // Redirige al dashboard tras autenticarse
        }
      })
      .catch((err) => console.error("Error al inicializar Keycloak", err));
  }, [navigate]);

  const login = () => keycloak.login();
  const logout = () => {
    keycloak.logout();
    setIsAuthenticated(false);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);