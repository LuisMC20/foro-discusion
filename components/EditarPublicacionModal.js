import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useMutation, gql } from '@apollo/client';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Editor, EditorState, RichUtils, convertFromRaw, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import ImageUpload from '../components/imageUpload';

const EDITAR_PUBLICACION = gql`
  mutation EditarPublicacion($id: ID!, $input: PostUpdateInput!) {
    actualizarPost(id: $id, input: $input) {
      id
      titulo
      contenido
      imagenUrl
      pdfUrl
    }
  }
`;

const validationSchema = Yup.object({
  titulo: Yup.string().required('El título es obligatorio'),
  imagenUrl: Yup.string().url('URL no válida'),
  pdfUrl: Yup.string().url('URL no válida'),
});

const EditarPublicacionModal = ({ isOpen, onRequestClose, publicacion }) => {
  const [editarPublicacion] = useMutation(EDITAR_PUBLICACION);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [imagenUrl, setImagenUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  useEffect(() => {
    if (publicacion) {
      const contentState = convertFromRaw(JSON.parse(publicacion.contenido));
      setEditorState(EditorState.createWithContent(contentState));
      setImagenUrl(publicacion.imagenUrl);
      setPdfUrl(publicacion.pdfUrl);
    }
  }, [publicacion]);

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const toggleInlineStyle = (style) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const contentState = editorState.getCurrentContent();
      const rawContent = JSON.stringify(convertToRaw(contentState));

      await editarPublicacion({
        variables: {
          id: publicacion.id,
          input: {
            ...values,
            contenido: rawContent,
            imagenUrl,
            pdfUrl,
          },
        },
      });
      setSubmitting(false);
      onRequestClose();
    } catch (error) {
      console.error('Error al editar la publicación:', error.message);
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Editar Publicación">
      <h2 className="text-2xl font-bold mb-4">Editar Publicación</h2>
      <Formik
        initialValues={{
          titulo: publicacion.titulo,
          imagenUrl: publicacion.imagenUrl || '',
          pdfUrl: publicacion.pdfUrl || '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="titulo">
                Título
              </label>
              <Field
                type="text"
                id="titulo"
                name="titulo"
                placeholder="Título de la publicación"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage name="titulo" component="div" className="text-red-500 text-sm" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="contenido">
                Contenido
              </label>
              <div className="mb-2">
                <button
                  type="button"
                  className="mr-2 px-3 py-1 bg-gray-300 rounded"
                  onClick={() => toggleInlineStyle('BOLD')}
                >
                  Bold
                </button>
                <button
                  type="button"
                  className="mr-2 px-3 py-1 bg-gray-300 rounded"
                  onClick={() => toggleInlineStyle('ITALIC')}
                >
                  Italic
                </button>
                <button
                  type="button"
                  className="px-3 py-1 bg-gray-300 rounded"
                  onClick={() => toggleInlineStyle('UNDERLINE')}
                >
                  Underline
                </button>
              </div>
              <div
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                style={{ minHeight: '200px' }}
              >
                <Editor editorState={editorState} handleKeyCommand={handleKeyCommand} onChange={setEditorState} />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Imagen</label>
              <ImageUpload onFileUpload={setImagenUrl} fileType="image" />
              {imagenUrl && <p>Imagen subida: {imagenUrl}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">PDF</label>
              <ImageUpload onFileUpload={setPdfUrl} fileType="pdf" />
              {pdfUrl && <p>PDF subido: {pdfUrl}</p>}
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </Form>
        )}
      </Formik>
      <button onClick={onRequestClose} className="mt-4 bg-red-500 text-white p-2 rounded">
        Cerrar
      </button>
    </Modal>
  );
};

export default EditarPublicacionModal;
