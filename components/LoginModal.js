import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { useAuth } from '../context/authContext';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const AUTENTICAR_USUARIO = gql`
  mutation autenticarUsuario($input: AutenticarInput) {
    autenticarUsuario(input: $input) {
      token
    }
  }
`;

const OBTENER_USUARIO = gql`
  query obtenerUsuario {
    obtenerUsuario {
      id
      nombre
      apellido
      rol
    }
  }
`;

const createApolloClient = (token) => {
  const httpLink = createHttpLink({
    uri: `${process.env.NEXT_PUBLIC_API_URL}/graphql`, // Usar la variable de entorno aquí
  });

  const authLink = setContext((_, { headers }) => {
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

export default function LoginModal({ isOpen, onClose }) {
  const router = useRouter();
  const { login } = useAuth();
  const [mensaje, guardarMensaje] = useState(null);
  const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string().email('El email no es valido').required('El email no puede ir vacio'),
      password: Yup.string().required('Contraseña obligatoria')
    }),
    onSubmit: async valores => {
      const { email, password } = valores;
      try {
        const { data } = await autenticarUsuario({
          variables: {
            input: { email, password }
          }
        });
        guardarMensaje('Autenticando...');
        const { token } = data.autenticarUsuario;

        const client = createApolloClient(token);

        const { data: userData } = await client.query({ query: OBTENER_USUARIO });

        login(token, userData.obtenerUsuario);

        setTimeout(() => {
          guardarMensaje(null);
          onClose();
          router.reload();
        }, 1500);
      } catch (error) {
        guardarMensaje(error.message.replace('GraphQL error: ', ''));
        setTimeout(() => {
          guardarMensaje(null);
        }, 3000);
      }
    }
  });

  if (!isOpen) return null;

  const mostrarMensaje = () => {
    let estiloMensaje = "bg-red-100 border border-red-400 text-red-700";
    if (mensaje === "Autenticando...") {
      estiloMensaje = "bg-blue-100 border border-blue-400 text-blue-700";
    }

    return (
      <div className={`${estiloMensaje} py-2 px-3 w-full my-3 max-w-sm text-center mx-auto rounded-lg`}>
        <p>{mensaje}</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg relative w-full max-w-sm">
        <button onClick={onClose} className="absolute top-0 right-0 p-2">✖</button>
        <h2 className="text-lg font-bold mb-2">Iniciar Sesión</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-2">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Correo electrónico"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-sm text-red-500">{formik.errors.email}</div>
            )}
          </div>
          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Contraseña"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-sm text-red-500">{formik.errors.password}</div>
            )}
          </div>
          <div>
            <button type="submit" className="w-full flex justify-center py-1 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Ingresar
            </button>
          </div>
          {mensaje && mostrarMensaje()}
        </form>
      </div>
    </div>
  );
}
