import React, { useState, useEffect } from 'react';
import LayoutGestion from '../components/LayoutGestion';
import { useQuery, useMutation, gql } from '@apollo/client';
import Swal from 'sweetalert2';

const OBTENER_USUARIOS = gql`
  query ObtenerUsuarios {
    obtenerUsuarios {
      id
      nombre
      apellido
      rol
    }
  }
`;

const ACTUALIZAR_USUARIO = gql`
  mutation ActualizarRolUsuario($actualizarRolUsuarioId: ID!, $nuevoRol: String!) {
    actualizarRolUsuario(id: $actualizarRolUsuarioId, nuevoRol: $nuevoRol) {
      id
      rol
    }
  }
`;

const GestionarRoles = () => {
  const { data } = useQuery(OBTENER_USUARIOS);
  const [actualizarRolUsuario] = useMutation(ACTUALIZAR_USUARIO);
  const [busqueda, setBusqueda] = useState('');
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [usuariosModificados, setUsuariosModificados] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (data && data.obtenerUsuarios) {
      setUsuariosFiltrados(data.obtenerUsuarios);
    }
  }, [data]);

  const handleBusqueda = (event) => {
    setBusqueda(event.target.value);
    filtrarUsuarios(event.target.value);
  };

  const filtrarUsuarios = (termino) => {
    if (data && data.obtenerUsuarios) {
      const usuariosFiltrados = data.obtenerUsuarios.filter((usuario) =>
        `${usuario.nombre} ${usuario.apellido}`.toLowerCase().includes(termino.toLowerCase())
      );
      setUsuariosFiltrados(usuariosFiltrados);
    }
  };

  const handleCambioRol = (id, nuevoRol) => {
    setUsuariosModificados({
      ...usuariosModificados,
      [id]: nuevoRol
    });
  };

  const handleGuardarCambios = async () => {
    const result = await Swal.fire({
      title: "¿Quieres guardar los cambios?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      denyButtonText: `No guardar`
    });

    if (result.isConfirmed) {
      try {
        const promesas = Object.entries(usuariosModificados).map(([id, nuevoRol]) =>
          actualizarRolUsuario({ variables: { actualizarRolUsuarioId: id, nuevoRol } })
        );
        await Promise.all(promesas);
        setUsuariosModificados({});
        setError('');
        Swal.fire("¡Guardado!", "", "success");
      } catch (err) {
        if (err.message.includes('No puedes cambiar tu propio rol')) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No puedes cambiar tu propio rol.",
            footer: '<a href="#">Why do I have this issue?</a>'
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Ocurrió un error al guardar los cambios.",
            footer: '<a href="#">Why do I have this issue?</a>'
          });
        }
      }
    } else if (result.isDenied) {
      Swal.fire("Los cambios no se guardaron", "", "info");
    }
  };

  return (
    <LayoutGestion>
      <h1 className="text-2xl font-bold mb-4">Gestionar Roles</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre"
          className="border border-gray-400 p-2 w-full"
          value={busqueda}
          onChange={handleBusqueda}
        />
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Nombre</th>
            <th className="py-2">Apellido</th>
            <th className="py-2">Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map((usuario) => (
            <tr key={usuario.id}>
              <td className="border px-4 py-2">{usuario.nombre}</td>
              <td className="border px-4 py-2">{usuario.apellido}</td>
              <td className="border px-4 py-2">
                <select
                  value={usuariosModificados[usuario.id] || usuario.rol}
                  onChange={(e) => handleCambioRol(usuario.id, e.target.value)}
                  className="border border-gray-400 p-2"
                >
                  <option value="administrador">Administrador</option>
                  <option value="moderador">Moderador</option>
                  <option value="miembro">Miembro</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {Object.keys(usuariosModificados).length > 0 && (
        <button
          onClick={handleGuardarCambios}
          className="mt-4 bg-blue-500 text-white p-2 rounded"
        >
          Guardar Cambios
        </button>
      )}
    </LayoutGestion>
  );
};

export default GestionarRoles;
