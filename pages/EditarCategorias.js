import Head from 'next/head';
import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import LayoutGestion from '../components/LayoutGestion';
import { OBTENER_CATEGORIAS } from '../queries';
import Swal from 'sweetalert2';
import EditarCategoriaModal from '../components/EditarCategoriaModal';

const ELIMINAR_CATEGORIA = gql`
  mutation EliminarCategoria($id: ID!) {
    eliminarCategoria(id: $id)
  }
`;

const EditarCategorias = () => {
  const { data, refetch } = useQuery(OBTENER_CATEGORIAS);
  const [eliminarCategoria] = useMutation(ELIMINAR_CATEGORIA, {
    onCompleted: () => refetch(),
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  const handleEliminar = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, ¡eliminar!',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await eliminarCategoria({ variables: { id } });
        Swal.fire('¡Eliminado!', 'La categoría ha sido eliminada.', 'success');
      } catch (error) {
        Swal.fire('¡Error!', 'No se pudo eliminar la categoría.', 'error');
      }
    }
  };

  const handleEditar = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setModalOpen(true);
  };

  return (
    <LayoutGestion>
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-center my-6">Editar Categorías</h1>
        
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {data.obtenerCategorias.map(categoria => (
              <div key={categoria.id} className="relative block bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
                <div className="flex justify-end p-2">
                  <button
                    onClick={() => handleEditar(categoria)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none mx-1"
                  >
                    <svg fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1"></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleEliminar(categoria.id)}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none mx-1"
                  >
                    <svg fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"></path>
                    </svg>
                  </button>
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{categoria.nombre}</h2>
                  <p>{categoria.descripcion}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {modalOpen && categoriaSeleccionada && (
          <EditarCategoriaModal
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            categoria={categoriaSeleccionada}
          />
        )}
      </div>
    </LayoutGestion>
  );
};

export default EditarCategorias;
