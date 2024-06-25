import Head from 'next/head';
import React from 'react';
import { useQuery } from '@apollo/client';
import Layout from '../components/Layout';
import { OBTENER_CATEGORIAS } from '../queries';
import Link from 'next/link';

const Index = () => {
  const { data } = useQuery(OBTENER_CATEGORIAS);

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-center my-6">Bienvenido al Foro de Discusiones Científico-Empresarial</h1>
        <p>Esta es la página de inicio del foro. Aquí se encontrará información relevante y destacados del foro.</p>
        
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {data.obtenerCategorias.map(categoria => (
              <Link href={`/publicaciones?categoria=${categoria.id}`} key={categoria.id} className="block bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{categoria.nombre}</h2>
                  <p>{categoria.descripcion}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;