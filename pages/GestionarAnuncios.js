// pages/GestionarAnuncios.js

import { gql, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import GestionarAnuncios from '../components/GestionarAnuncios'; // Ajusta la ruta según sea necesario

const OBTENER_ANUNCIOS = gql`
  query ObtenerAnuncios {
    obtenerAnuncios {
      id
      titulo
      contenido
      imagenUrl
      fechaInicio
      fechaFinal
    }
  }
`;

const createApolloClient = () => {
  const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL + '/graphql',
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${process.env.GRAPHQL_API_KEY}`, // Si es necesario
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};

export async function getServerSideProps() {
  const client = createApolloClient();
  try {
    const { data } = await client.query({
      query: OBTENER_ANUNCIOS,
    });
    return {
      props: {
        anuncios: data.obtenerAnuncios || [],
      },
    };
  } catch (error) {
    return {
      props: {
        anuncios: [],
        error: error.message,
      },
    };
  }
}

const GestionarAnunciosPage = ({ anuncios, error }) => {
  if (error) return <p>Error al cargar anuncios: {error}</p>;

  return <GestionarAnuncios anuncios={anuncios} />;
};

export default GestionarAnunciosPage;
