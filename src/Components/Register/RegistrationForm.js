// RegistrationForm.js
import React, { useState } from "react";
import "./RegistrationForm.css";
import { Form, Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const RegistrationForm = ({ setCurrentUser }) => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errMsg, setErrMsg] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (confirmPassword.trim() !== password) {
      setErrMsg("Passwords should match");
      return;
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}`;

    const newUserData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      status: "Active",
      lastLogin: formattedTime,
    };

    try {
      const newUser = await axios.post(
        "https://task4-beckend.onrender.com/api/v1/users/addUser",
        newUserData
      );

      setCurrentUser(newUser.data.User);
      navigate("/login");
    } catch (error) {
      console.log(error);
      setErrMsg("This email already registered");
    }
  };

  return (
    <div className="register">
      <div className="register-container">
        <Form
          onSubmit={(e) => {
            handleSubmit(e);
          }}>
          <div className="login-header">Registration</div>

          {errMsg && <div style={{ color: "red" }}>{errMsg}</div>}

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              required
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              required
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              required
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

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Confirm password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            variant="primary"
            type="submit"
            className="login-btn"
            onClick={(e) => {
              handleSubmit(e);
            }}>
            Submit
          </Button>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>
              Already have account? Login <NavLink to="/login">here!</NavLink>
            </Form.Label>
          </Form.Group>
        </Form>
      </div>
    </div>
  );

  // return (
  //   <div className="form-container">
  //     <h2>Registration</h2>
  //     <form onSubmit={handleSubmit}>
  //       <div className="form-group">
  //         <label>Email:</label>
  //         <input
  //           type="email"
  //           value={email}
  //           onChange={(e) => setEmail(e.target.value)}
  //           required
  //         />
  //       </div>
  //       <div className="form-group">
  //         <label>Password:</label>
  //         <input
  //           type="password"
  //           value={password}
  //           onChange={(e) => setPassword(e.target.value)}
  //           required
  //         />
  //       </div>
  //       <div className="form-group">
  //         <label>Confirm Password:</label>
  //         <input
  //           type="password"
  //           value={confirmPassword}
  //           onChange={(e) => setConfirmPassword(e.target.value)}
  //           required
  //         />
  //       </div>
  //       <button type="submit">Register</button>
  //       <div>
  //         Already have account? <NavLink to={"/login"}>Login</NavLink> here!
  //       </div>
  //     </form>
  //   </div>
  // );
};

export default RegistrationForm;
