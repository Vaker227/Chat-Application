import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

import UserService from "../../services/user.service";

function LoginForm() {
  const [validated, setValidated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleInfo = () => {
    UserService.getInfo().then((res) => {
      console.log(res);
    });
  };
  const handleLogin = (e) => {
    if (!username || !password) {
      setValidated(true);
      return;
    }
    UserService.login({ username, password })
      .then((res) => {
        window.electron.login();
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  return (
    <Form noValidate validated={validated}>
      <Form.Group className="mb-3">
        <Form.Label className="fs-4 fw-bold">Tài khoản</Form.Label>
        <Form.Control
          type="text"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Username"
          required
        />
        <Form.Control.Feedback type="invalid">
          Điền tên tài khoản đăng nhập
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label className="fs-4 fw-bold">Mật khẩu</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="********"
          required
        />
        <Form.Control.Feedback type="invalid">
          Điền mật khẩu
        </Form.Control.Feedback>
      </Form.Group>
      <Button className="d-block w-50 mx-auto" onClick={handleLogin}>
        Đăng nhập
      </Button>
      {/* <Button className="d-block w-50 mx-auto" onClick={handleInfo}>
        InFo
      </Button> */}
    </Form>
  );
}

export default LoginForm;
