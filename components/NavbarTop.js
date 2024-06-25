import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/authContext';
import NotificacionesModal from './NotificacionesModal';
import { useQuery, gql, useMutation } from '@apollo/client';

const OBTENER_NOTIFICACIONES = gql`
  query ObtenerNotificaciones {
    obtenerNotificaciones {
      id
      mensaje
      leido
    }
  }
`;

const MARCAR_NOTIFICACION_COMO_LEIDA = gql`
  mutation MarcarNotificacionComoLeida($id: ID!) {
    marcarNotificacionComoLeida(id: $id) {
      id
      leido
    }
  }
`;

const ELIMINAR_NOTIFICACION = gql`
  mutation EliminarNotificacion($id: ID!) {
    eliminarNotificacion(id: $id)
  }
`;

const NavbarTop = ({ onLoginClick }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const [notificacionesModalOpen, setNotificacionesModalOpen] = useState(false);
  const { data, refetch } = useQuery(OBTENER_NOTIFICACIONES);
  const [marcarNotificacionComoLeida] = useMutation(MARCAR_NOTIFICACION_COMO_LEIDA);
  const [eliminarNotificacion] = useMutation(ELIMINAR_NOTIFICACION);

  const notificaciones = data?.obtenerNotificaciones || [];
  const notificacionesNoLeidas = notificaciones.filter(n => !n.leido).length;

  const handleMarcarComoLeida = async (id) => {
    await marcarNotificacionComoLeida({ variables: { id } });
    refetch();
  };

  const handleEliminarNotificacion = async (id) => {
    await eliminarNotificacion({ variables: { id } });
    refetch();
  };

  return (
    <nav className="bg-gray-900 text-white p-2 relative">
      <div className="container mx-auto flex justify-end space-x-4">
        {isAuthenticated ? (
          <>
            <span className="hover:bg-gray-700 px-3 py-2 rounded">
              Bienvenido, {user ? `${user.nombre} ${user.apellido}` : 'Cargando...'}
            </span>
            {(user && (user.rol === 'administrador' || user.rol === 'moderador')) && (
              <Link href="/gestionar">
                <div className="hover:bg-gray-700 px-3 py-2 rounded flex items-center">
                  <svg
                    data-slot="icon"
                    fill="none"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="w-6 h-6 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"
                    ></path>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path>
                  </svg>
                  Gestionar
                </div>
              </Link>
            )}
            <Link href="/editar-perfil">
              <div className="hover:bg-gray-700 px-3 py-2 rounded">Editar Perfil</div>
            </Link>
            <div
              className="relative hover:bg-gray-700 px-3 py-2 rounded flex items-center cursor-pointer"
              onClick={() => setNotificacionesModalOpen(true)}
              onMouseEnter={(e) => (e.currentTarget.style.cursor = 'pointer')}
              onMouseLeave={(e) => (e.currentTarget.style.cursor = 'default')}
            >
              {notificacionesNoLeidas > 0 ? (
                <div className="relative">
                  <svg
                    data-slot="icon"
                    fill="none"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
                    ></path>
                  </svg>
                  <span className="absolute top-0 right-0 block h-2 w-2 bg-red-600 rounded-full ring-2 ring-white"></span>
                </div>
              ) : (
                <svg
                  data-slot="icon"
                  fill="none"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                  ></path>
                </svg>
              )}
            </div>
            <button onClick={logout} className="hover:bg-gray-700 px-3 py-2 rounded">
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <button onClick={onLoginClick} className="hover:bg-gray-700 px-3 py-2 rounded">
              Iniciar Sesión
            </button>
            <Link href="/registro">
              <div className="hover:bg-gray-700 px-3 py-2 rounded">Crear Cuenta</div>
            </Link>
          </>
        )}
      </div>

      <NotificacionesModal
        isOpen={notificacionesModalOpen}
        onRequestClose={() => setNotificacionesModalOpen(false)}
        notificaciones={notificaciones}
        marcarComoLeida={handleMarcarComoLeida}
        eliminarNotificacion={handleEliminarNotificacion}
      />
    </nav>
  );
};

export default NavbarTop;
