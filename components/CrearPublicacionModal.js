import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { useMutation, gql, useQuery } from '@apollo/client';
import Modal from 'react-modal';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { OBTENER_PUBLICACIONES, OBTENER_CATEGORIAS } from '../queries';
import ImageUpload from '../components/imageUpload';
import Swal from 'sweetalert2';

const CREAR_PUBLICACION = gql`
  mutation CrearPublicacion($input: PostInput!) {
    crearPost(input: $input) {
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
    }
  }
`;

const validationSchema = Yup.object({
  titulo: Yup.string().required('El título es obligatorio'),
  categoria: Yup.string().required('La categoría es obligatoria'),
  imagenUrl: Yup.string().url('URL no válida'),
  pdfUrl: Yup.string().url('URL no válida'),
});

const CrearPublicacionModal = ({ isOpen, onRequestClose }) => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [imagenUrl, setImagenUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const { data: categoriasData } = useQuery(OBTENER_CATEGORIAS);

  const [crearPublicacion] = useMutation(CREAR_PUBLICACION, {
    refetchQueries: [{ query: OBTENER_PUBLICACIONES }],
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const contentState = editorState.getCurrentContent();
      const rawContent = JSON.stringify(convertToRaw(contentState));

      await crearPublicacion({
        variables: {
          input: {
            titulo: values.titulo,
            contenido: rawContent,
            categoriaId: values.categoria,
            imagenUrl,
            pdfUrl,
          },
        },
      });
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Tu publicación ha sido creada",
        showConfirmButton: false,
        timer: 1500
      }).then(() => {
        onRequestClose();
        setEditorState(() => EditorState.createEmpty());
        setImagenUrl('');
        setPdfUrl('');
        window.location.reload();
      });
    } catch (error) {
      console.error('Error al crear la publicación:', error);
      setSubmitting(false);
    }
  };

  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  const onBoldClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  };

  const onItalicClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
  };

  const onUnderlineClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'));
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 ${!isOpen ? 'hidden' : ''}`}>
      <div className="fixed inset-0 bg-black opacity-50" onClick={onRequestClose}></div>
      <div className="bg-white rounded-lg p-6 z-50 max-w-2xl mx-auto w-full">
        <h2 className="text-2xl font-bold mb-4">Crear Nueva Publicación</h2>
        <Formik
          initialValues={{
            titulo: '',
            categoria: '',
            imagenUrl: '',
            pdfUrl: '',
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
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoria">
                  Categoría
                </label>
                <Field
                  as="select"
                  id="categoria"
                  name="categoria"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="" disabled>Seleccione una categoría</option>
                  {categoriasData?.obtenerCategorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="categoria" component="div" className="text-red-500 text-sm" />
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
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Contenido</label>
                <button type="button" onClick={onBoldClick} className="mr-2 px-3 py-1 bg-gray-300 rounded">Bold</button>
                <button type="button" onClick={onItalicClick} className="mr-2 px-3 py-1 bg-gray-300 rounded">Italic</button>
                <button type="button" onClick={onUnderlineClick} className="px-3 py-1 bg-gray-300 rounded">Underline</button>
                <div className="border rounded p-2 mt-2 resize-y overflow-auto" style={{ minHeight: '200px' }}>
                  <Editor
                    editorState={editorState}
                    handleKeyCommand={handleKeyCommand}
                    onChange={setEditorState}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creando...' : 'Crear Publicación'}
              </button>
            </Form>
          )}
        </Formik>
        <button onClick={onRequestClose} className="mt-4 bg-red-500 text-white p-2 rounded">Cerrar</button>
      </div>
    </div>
  );
};

export default CrearPublicacionModal;
