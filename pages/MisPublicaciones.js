import React, { useState, useEffect } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import Layout from '../components/Layout';
import { useRouter } from 'next/router';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import Swal from 'sweetalert2';
import EditarPublicacionModal from '../components/EditarPublicacionModal';

const OBTENER_MIS_PUBLICACIONES = gql`
  query ObtenerMisPublicaciones {
    obtenerMisPosts {
      id
      titulo
      contenido
      autor {
        nombre
        apellido
      }
      categoria {
        nombre
      }
      imagenUrl
      creado
    }
  }
`;

const ELIMINAR_PUBLICACION = gql`
  mutation EliminarPublicacion($id: ID!) {
    eliminarPost(id: $id)
  }
`;

const MisPublicaciones = () => {
  const { data, error } = useQuery(OBTENER_MIS_PUBLICACIONES);
  const [eliminarPublicacion] = useMutation(ELIMINAR_PUBLICACION, {
    refetchQueries: [{ query: OBTENER_MIS_PUBLICACIONES }],
  });
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [publicacionSeleccionada, setPublicacionSeleccionada] = useState(null);

  useEffect(() => {
    if (error) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'Cerrar',
      });
    }
  }, [error]);

  const handleEliminar = async (id) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, ¡eliminar!',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await eliminarPublicacion({ variables: { id } });
          swalWithBootstrapButtons.fire(
            '¡Eliminado!',
            'Tu publicación ha sido eliminada.',
            'success'
          );
        } catch (error) {
          console.error('Error al eliminar la publicación:', error.message);
          swalWithBootstrapButtons.fire(
            '¡Error!',
            'No se pudo eliminar la publicación.',
            'error'
          );
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Tu publicación está segura :)',
          'error'
        );
      }
    });
  };

  const handleEditar = (publicacion) => {
    setPublicacionSeleccionada(publicacion);
    setModalOpen(true);
  };

  const renderContent = (rawContent) => {
    try {
      const contentState = convertFromRaw(JSON.parse(rawContent));
      const htmlContent = stateToHTML(contentState);
      return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
    } catch (error) {
      return <p>Error al procesar el contenido</p>;
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    return date.toLocaleString();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center my-6">
          <h1 className="text-2xl font-bold">Mis Publicaciones</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.obtenerMisPosts.map((publicacion) => (
            <div key={publicacion.id} className="relative bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{publicacion.titulo}</h2>
                    <p className="text-gray-600">
                      {publicacion.autor?.nombre} {publicacion.autor?.apellido} - {formatDateTime(publicacion.creado)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditar(publicacion)}
                      className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <svg fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"></path>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleEliminar(publicacion.id)}
                      className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <svg fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  {renderContent(publicacion.contenido)}
                </div>
                {publicacion.imagenUrl && (
                  <div className="mb-4">
                    <img src={publicacion.imagenUrl} alt={publicacion.titulo} className="w-full h-auto rounded" onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                )}
                <div className="text-gray-600">
                  Categoría: {publicacion.categoria.nombre}
                </div>
              </div>
            </div>
          ))}
        </div>
        {modalOpen && publicacionSeleccionada && (
          <EditarPublicacionModal
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            publicacion={publicacionSeleccionada}
          />
        )}
      </div>
    </Layout>
  );
};

export default MisPublicaciones;
