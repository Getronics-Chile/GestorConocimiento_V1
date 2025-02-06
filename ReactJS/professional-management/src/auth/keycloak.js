import Keycloak from "keycloak-js";

const keycloakConfig = {
    url: "http://localhost:8080/", // URL del servidor Keycloak
    realm: "g-manager-realm-dev", // Nombre del Realm
    clientId: "gestor-conocimiento-client-api-rest", // ID del Cliente en Keycloak
    redirectUri: "https://www.google.com", // Usar una URL completa
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
