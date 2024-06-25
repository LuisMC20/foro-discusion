import React from 'react';
import LayoutGestion from '../components/LayoutGestion';

const Gestionar = () => {
  return (
    <LayoutGestion>
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
      <p>Desde esta página puedes gestionar roles y otras funciones administrativas.</p>
      {/* Aquí puedes añadir más funcionalidades de gestión */}
    </LayoutGestion>
  );
};

export default Gestionar;
