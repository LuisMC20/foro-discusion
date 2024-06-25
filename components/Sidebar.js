import React, { useState } from 'react';
import Link from 'next/link';

const Sidebar = () => {
  const [mostrarCategorias, setMostrarCategorias] = useState(false);

  return (
    <div className="h-screen bg-gray-900 text-white w-64 space-y-6 py-7 px-2 relative">
      <h2 className="text-2xl font-bold text-center">Gestionar</h2>
      <nav>
        <ul>
          <li className="text-lg my-2">
            <Link href="/GestionarRoles">
              <span className="hover:bg-gray-700 rounded-lg py-2 px-4 block cursor-pointer">
                Gestionar Roles
              </span>
            </Link>
          </li>
          <li
            className="text-lg my-2 relative"
            onMouseEnter={() => setMostrarCategorias(true)}
            onMouseLeave={() => setMostrarCategorias(false)}
          >
            <span className="hover:bg-gray-700 rounded-lg py-2 px-4 block cursor-pointer">
              Gestionar Categorías
            </span>
            {mostrarCategorias && (
              <ul className="absolute left-full top-0 ml-2 w-40 bg-gray-900 text-white rounded-lg shadow-lg">
                <li className="text-lg my-2">
                  <Link href="/CrearCategorias">
                    <span className="hover:bg-gray-700 rounded-lg py-2 px-4 block cursor-pointer">
                      Crear Categorías
                    </span>
                  </Link>
                </li>
                <li className="text-lg my-2">
                  <Link href="/EditarCategorias">
                    <span className="hover:bg-gray-700 rounded-lg py-2 px-4 block cursor-pointer">
                      Editar categorías
                    </span>
                  </Link>
                </li>
              </ul>
            )}
          </li>
          { <li className="text-lg my-2">
            <Link href="/GestionarReportes">
              <span className="hover:bg-gray-700 rounded-lg py-2 px-4 block cursor-pointer">
                Gestionar reportes
              </span>
            </Link>
          </li> }
          { <li className="text-lg my-2">
            <Link href="/GestionarAnuncios">
              <span className="hover:bg-gray-700 rounded-lg py-2 px-4 block cursor-pointer">
                Gestionar anuncios
              </span>
            </Link>
          </li> }
        </ul>
      </nav>
      <div className="mt-auto">
        <Link href="/">
          <span className="hover:bg-gray-700 rounded-lg py-2 px-4 block text-center cursor-pointer">
            Regresar al Inicio
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
