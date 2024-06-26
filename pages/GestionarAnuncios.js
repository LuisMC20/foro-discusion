import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import LayoutGestion from '../components/LayoutGestion';
import ImageUpload from '../components/ImageUpload';

const OBTENER_ANUNCIOS = gql`
  query ObtenerAnuncios {
    obtenerAnuncios {
      id
      titulo
      contenido
      imagenUrl
      fechaInicio
      fechaFinal
    }
  }
`;

const CREAR_ANUNCIO = gql`
  mutation CrearAnuncio($input: AnuncioInput!) {
    crearAnuncio(input: $input) {
      id
      titulo
      contenido
      imagenUrl
      fechaInicio
      fechaFinal
    }
  }
`;

const ELIMINAR_ANUNCIO = gql`
  mutation EliminarAnuncio($id: ID!) {
    eliminarAnuncio(id: $id)
  }
`;

const validationSchema = Yup.object({
  titulo: Yup.string().required('El título es obligatorio'),
  contenido: Yup.string().required('El contenido es obligatorio'),
  fechaInicio: Yup.date().required('La fecha de inicio es obligatoria'),
  fechaFinal: Yup.date().required('La fecha final es obligatoria')
});

const GestionarAnuncios = () => {
  const { data, refetch } = useQuery(OBTENER_ANUNCIOS);
  const [crearAnuncio] = useMutation(CREAR_ANUNCIO);
  const [eliminarAnuncio] = useMutation(ELIMINAR_ANUNCIO);
  const [imagenUrl, setImagenUrl] = useState('');

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      await crearAnuncio({
        variables: {
          input: {
            ...values,
            imagenUrl,
            fechaInicio: new Date(values.fechaInicio).toISOString(),
            fechaFinal: new Date(values.fechaFinal).toISOString()
          }
        }
      });
      Swal.fire('¡Anuncio creado!', 'El anuncio se ha creado correctamente.', 'success');
      refetch();
      resetForm();
      setImagenUrl('');
    } catch (error) {
      Swal.fire('Error', 'Hubo un problema al crear el anuncio.', 'error');
      setSubmitting(false);
    }
  };

  const handleEliminarAnuncio = async (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await eliminarAnuncio({ variables: { id } });
          Swal.fire('¡Eliminado!', 'El anuncio ha sido eliminado.', 'success');
          refetch();
        } catch (error) {
          Swal.fire('Error', 'Hubo un problema al eliminar el anuncio.', 'error');
        }
      }
    });
  };

  // if (loading) return <p>Cargando...</p>;
  // if (error) return <p>Error: {error.message}</p>;

  return (
    <LayoutGestion>
      <h1 className="text-2xl font-bold mb-4">Gestionar Anuncios</h1>
      <Formik
        initialValues={{
          titulo: '',
          contenido: '',
          fechaInicio: '',
          fechaFinal: ''
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="mb-4">
            <div className="mb-4">
              <label htmlFor="titulo" className="block text-gray-700">Título</label>
              <Field name="titulo" type="text" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
              <ErrorMessage name="titulo" component="div" className="text-red-500" />
            </div>
            <div className="mb-4">
              <label htmlFor="contenido" className="block text-gray-700">Contenido</label>
              <Field name="contenido" as="textarea" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
              <ErrorMessage name="contenido" component="div" className="text-red-500" />
            </div>
            <div className="mb-4">
              <label htmlFor="fechaInicio" className="block text-gray-700">Fecha de Inicio</label>
              <Field name="fechaInicio" type="date" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
              <ErrorMessage name="fechaInicio" component="div" className="text-red-500" />
            </div>
            <div className="mb-4">
              <label htmlFor="fechaFinal" className="block text-gray-700">Fecha Final</label>
              <Field name="fechaFinal" type="date" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
              <ErrorMessage name="fechaFinal" component="div" className="text-red-500" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Imagen</label>
              <ImageUpload onFileUpload={setImagenUrl} fileType="image" />
              {imagenUrl && <p className="text-green-500">Imagen subida: {imagenUrl}</p>}
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creando...' : 'Crear Anuncio'}
            </button>
          </Form>
        )}
      </Formik>
      <h2 className="text-xl font-bold mb-4">Anuncios Actuales</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.obtenerAnuncios.map((anuncio) => (
          <div key={anuncio.id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-bold">{anuncio.titulo}</h3>
            <p>{anuncio.contenido}</p>
            {anuncio.imagenUrl && <img src={anuncio.imagenUrl} alt={anuncio.titulo} className="mt-2 rounded" />}
            <p className="text-gray-600 mt-2">Desde: {new Date(anuncio.fechaInicio).toLocaleDateString()}</p>
            <p className="text-gray-600">Hasta: {new Date(anuncio.fechaFinal).toLocaleDateString()}</p>
            <button
              onClick={() => handleEliminarAnuncio(anuncio.id)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </LayoutGestion>
  );
};

export default GestionarAnuncios;
