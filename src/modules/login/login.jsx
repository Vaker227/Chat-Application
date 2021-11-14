import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../css/all.min.css";

import "./style/login.css";
import LoginForm from "./components/loginForm/login-form.jsx";
import RegisterForm from "./components/registerForm/register-form.jsx";
import axios from "axios";

axios.defaults.withCredentials = true;

function App() {
  const [registing, setRegisting] = useState(false);
  const handleRegister = () => {
    setRegisting(true);
  };
  const handleLogin = () => {
    setRegisting(false);
  };
  return (
    <div className="mt-5 mx-3">
      {registing ? (
        <>
          <RegisterForm />
          <p className="mt-5 mx-auto">
            Đã có tài khoản?{" "}
            <Button variant="outline-success" size="sm" onClick={handleLogin}>
              Đăng nhập
            </Button>{" "}
          </p>
        </>
      ) : (
        <>
          <LoginForm />
          <p className="mt-5 mx-auto">
            Chưa có tài khoản?{" "}
            <Button variant="outline-dark" size="sm" onClick={handleRegister}>
              Đăng ký ngay
            </Button>{" "}
          </p>
        </>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
