import React, { useState } from 'react';
import Modal from 'react-modal';
import { useMutation, gql, useQuery } from '@apollo/client';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const OBTENER_COMENTARIOS = gql`
  query ObtenerComentarios($postId: ID!) {
    obtenerComentarioPorPost(postId: $postId) {
      id
      contenido
      autor {
        nombre
        apellido
      }
      creado
    }
  }
`;

const CREAR_COMENTARIO = gql`
  mutation CrearComentario($input: ComentarioInput!) {
    crearComentario(input: $input) {
      id
      contenido
      autor {
        nombre
        apellido
      }
      creado
    }
  }
`;

const ELIMINAR_COMENTARIO = gql`
  mutation EliminarComentario($id: ID!) {
    eliminarComentario(id: $id)
  }
`;

const validationSchema = Yup.object({
  contenido: Yup.string().required('El contenido es obligatorio'),
});

const ComentariosModal = ({ isOpen, onRequestClose, publicacion, usuarioId }) => {
  const { data } = useQuery(OBTENER_COMENTARIOS, {
    variables: { postId: publicacion.id },
  });

  const [crearComentario] = useMutation(CREAR_COMENTARIO, {
    refetchQueries: [
      {
        query: OBTENER_COMENTARIOS,
        variables: { postId: publicacion.id },
      },
    ],
  });

  const [eliminarComentario] = useMutation(ELIMINAR_COMENTARIO, {
    refetchQueries: [
      {
        query: OBTENER_COMENTARIOS,
        variables: { postId: publicacion.id },
      },
    ],
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await crearComentario({
        variables: {
          input: {
            contenido: values.contenido,
            postId: publicacion.id,
            autorId: usuarioId,
          },
        },
      });
      setSubmitting(false);
      resetForm();
    } catch (error) {
      console.error('Error al crear el comentario:', error.message);
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await eliminarComentario({ variables: { id } });
    } catch (error) {
      console.error('Error al eliminar el comentario:', error.message);
    }
  };

  const backgroundImageUrl = "/images/"; // Reemplaza con la ruta de tu imagen de fondo

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Comentarios"
      className="bg-cover bg-center p-6 rounded-lg shadow-lg fixed right-0 top-0 w-1/2 h-screen overflow-y-auto"
      style={{ content: { backgroundImage: `url(${backgroundImageUrl})` } }}
      overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
    >
      <h2 className="text-2xl font-bold mb-4 text-white">Comentarios</h2>
      <div className="mb-4 overflow-y-auto text-white">
        {data?.obtenerComentarioPorPost.map((comentario) => (
          <div key={comentario.id} className="mb-4 border-b pb-4 border-white">
            <p className="text-white">{comentario.contenido}</p>
            <p className="text-gray-300 text-sm">
              {comentario.autor.nombre} {comentario.autor.apellido} - {new Date(comentario.creado).toLocaleString()}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => handleDelete(comentario.id)}
                className="text-gray-300 hover:text-gray-500"
              >
                <svg data-slot="icon" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"></path>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <Formik
        initialValues={{ contenido: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2" htmlFor="contenido">
                Nuevo Comentario
              </label>
              <Field
                as="textarea"
                id="contenido"
                name="contenido"
                placeholder="Escribe tu comentario aquí..."
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage name="contenido" component="div" className="text-red-500 text-sm" />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={onRequestClose}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : 'Comentar'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default ComentariosModal;
