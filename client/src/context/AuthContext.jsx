import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // stores decoded user info

  // Check for token on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        
      } catch (err) {
        console.error("Invalid token", err);
        setUser(null);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async (email, password, role) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password, role });
      const { token } = response.data;
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      setUser(decoded);
      return decoded;
    } catch (error) {
      console.error("Login failed", error);
      throw new Error("Login failed");
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { name, email,password, role});
      const { token } = response.data;
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);
      setUser(decoded);
      return decoded;
    } catch (error) {
      console.error("Registration failed", error);
      throw new Error("Registration failed");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  
    
  

  return (
    <AuthContext.Provider value={{ user, login, register, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
