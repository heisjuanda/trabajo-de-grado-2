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
    domain="dev-wqtg5nppjl05iie2.us.auth0.com"
    clientId="43QdsbQUll7olZpndevvA9zHeDhbw8wA"
    authorizationParams={{ redirect_uri: window.location.origin }}
    onRedirectCallback={onRedirectCallback}
    cacheLocation="localstorage"
  >
    <App />
  </Auth0Provider>
);
