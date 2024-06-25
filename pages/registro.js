import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';

const NUEVA_CUENTA = gql`
mutation nuevoUsuario($input: UsuarioInput) {
  nuevoUsuario(input: $input){
    id
    nombre
    apellido
    email
    pais
    ciudad
    rubro
    rol
  }
}
`;

const paisOptions = [
  { value: 'argentina', label: 'Argentina', code: '+54' },
  { value: 'brasil', label: 'Brasil', code: '+55' },
  { value: 'chile', label: 'Chile', code: '+56' },
  { value: 'peru', label: 'Perú', code: '+51' },
  { value: 'bolivia', label: 'Bolivia', code: '+591' },
  { value: 'ecuador', label: 'Ecuador', code: '+593' },
  { value: 'uruguay', label: 'Uruguay', code: '+598' },
  { value: 'venezuela', label: 'Venezuela', code: '+58' },
  { value: 'paraguay', label: 'Paraguay', code: '+595' }
];

const ciudadOptions = {
  argentina: [
    { value: 'buenos_aires', label: 'Buenos Aires' },
    { value: 'cordoba', label: 'Córdoba' },
    { value: 'rosario', label: 'Rosario' },
    { value: 'mendoza', label: 'Mendoza' },
    { value: 'tucuman', label: 'Tucumán' },
    { value: 'la_plata', label: 'La Plata' },
    { value: 'salta', label: 'Salta' }
  ],
  brasil: [
    { value: 'sao_paulo', label: 'São Paulo' },
    { value: 'rio_de_janeiro', label: 'Rio de Janeiro' },
    { value: 'salvador', label: 'Salvador' },
    { value: 'brasilia', label: 'Brasilia' },
    { value: 'fortaleza', label: 'Fortaleza' },
    { value: 'belo_horizonte', label: 'Belo Horizonte' },
    { value: 'manaus', label: 'Manaus' }
  ],
  chile: [
    { value: 'santiago', label: 'Santiago' },
    { value: 'valparaiso', label: 'Valparaíso' },
    { value: 'concepcion', label: 'Concepción' },
    { value: 'la_serena', label: 'La Serena' },
    { value: 'antofagasta', label: 'Antofagasta' },
    { value: 'temuco', label: 'Temuco' },
    { value: 'rancagua', label: 'Rancagua' }
  ],
  peru: [
    { value: 'lima', label: 'Lima' },
    { value: 'arequipa', label: 'Arequipa' },
    { value: 'cusco', label: 'Cusco' },
    { value: 'trujillo', label: 'Trujillo' },
    { value: 'chiclayo', label: 'Chiclayo' },
    { value: 'iquitos', label: 'Iquitos' },
    { value: 'piura', label: 'Piura' }
  ],
  bolivia: [
    { value: 'santa_cruz', label: 'Santa Cruz' },
    { value: 'la_paz', label: 'La Paz' },
    { value: 'cochabamba', label: 'Cochabamba' },
    { value: 'sucre', label: 'Sucre' },
    { value: 'oruro', label: 'Oruro' },
    { value: 'potosi', label: 'Potosí' },
    { value: 'tarija', label: 'Tarija' }
  ],
  ecuador: [
    { value: 'quito', label: 'Quito' },
    { value: 'guayaquil', label: 'Guayaquil' },
    { value: 'cuenca', label: 'Cuenca' },
    { value: 'santo_domingo', label: 'Santo Domingo' },
    { value: 'machala', label: 'Machala' },
    { value: 'manta', label: 'Manta' },
    { value: 'portoviejo', label: 'Portoviejo' }
  ],
  uruguay: [
    { value: 'montevideo', label: 'Montevideo' },
    { value: 'salto', label: 'Salto' },
    { value: 'ciudad_de_la_costa', label: 'Ciudad de la Costa' },
    { value: 'paysandu', label: 'Paysandú' },
    { value: 'las_piedras', label: 'Las Piedras' },
    { value: 'rivera', label: 'Rivera' },
    { value: 'maldonado', label: 'Maldonado' }
  ],
  venezuela: [
    { value: 'caracas', label: 'Caracas' },
    { value: 'maracaibo', label: 'Maracaibo' },
    { value: 'valencia', label: 'Valencia' },
    { value: 'barquisimeto', label: 'Barquisimeto' },
    { value: 'maracay', label: 'Maracay' },
    { value: 'ciudad_bolivar', label: 'Ciudad Bolívar' },
    { value: 'barcelona', label: 'Barcelona' }
  ],
  paraguay: [
    { value: 'asuncion', label: 'Asunción' },
    { value: 'ciudad_del_este', label: 'Ciudad del Este' },
    { value: 'san_lorenzo', label: 'San Lorenzo' },
    { value: 'luque', label: 'Luque' },
    { value: 'caaguazu', label: 'Caaguazú' },
    { value: 'encarnacion', label: 'Encarnación' },
    { value: 'coronel_oviedo', label: 'Coronel Oviedo' }
  ]
};

const rubroOptions = [
  { value: 'tecnologia', label: 'Tecnología' },
  { value: 'educacion', label: 'Educación' },
  { value: 'salud', label: 'Salud' },
  { value: 'comercio', label: 'Comercio' }
];

const Registro = () => {

  // State para el mensaje
  const [mensaje, guardarMensaje] = useState({ tipo: '', texto: '' });
  // Mutation para crear usuarios
  const [nuevoUsuario] = useMutation(NUEVA_CUENTA);
  const [countryCode, setCountryCode] = useState('');

  // Routing
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellido: '',
      celular: '',
      pais: '',
      ciudad: '',
      rubro: '',
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required('El nombre es obligatorio'),
      apellido: Yup.string().required('Los apellidos son obligatorios'),
      celular: Yup.string().required('El celular es obligatorio'),
      pais: Yup.string().required('El país es obligatorio'),
      ciudad: Yup.string().required('La ciudad es obligatoria'),
      rubro: Yup.string().required('El rubro es obligatorio'),
      email: Yup.string().email('El correo no es válido').required('El correo es obligatorio'),
      password: Yup.string().required('La contraseña es obligatoria').min(6, 'La contraseña debe tener al menos 6 caracteres')
    }),
    onSubmit: async valores => {
      const { nombre, apellido, email, celular, rubro, pais, ciudad, password } = valores;
      try {
        const { data } = await nuevoUsuario({
          variables: {
            input: {
              nombre,
              apellido,
              email,
              celular,
              rubro,
              pais,
              ciudad,
              password
            }
          }
        });
        console.log(data);

        // Usuario creado correctamente
        guardarMensaje({ tipo: 'exito', texto: `Se creo correctamente el usuario: ${data.nuevoUsuario.nombre}` });
        setTimeout(() => {
          guardarMensaje({ tipo: '', texto: '' });
          router.push('/');
        }, 3000);
      } catch (error) {
        guardarMensaje({ tipo: 'error', texto: error.message.replace('GraphQL error:', '') });
        setTimeout(() => {
          guardarMensaje({ tipo: '', texto: '' });
        }, 2000);
      }
    }
  });

  useEffect(() => {
    const selectedCountry = paisOptions.find(p => p.value === formik.values.pais);
    if (selectedCountry) {
      formik.setFieldValue('celular', selectedCountry.code);
      setCountryCode(selectedCountry.code);
    } else {
      formik.setFieldValue('celular', '');
      setCountryCode('');
    }
  }, [formik.values.pais]);

  const mostrarMensaje = () => {
    if (!mensaje.texto) return null;

    const bgColor = mensaje.tipo === 'error' ? 'bg-red-100' : 'bg-green-100';
    const borderColor = mensaje.tipo === 'error' ? 'border-red-500' : 'border-green-500';
    const textColor = mensaje.tipo === 'error' ? 'text-red-700' : 'text-green-700';
    const iconColor = mensaje.tipo === 'error' ? 'text-red-500' : 'text-green-500';

    return (
      <div className={`fixed top-0 right-0 mt-4 mr-4 ${bgColor} border-l-4 ${borderColor} ${textColor} p-4 rounded shadow-md z-50`}>
        <div className="flex">
          <div className="py-1">
            <svg
              className={`h-6 w-6 ${iconColor}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={mensaje.tipo === 'error' ? "M10 14l2-2m0 0l2-2m-2 2l2-2m-2 2V6m0 12h.01M4 6h16M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6" : "M9 12l2 2 4-4M7 12l-2-2m5-3a7 7 0 00-7 7v4h14v-4a7 7 0 00-7-7z"}
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="font-bold">{mensaje.tipo === 'error' ? 'Error' : 'Éxito'}</p>
            <p className="text-sm">{mensaje.texto}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen bg-cover bg-center relative" style={{ backgroundImage: "url('/images/background.jpg')" }}>
        {mostrarMensaje()}
        <div className="w-full max-w-4xl relative">
          <h1 className="text-center text-2xl text-white font-light mb-6">Crear nueva cuenta</h1>
          <form className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4" onSubmit={formik.handleSubmit}>
            <div className="flex flex-wrap -mx-3">
              {[
                { id: 'nombre', type: 'text', placeholder: 'Nombre' },
                { id: 'apellido', type: 'text', placeholder: 'Apellidos' },
                {
                  id: 'celular', type: 'text', placeholder: 'Celular', value: formik.values.celular, onChange: e => formik.setFieldValue('celular', e.target.value)
                },
                { id: 'pais', type: 'select', placeholder: 'País', options: paisOptions },
                { id: 'ciudad', type: 'select', placeholder: 'Ciudad', options: formik.values.pais ? ciudadOptions[formik.values.pais] : [] },
                { id: 'rubro', type: 'select', placeholder: 'Rubro', options: rubroOptions },
                { id: 'email', type: 'email', placeholder: 'Correo electrónico' },
                { id: 'password', type: 'password', placeholder: 'Contraseña' }
              ].map((input, index) => (
                <div key={index} className={`w-full md:w-1/2 px-3 mb-6 ${index % 2 !== 0 ? 'border-l-2 border-gray-300' : ''}`}>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={input.id}>
                    {input.placeholder}
                  </label>
                  {input.type === 'select' ? (
                    <select
                      id={input.id}
                      name={input.id}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values[input.id]}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value=''>Seleccionar {input.placeholder}</option>
                      {input.options.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={input.type}
                      id={input.id}
                      name={input.id}
                      placeholder={input.placeholder}
                      value={input.value || formik.values[input.id]}
                      onChange={input.onChange || formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                  )}
                  {formik.touched[input.id] && formik.errors[input.id] ? (
                    <div className="text-red-500 text-xs mt-2">{formik.errors[input.id]}</div>
                  ) : null}
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
            >
              Crear cuenta
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Registro;
