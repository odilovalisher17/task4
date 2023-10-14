import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./Components/Helpers/PrivateRoute";
import { AuthProvider } from "./Components/Helpers/AuthContext";
import LoginForm from "./Components/Login/LoginForm";
import RegistrationForm from "./Components/Register/RegistrationForm";
import Dashboard from "./Components/Dashboard/Dashboard";
import Cookies from "js-cookie";
import axios from "axios";

const App = () => {
  const [currentUser, setCurrentUser] = useState({});
  const authToken = Cookies.get("authToken");

  const getUser = async () => {
    try {
      const getUser = await axios.get(
        `https://task4-beckend.onrender.com/api/v1/users/getUser/${authToken}`
      );
      setCurrentUser(getUser.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  /* eslint-disable */
  useEffect(() => {
    if (authToken) {
      getUser();
    }
  }, []);
  /* eslint-disable */

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={<LoginForm setCurrentUser={setCurrentUser} />}
          />

          <Route
            path="/reg"
            element={<RegistrationForm setCurrentUser={setCurrentUser} />}
          />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard currentUser={currentUser} />
              </PrivateRoute>
            }
          />

          <Route
            path="/users"
            element={
              <PrivateRoute>
                <Dashboard currentUser={currentUser} />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
