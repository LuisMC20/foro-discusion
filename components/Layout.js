import React, { useState } from "react";
import Head from "next/head";
import NavbarTop from '../components/NavbarTop';
import NavbarMain from '../components/NavbarMain';
import Banner from '../components/Banner';
import LoginModal from '../components/LoginModal';
import { useRouter } from "next/router";
import { useQuery, gql } from '@apollo/client';

const OBTENER_ANUNCIOS = gql`
  query ObtenerAnuncios {
    obtenerAnuncios {
      id
      imagenUrl
    }
  }
`;

const Layout = ({ children }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  
  const backgroundImageUrl = "/images/layoutbg3.jpg"; // Reemplaza con la ruta de tu imagen de fondo
  const { data } = useQuery(OBTENER_ANUNCIOS);

 //if (loading) return <p>Cargando anuncios de bd...</p>;
 //if (error) return <p>Error al cargar anuncios de RENDER: {error.message}</p>;

  return (
    <>
      <Head>
        <title>Foro | Científico-Empresarial</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css" integrity="sha512-oHDEc8Xed4hiW6CxD7qjbnI+B07vDdX7hEPTvn9pSZO1bcRqHp8mj9pyr+8RVC2GmtEfI2Bi9Ke9Ass0as+zpg==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
        <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet" />
      </Head>
      {router.pathname === '/registro' ? (
        <div className="bg-gray-800 min-h-screen flex flex-col justify-center">
          <div>
            {children}
          </div>
        </div>
      ) : (
        <div
          className="min-h-screen bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        >
          <NavbarTop onLoginClick={() => setModalOpen(true)} />
          <Banner />
          <NavbarMain />
          <LoginModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
          <main>
            {children}
          </main>
          <footer className="bg-gray-800 text-white p-4 mt-4">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.obtenerAnuncios.map((anuncio) => (
                  <div key={anuncio.id} className="border p-4 rounded">
                    {anuncio.imagenUrl && <img src={anuncio.imagenUrl} alt="Anuncio" className="w-full h-auto" />}
                  </div>
                ))}
              </div>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}

export default Layout;
