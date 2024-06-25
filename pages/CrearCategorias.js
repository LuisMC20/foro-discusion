import React, { useState } from 'react';
import LayoutGestion from '../components/LayoutGestion';
import { useMutation, gql } from '@apollo/client';
import Swal from 'sweetalert2';

const CREAR_CATEGORIA = gql`
  mutation CrearCategoria($input: CategoriaInput!) {
    crearCategoria(input: $input) {
      id
      nombre
      descripcion
    }
  }
`;

const CrearCategoria = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const [crearCategoria] = useMutation(CREAR_CATEGORIA);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await crearCategoria({
        variables: {
          input: { nombre, descripcion }
        }
      });
      console.log('Categoría creada:', data.crearCategoria);  // Debug
      Swal.fire({
        title: '¡Categoría Creada!',
        text: `La categoría ${data.crearCategoria.nombre} se ha creado con éxito.`,
        icon: 'success'
      });
      setNombre('');
      setDescripcion('');
    } catch (error) {
      console.error('Error al crear la categoría:', error);  // Debug
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Algo salió mal al crear la categoría!',
        footer: '<a href="#">¿Por qué tengo este problema?</a>'
      });
    }
  };

  return (
    <LayoutGestion>
      <h1 className="text-2xl font-bold mb-4">Crear Nueva Categoría</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre">
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            placeholder="Nombre de la categoría"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descripcion">
            Descripción
          </label>
          <textarea
            id="descripcion"
            placeholder="Descripción de la categoría"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Crear Categoría
        </button>
      </form>
    </LayoutGestion>
  );
};

export default CrearCategoria;
