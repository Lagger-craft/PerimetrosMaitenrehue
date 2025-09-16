
import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Función para decodificar el token JWT de forma segura
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Comprobar si hay un token en localStorage al cargar la app
    const token = localStorage.getItem('token');
    if (token) {
      const decodedUser = parseJwt(token);
      // Aquí podrías añadir una verificación de si el token ha expirado
      setUser(decodedUser);
    }
  }, []);

  const login = async (username, password) => {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión');
    }

    localStorage.setItem('token', data.token);
    const decodedUser = parseJwt(data.token);
    setUser(decodedUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
