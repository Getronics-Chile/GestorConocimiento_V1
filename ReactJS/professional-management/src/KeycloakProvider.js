import React, { createContext, useState, useEffect, useContext } from "react";
import Keycloak from "keycloak-js";
import { useNavigate } from "react-router-dom";
 
const keycloak = new Keycloak({
  url: "http://localhost:8080/", // URL del servidor Keycloak
  realm: "g-manager-realm-dev", // Nombre del Realm
  clientId: "gestor-conocimiento-client-api-rest", // ID del Cliente en Keycloak
});
 
const AuthContext = createContext();
 
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
 
  useEffect(() => {
    keycloak
      .init({ onLoad: "check-sso", silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html" })
      .then((authenticated) => {
        setIsAuthenticated(authenticated);
        if (authenticated) {
          setToken(keycloak.token);
          keycloak.loadUserInfo().then(setUser);
          navigate("/dashboard"); // Redirige al usuario autenticado al Dashboard
        }
      })
      .catch((err) => console.error("Error en Keycloak:", err));
  }, [navigate]);
 
  const login = () => keycloak.login();
  const logout = () => {
    keycloak.logout();
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    navigate("/");
  };
 
  return (
<AuthContext.Provider value={{ isAuthenticated, user, token, login, logout }}>
      {children}
</AuthContext.Provider>
  );
};
 
export const useAuth = () => useContext(AuthContext);