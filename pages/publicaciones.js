import React, { useState, useEffect } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import CrearPublicacionModal from '../components/CrearPublicacionModal';
import PostsModal from '../components/PostsModal';
import ComentariosModal from '../components/ComentariosModal';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import ReactStars from 'react-stars';
import Swal from 'sweetalert2';

const OBTENER_POSTS = gql`
  query ObtenerPosts($categoriaId: ID) {
    obtenerPosts(categoriaId: $categoriaId) {
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
      pdfUrl
      creado
      promedioPuntuacion
      numeroPuntuaciones
    }
  }
`;

const OBTENER_CATEGORIAS = gql`
  query ObtenerCategorias {
    obtenerCategorias {
      id
      nombre
    }
  }
`;

const REPORTAR_PUBLICACION = gql`
  mutation ReportarPublicacion($publicacionId: ID!, $motivo: String!) {
    reportarPublicacion(input: { publicacionId: $publicacionId, motivo: $motivo }) {
      success
      message
    }
  }
`;

const Publicaciones = () => {
  const router = useRouter();
  const { categoria: categoriaSeleccionada } = router.query;

  const [categoria, setCategoria] = useState(categoriaSeleccionada || '');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comentariosModalOpen, setComentariosModalOpen] = useState(false);

  const { data, error, refetch } = useQuery(OBTENER_POSTS, {
    variables: { categoriaId: categoria },
  });

  const { data: dataCategorias } = useQuery(OBTENER_CATEGORIAS);

  const [reportarPublicacion] = useMutation(REPORTAR_PUBLICACION);

  useEffect(() => {
    if (categoriaSeleccionada) {
      setCategoria(categoriaSeleccionada);
      refetch({ categoriaId: categoriaSeleccionada });
    }
  }, [categoriaSeleccionada, refetch]);

  const handleCategoriaChange = (event) => {
    setCategoria(event.target.value);
    refetch({ categoriaId: event.target.value });
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    setModalOpen(true);
  };

  const handleComentarClick = () => {
    setComentariosModalOpen(true);
  };

  const handleReportarClick = async (publicacionId) => {
    try {
      const { value: motivo } = await Swal.fire({
        title: 'Reportar publicación',
        input: 'textarea',
        inputLabel: 'Motivo del reporte',
        inputPlaceholder: 'Escribe el motivo del reporte...',
        showCancelButton: true,
      });

      if (motivo) {
        const { data } = await reportarPublicacion({
          variables: { publicacionId, motivo },
        });

        Swal.fire({
          title: 'Reporte enviado',
          text: data.reportarPublicacion.message,
          icon: 'success',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
      });
    }
  };

  if (error) return <p>Error: {error.message}</p>;

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
          <h1 className="text-2xl font-bold">Publicaciones</h1>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
          >
            Crear Publicación
          </button>
        </div>
        <div className="flex justify-between items-center my-4">
          <select
            value={categoria}
            onChange={handleCategoriaChange}
            className="border p-2 rounded"
          >
            <option value="">Todas las categorías</option>
            {dataCategorias?.obtenerCategorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {data?.obtenerPosts.map((publicacion) => (
            <div
              key={publicacion.id}
              className="block bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => handlePostClick(publicacion)}
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-bold">{publicacion.titulo}</h2>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReportarClick(publicacion.id);
                    }}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    <svg fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"></path>
                    </svg>
                  </button>
                </div>
                <p className="text-gray-600 mb-4">
                  {publicacion.autor?.nombre} {publicacion.autor?.apellido} - {formatDateTime(publicacion.creado)}
                </p>
                <div className="mb-4">
                  {renderContent(publicacion.contenido)}
                </div>
                {publicacion.imagenUrl && (
                  <div className="mb-4">
                    <img src={publicacion.imagenUrl} alt={publicacion.titulo} className="w-full h-auto rounded" onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                )}
                {publicacion.pdfUrl && (
                  <div className="mb-4">
                    <a href={publicacion.pdfUrl} className="text-blue-500" target="_blank" rel="noopener noreferrer">Descargar PDF</a>
                  </div>
                )}
                <p className="text-gray-600">
                  Categoría: {publicacion.categoria.nombre}
                </p>
                <div className="flex items-center mt-4">
                  <ReactStars
                    count={5}
                    value={publicacion.promedioPuntuacion || 0}
                    size={24}
                    color2={'#ffd700'}
                    half={true}
                    edit={false}
                  />
                  <span className="ml-2 text-gray-600">
                    ({publicacion.numeroPuntuaciones} {publicacion.numeroPuntuaciones === 1 ? 'puntuación' : 'puntuaciones'})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {modalOpen && selectedPost && (
          <PostsModal
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            publicacion={selectedPost}
            onComentar={handleComentarClick}
          />
        )}
        {comentariosModalOpen && selectedPost && (
          <ComentariosModal
            isOpen={comentariosModalOpen}
            onRequestClose={() => setComentariosModalOpen(false)}
            publicacion={selectedPost}
            usuarioId={1} // Reemplaza con el ID de usuario real
          />
        )}
        {modalOpen && !selectedPost && (
          <CrearPublicacionModal isOpen={modalOpen} onRequestClose={() => setModalOpen(false)} />
        )}
      </div>
    </Layout>
  );
};

export default Publicaciones;
