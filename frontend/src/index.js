import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import { Route, BrowserRouter as Router } from "react-router-dom";
import store from "./store";
import { Provider } from "react-redux";

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Auth0Provider
        domain="notes-api.us.auth0.com"
        clientId="qDgw2x000c5IdrYKVtyPPHfo4nZPjvb8"
        redirectUri={window.location.origin}
        audience="https://notes-api"
      >
        <Route path={["/notes", "/"]} component={App} />
      </Auth0Provider>
    </Router>
  </Provider>,
  document.getElementById("root")
);
