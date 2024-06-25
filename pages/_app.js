import { ApolloProvider } from '@apollo/client';
import client from '../config/apollo';
import { AuthProvider } from '../context/authContext';
import Modal from 'react-modal';
Modal.setAppElement('#__next');

const MyApp = ({ Component, pageProps }) => {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ApolloProvider>
  );
};

export default MyApp;
