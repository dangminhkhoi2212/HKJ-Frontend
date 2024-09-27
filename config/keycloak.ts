import Keycloak from "keycloak-js";

// Initialize Keycloak instance
const keycloak: Keycloak = new Keycloak({
  url: "http://localhost:9080/realms/jhipster",
  realm: "jhipster",
  clientId: "web_app",
});

export default keycloak;
