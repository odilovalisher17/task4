// LoginForm.js
import React, { useState } from "react";
import "./LoginForm.css";
import { Form, Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../Helpers/AuthContext";
import axios from "axios";

const LoginForm = ({ setCurrentUser }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    try {
      const getUser = await axios.get(
        `https://task4-beckend.onrender.com/api/v1/users/getUser/${email}`
      );
      setCurrentUser(getUser.data.user);
      if (getUser.data.user.password === password) {
        if (getUser.data.user.status.toLowerCase() === "active") {
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
          const day = String(now.getDate()).padStart(2, "0");
          const hours = String(now.getHours()).padStart(2, "0");
          const minutes = String(now.getMinutes()).padStart(2, "0");
          const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}`;

          try {
            await axios.put(
              `https://task4-beckend.onrender.com/api/v1/users/updateUser/${getUser.data.user._id}`,
              {
                lastLogin: formattedTime,
              }
            );
          } catch (error) {
            console.log(error);
          }

          login(getUser.data.user.email);
          navigate("/");
        } else {
          setErrorMessage("Your account blocked!");
        }
      } else {
        setErrorMessage("Wrong password");
      }
    } catch (error) {
      setErrorMessage(error.response.data.message);
      console.log(error);
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}>
          <div className="login-header">Login</div>

          {errorMessage && (
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label style={{ color: "red" }}>{errorMessage}</Form.Label>
            </Form.Group>
          )}

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="login-btn"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit();
            }}>
            Submit
          </Button>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>
              Don't have account? Register <NavLink to="/reg">here!</NavLink>
            </Form.Label>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
