import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import UserService from "../../services/user.service";

function RegisterForm() {
  const [validated, setValidated] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleRegister = () => {
    if (!name || !username || !password) {
      setValidated(true);
      return;
    }
    UserService.register({ name, username, password }).then((res) => {
      console.log(res);
    });
  };
  return (
    <Form noValidate validated={validated}>
      <Form.Group className="mb-3">
        <Form.Label className="fs-6 fw-bold">Tên</Form.Label>
        <Form.Control
          size="sm"
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Nguyễn Văn A"
          required
        />
        <Form.Control.Feedback type="invalid">
          Điền tên mà người khác nhìn thấy bạn
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label className="fs-6 fw-bold">Tài khoản</Form.Label>
        <Form.Control
          size="sm"
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
        <Form.Label className="fs-6 fw-bold">Mật khẩu</Form.Label>
        <Form.Control
          size="sm"
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
      <Button className="d-block w-50 mx-auto" onClick={handleRegister}>
        Đăng Ký
      </Button>
    </Form>
  );
}

export default RegisterForm;
