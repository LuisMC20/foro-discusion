import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';
import Swal from 'sweetalert2';
import { useAuth } from '../context/authContext'; // Importa el contexto de autenticación

const ACTUALIZAR_USUARIO = gql`
  mutation actualizarUsuario($id: ID!, $input: ActualizarUsuarioInput) {
    actualizarUsuario(id: $id, input: $input) {
      id
      nombre
      apellido
      email
      celular
      pais
      ciudad
      rubro
    }
  }
`;

export default function EditarPerfil() {
  const { user } = useAuth(); // Obtén el usuario del contexto de autenticación
  const [initialValues, setInitialValues] = useState({
    nombre: '',
    apellido: '',
    celular: ''
  });

  useEffect(() => {
    if (user) {
      setInitialValues({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        celular: user.celular || ''
      });
    }
  }, [user]);

  const [actualizarUsuario] = useMutation(ACTUALIZAR_USUARIO);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      nombre: Yup.string().required('Nombre es requerido'),
      apellido: Yup.string().required('Apellido es requerido'),
      celular: Yup.string().required('Celular es requerido')
    }),
    onSubmit: async (values) => {
      Swal.fire({
        title: "¿Quieres guardar los cambios?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Guardar",
        denyButtonText: `No guardar`
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await actualizarUsuario({
              variables: {
                id: user.id, // Usa el ID del usuario del contexto de autenticación
                input: {
                  nombre: values.nombre,
                  apellido: values.apellido,
                  celular: values.celular
                }
              }
            });
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "Tu perfil ha sido actualizado",
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              window.location.reload(); // Recargar la página después de la notificación de éxito
            });
          } catch (error) {
            console.error('Error al actualizar el perfil', error);
            Swal.fire('Error', 'Error al actualizar el perfil', 'error');
          }
        } else if (result.isDenied) {
          Swal.fire("Los cambios no han sido guardados", "", "info");
        }
      });
    }
  });

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css"
          integrity="sha512-oHDEc8Xed4hiW6CxD7qjbnI+B07vDdX7hEPTvn9pSZO1bcRqHp8mj9pyr+8RVC2GmtEfI2Bi9Ke9Ass0as+zpg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/images/superfondo.jpg')" }}>
        <div className="flex w-full max-w-4xl h-4/5 bg-white bg-opacity-75 rounded-lg overflow-hidden shadow-lg relative">
          <div className="w-1/2 h-full bg-contain bg-center" style={{ backgroundImage: "url('/images/editar5.png')", minHeight: '450px' }}></div>
          <div className="w-1/2 h-full flex items-center justify-center p-8">
            <div className="w-full max-w-md bg-white bg-opacity-75 rounded shadow-md p-6">
              <h1 className="text-center text-2xl font-light mb-6">Editar Perfil</h1>
              <form className="rounded" onSubmit={formik.handleSubmit}>
                <div className="flex flex-wrap -mx-3">
                  <div className="w-full md:w-1/2 px-3 mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.nombre}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {formik.touched.nombre && formik.errors.nombre ? (
                      <div className="text-red-500 text-xs mt-2">{formik.errors.nombre}</div>
                    ) : null}
                  </div>
                  <div className="w-full md:w-1/2 px-3 mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido">
                      Apellido
                    </label>
                    <input
                      type="text"
                      id="apellido"
                      name="apellido"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.apellido}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {formik.touched.apellido && formik.errors.apellido ? (
                      <div className="text-red-500 text-xs mt-2">{formik.errors.apellido}</div>
                    ) : null}
                  </div>
                  <div className="w-full px-3 mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="celular">
                      Celular
                    </label>
                    <input
                      type="text"
                      id="celular"
                      name="celular"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.celular}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {formik.touched.celular && formik.errors.celular ? (
                      <div className="text-red-500 text-xs mt-2">{formik.errors.celular}</div>
                    ) : null}
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                >
                  Actualizar Perfil
                </button>
              </form>
            </div>
          </div>
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-gray-300"></div>
        </div>
      </div>
    </>
  );
}
