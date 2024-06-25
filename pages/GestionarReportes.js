import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import Swal from 'sweetalert2';
import Select from 'react-select';
import LayoutGestion from '../components/LayoutGestion';
import PostsModal from '../components/PostsModal'; // Importa el componente PostsModal

const OBTENER_REPORTES = gql`
  query ObtenerReportes {
    obtenerReportes {
      id
      usuario {
        nombre
        apellido
      }
      publicacion {
        id
        titulo
        contenido
        imagenUrl
        pdfUrl
        creado
      }
      motivo
      estado
      fechaCreacion
    }
  }
`;

const ACTUALIZAR_ESTADO_REPORTE = gql`
  mutation ActualizarEstadoReporte($reporteId: ID!, $estado: String!) {
    actualizarEstadoReporte(input: { reporteId: $reporteId, estado: $estado }) {
      success
      message
    }
  }
`;

const GestionarReportes = () => {
  const { loading, error, data, refetch } = useQuery(OBTENER_REPORTES);
  const [actualizarEstadoReporte] = useMutation(ACTUALIZAR_ESTADO_REPORTE);
  const [modalOpen, setModalOpen] = useState(false);
  const [publicacionSeleccionada, setPublicacionSeleccionada] = useState(null);

  const handleActualizarEstado = async (reporteId, estado) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cambiarlo'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await actualizarEstadoReporte({
            variables: { reporteId, estado }
          });
          console.log('Respuesta de la mutación:', data); // Log de depuración
          Swal.fire(
            '¡Cambiado!',
            'El estado del reporte ha sido cambiado.',
            'success'
          );
          refetch();
        } catch (error) {
          console.error('Error al actualizar el estado del reporte:', error.message); // Log de depuración
          Swal.fire(
            'Error',
            'Hubo un problema al cambiar el estado del reporte.',
            'error'
          );
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'El estado del reporte no ha sido cambiado.',
          'error'
        );
      }
    });
  };

  const handleAbrirModal = (publicacion) => {
    setPublicacionSeleccionada(publicacion);
    setModalOpen(true);
  };

  if (loading) {
    console.log('Cargando reportes...'); // Log de depuración
    return <p>Cargando...</p>;
  }
  if (error) {
    console.error('Error al obtener los reportes:', error.message); // Log de depuración
    return <p>Error: {error.message}</p>;
  }

  console.log('Datos de los reportes obtenidos:', data); // Log de depuración

  const estadoOptions = [
    { value: 'pendiente', label: 'Pendiente', color: 'orange' },
    { value: 'revisado', label: 'Revisado', color: 'green' },
    { value: 'rechazado', label: 'Rechazado', color: 'red' }
  ];

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.data.color,
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: state.data.color,
    }),
  };

  // Ordenar los reportes: "pendiente" primero, luego "revisado" y "rechazado"
  const sortedReportes = [...data.obtenerReportes].sort((a, b) => {
    const estadoOrder = { pendiente: 1, revisado: 2, rechazado: 3 };
    return estadoOrder[a.estado] - estadoOrder[b.estado];
  });

  return (
    <LayoutGestion>
      <h1 className="text-2xl font-bold mb-4">Gestionar reportes</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Usuario</th>
            <th className="py-2 px-4 border-b">Publicación</th>
            <th className="py-2 px-4 border-b">Motivo</th>
            <th className="py-2 px-4 border-b">Fecha</th>
            <th className="py-2 px-4 border-b">Estado</th>
          </tr>
        </thead>
        <tbody>
          {sortedReportes.map(reporte => (
            <tr key={reporte.id}>
              <td className="py-2 px-4 border-b">{reporte.usuario.nombre} {reporte.usuario.apellido}</td>
              <td className="py-2 px-4 border-b cursor-pointer text-blue-500 hover:underline" onClick={() => handleAbrirModal(reporte.publicacion)}>
                {reporte.publicacion.titulo}
              </td>
              <td className="py-2 px-4 border-b">{reporte.motivo}</td>
              <td className="py-2 px-4 border-b">{new Date(reporte.fechaCreacion).toLocaleString()}</td>
              <td className="py-2 px-4 border-b">
                <Select
                  value={estadoOptions.find(option => option.value === reporte.estado)}
                  onChange={(option) => handleActualizarEstado(reporte.id, option.value)}
                  options={estadoOptions}
                  styles={customStyles}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {publicacionSeleccionada && (
        <PostsModal
          isOpen={modalOpen}
          onRequestClose={() => setModalOpen(false)}
          publicacion={publicacionSeleccionada}
          onComentar={() => console.log('Comentar funcionalidad aún no implementada')}
        />
      )}
    </LayoutGestion>
  );
};

export default GestionarReportes;
