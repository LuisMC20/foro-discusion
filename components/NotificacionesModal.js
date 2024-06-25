import React from 'react';
import Modal from 'react-modal';

const NotificacionesModal = ({ isOpen, onRequestClose, notificaciones, marcarComoLeida, eliminarNotificacion }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Notificaciones"
      className="absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-gray-800"
      overlayClassName="fixed inset-0 bg-transparent"
      style={{
        content: {
          top: '47px',
          right: '650px',
          left: 'auto',
          bottom: 'auto',
        },
      }}
    >
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-300">Notificaciones</h2>
        <hr className="border-gray-600 my-2" />
        <ul>
          {notificaciones.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48">
              <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m0 0H9m1-4h.01M12 17a4.978 4.978 0 01-2.857-.97M12 17a4.978 4.978 0 002.857-.97M15 10h.01M21 10a9 9 0 10-18 0 9 9 0 0018 0z" />
              </svg>
              <p className="text-gray-500">Aquí encontrarás las notificaciones</p>
              <p className="text-gray-500 text-sm">No tienes notificaciones nuevas.</p>
            </div>
          ) : (
            notificaciones.map((notificacion) => (
              <li key={notificacion.id} className="mb-2 text-gray-300 border-b border-gray-700 pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <span>{notificacion.mensaje}</span>
                    {!notificacion.leido && (
                      <button
                        onClick={() => marcarComoLeida(notificacion.id)}
                        className="ml-2 text-sm text-blue-500 hover:underline"
                        onMouseEnter={(e) => (e.currentTarget.style.cursor = 'pointer')}
                        onMouseLeave={(e) => (e.currentTarget.style.cursor = 'default')}
                      >
                        Marcar como leída
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => eliminarNotificacion(notificacion.id)}
                    className="text-sm text-red-500 hover:underline ml-2"
                    onMouseEnter={(e) => (e.currentTarget.style.cursor = 'pointer')}
                    onMouseLeave={(e) => (e.currentTarget.style.cursor = 'default')}
                  >
                    <svg
                      data-slot="icon"
                      fill="none"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      className="w-4 h-4"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </Modal>
  );
};

export default NotificacionesModal;
