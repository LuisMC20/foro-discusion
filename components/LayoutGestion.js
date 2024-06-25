import React, { useState } from "react";
import Head from "next/head";
import Sidebar from '../components/Sidebar';
import LoginModal from '../components/LoginModal';

const LayoutGestion = ({ children }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  
  const backgroundImageUrl = "/images/layoutbg3.jpg"; // Reemplaza con la ruta de tu imagen de fondo

  return (
    <>
      <Head>
        <title>Foro | Gestión Científico-Empresarial</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css" integrity="sha512-oHDEc8Xed4hiW6CxD7qjbnI+B07vDdX7hEPTvn9pSZO1bcRqHp8mj9pyr+8RVC2GmtEfI2Bi9Ke9Ass0as+zpg==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
        <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet" />
      </Head>
      <div
        className="flex min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      >
        <Sidebar />
        <div className="flex-1 p-10 bg-gray-100 bg-opacity-75">
          <main>
            {children}
          </main>
        </div>
      </div>
      <LoginModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}

export default LayoutGestion;
