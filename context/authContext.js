import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { OBTENER_USUARIO } from '../queries';

const AuthContext = createContext();

const createApolloClient = (token) => {
  const httpLink = createHttpLink({
    uri: `https://foro-discusiones-backend.onrender.com/graphql`, // Usar la variable de entorno aquí y añadir /graphql
    credentials: 'include', // Asegúrate de incluir credenciales para las cookies y encabezados de autenticación
  });

  const authLink = setContext((_, { headers }) => {
    console.log('Token for Apollo Client:', token);
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    console.log('Token from localStorage in useEffect:', token);

    if (token) {
      const client = createApolloClient(token);
      client
        .query({ query: OBTENER_USUARIO })
        .then(({ data }) => {
          console.log('Usuario obtenido:', data.obtenerUsuario);
          setUser(data.obtenerUsuario);
          setIsAuthenticated(true);
        })
        .catch((error) => {
          console.error('Error al obtener el usuario:', error);
          setIsAuthenticated(false);
          setUser(null);
        });
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    console.log('Token set in localStorage:', token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    console.log('Token removed from localStorage');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
