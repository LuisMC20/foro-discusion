import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { useMutation, gql } from '@apollo/client';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const EDITAR_CATEGORIA = gql`
  mutation EditarCategoria($id: ID!, $input: CategoriaUpdateInput!) {
    actualizarCategoria(id: $id, input: $input) {
      id
      nombre
      descripcion
    }
  }
`;

const validationSchema = Yup.object({
  nombre: Yup.string().required('El nombre es obligatorio'),
  descripcion: Yup.string().required('La descripción es obligatoria'),
});

const EditarCategoriaModal = ({ isOpen, onRequestClose, categoria }) => {
  const [editarCategoria] = useMutation(EDITAR_CATEGORIA);

  const handleSubmit = async (values, { setSubmitting }) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, ¡guardar cambios!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await editarCategoria({
            variables: {
              id: categoria.id,
              input: values,
            },
          });
          setSubmitting(false);
          onRequestClose();
          Swal.fire({
            title: "¡Guardado!",
            text: "La categoría ha sido actualizada.",
            icon: "success"
          });
        } catch (error) {
          console.error('Error al editar la categoría:', error.message);
          setSubmitting(false);
        }
      } else {
        setSubmitting(false);
      }
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Editar Categoría"
      className="bg-white p-6 rounded-lg shadow-lg fixed inset-x-0 top-1/4 mx-auto w-1/3"
      overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
    >
      <h2 className="text-2xl font-bold mb-4">Editar Categoría</h2>
      <Formik
        initialValues={{
          nombre: categoria.nombre,
          descripcion: categoria.descripcion,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                Nombre
              </label>
              <Field
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Nombre de la categoría"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <ErrorMessage name="nombre" component="div" className="text-red-500 text-sm" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descripcion">
                Descripción
              </label>
              <Field
                as="textarea"
                id="descripcion"
                name="descripcion"
                placeholder="Descripción de la categoría"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="4"
              />
              <ErrorMessage name="descripcion" component="div" className="text-red-500 text-sm" />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button
                onClick={onRequestClose}
                className="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Cerrar
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default EditarCategoriaModal;
