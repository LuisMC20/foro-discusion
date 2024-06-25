import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link.context';
import { OBTENER_USUARIO } from '../queries';

const AuthContext = createContext();

const createApolloClient = (token) => {
  const httpLink = createHttpLink({
    uri: `${process.env.NEXT_PUBLIC_API_URL}/graphql`, // Usar la variable de entorno aquí y añadir /graphql
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
    console.log('Token from 
