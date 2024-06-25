import React from 'react';
import Modal from 'react-modal';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import ReactStars from 'react-stars';
import { useMutation, useQuery, gql } from '@apollo/client';
import { useAuth } from '../context/authContext'; // Importa el contexto de autenticación

const CREAR_PUNTUACION = gql`
  mutation CrearPuntuacion($input: CrearPuntuacionInput!) {
    crearPuntuacion(input: $input) {
      id
      puntuacion
    }
  }
`;

const OBTENER_PUNTUACIONES = gql`
  query ObtenerPuntuacionesPorPublicacion($publicacionId: ID!) {
    obtenerPuntuacionesPorPublicacion(publicacionId: $publicacionId) {
      id
      puntuacion
    }
  }
`;

const PostsModal = ({ isOpen, onRequestClose, publicacion, onComentar }) => {
  const { user } = useAuth(); // Obtén el usuario del contexto de autenticación
  const usuarioId = user?.id;

  const { data, refetch } = useQuery(OBTENER_PUNTUACIONES, {
    variables: { publicacionId: publicacion.id },
    skip: !publicacion.id, // Evitar la consulta si no hay publicacion.id
  });

  const [crearPuntuacion] = useMutation(CREAR_PUNTUACION);

  const renderContent = (rawContent) => {
    try {
      const contentState = convertFromRaw(JSON.parse(rawContent));
      const htmlContent = stateToHTML(contentState);
      return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
    } catch (error) {
      return <p>Error al procesar el contenido</p>;
    }
  };

  const ratingChanged = async (newRating) => {
    if (!usuarioId) {
      console.error('Usuario no autenticado');
      return;
    }

    try {
      console.log('Publicacion ID:', publicacion.id);
      console.log('Usuario ID:', usuarioId);
      await crearPuntuacion({
        variables: {
          input: {
            publicacionId: publicacion.id,
            puntuacion: newRating,
          },
        },
      });
      refetch();
    } catch (error) {
      console.error('Error al crear la puntuación:', error.message);
    }
  };

  const calcularPromedioPuntuacion = (puntuaciones) => {
    if (puntuaciones.length === 0) return 0;
    const total = puntuaciones.reduce((acc, puntuacion) => acc + puntuacion.puntuacion, 0);
    return total / puntuaciones.length;
  };

  const promedioPuntuacion = data ? calcularPromedioPuntuacion(data.obtenerPuntuacionesPorPublicacion) : 0;
  const numeroPuntuaciones = data ? data.obtenerPuntuacionesPorPublicacion.length : 0;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Publicación"
      className="bg-white p-6 rounded-lg shadow-lg fixed left-0 top-0 w-1/2 h-screen overflow-y-auto"
      overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
    >
      <div className="h-full flex flex-col">
        <div className="flex-shrink-0">
          <h2 className="text-2xl font-bold mb-4">{publicacion.titulo}</h2>
        </div>
        <div className="flex-grow overflow-y-auto mb-4">
          {renderContent(publicacion.contenido)}
          {publicacion.imagenUrl && (
            <div className="my-4">
              <img src={publicacion.imagenUrl} alt={publicacion.titulo} className="w-full h-auto rounded" />
            </div>
          )}
          {publicacion.pdfUrl && (
            <div className="my-4">
              <a href={publicacion.pdfUrl} className="bg-blue-500 text-white py-2 px-4 rounded" target="_blank" rel="noopener noreferrer">Descargar PDF</a>
            </div>
          )}
        </div>
        <div className="flex-shrink-0 flex justify-between items-center">
          <div className="flex items-center">
            <ReactStars
              count={5}
              value={promedioPuntuacion}
              onChange={ratingChanged}
              size={24}
              color2={'#ffd700'}
              half={false}
            />
            <span className="ml-2">Puntuar</span>
          </div>
          <div className="text-gray-600 ml-4">
            {numeroPuntuaciones} {numeroPuntuaciones === 1 ? 'persona ha puntuado' : 'personas han puntuado'}
          </div>
          <div>
            <button
              onClick={onComentar}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              Comentar
            </button>
            <button
              onClick={onRequestClose}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PostsModal;
