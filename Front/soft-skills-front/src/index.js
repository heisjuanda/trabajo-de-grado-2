import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById("root"));

const onRedirectCallback = (appState) => {
  window.location.href = "/";
};

root.render(
  <Auth0Provider
    domain="dev-55phdb8coth15677.us.auth0.com"
    clientId="bto2ydLzgWbCGhWWF0pnnej6364BcnKB"
    authorizationParams={{ redirect_uri: window.location.origin }}
    onRedirectCallback={onRedirectCallback}
    cacheLocation="localstorage"
  >
    <App />
  </Auth0Provider>
);
