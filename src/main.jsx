import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./AuthContext";
import AuthUI from "./AuthUI";
import "./index.css";

const Root = () => (
  <React.StrictMode>
    <AuthProvider>
      <AuthUI>
        <App />
      </AuthUI>
    </AuthProvider>
  </React.StrictMode>
);

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);