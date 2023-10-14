// AuthContext.js
import React, { createContext, useState, useContext } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (user) => {
    // You'd typically handle your login logic here and set isLoggedIn to true
    Cookies.set("authToken", user, { expires: 1 });
    setIsLoggedIn(true);
  };

  const logout = () => {
    // You'd handle your logout logic here and set isLoggedIn to false
    Cookies.remove("authToken");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
