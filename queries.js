import { gql } from '@apollo/client';

export const OBTENER_USUARIO = gql`
  query ObtenerUsuario {
    obtenerUsuario {
      id
      nombre
      apellido
      rol
    }
  }
`;

export const OBTENER_CATEGORIAS = gql`
query ObtenerCategorias {
  obtenerCategorias {
    id
    nombre
    descripcion
    creado
  }
}
`;

export const OBTENER_PUBLICACIONES = gql`
  query ObtenerPosts {
    obtenerPosts {
      id
      titulo
      contenido
      autor {
        nombre
        apellido
      }
      categoria {
        nombre
      }
      imagenUrl
      pdfUrl
      promedioPuntuacion
      numeroPuntuaciones
      creado
    }
  }
`;

export const OBTENER_NOTIFICACIONES = gql`
  query ObtenerNotificaciones {
    obtenerNotificaciones {
      id
      mensaje
      leido
      fechaCreacion
    }
  }
`;
