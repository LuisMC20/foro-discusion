import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = ({ onFileUpload, fileType }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Iniciando subida del archivo:', file);
      const res = await axios.post('http://localhost:4000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Archivo subido:', res.data.fileUrl); 
      onFileUpload(res.data.fileUrl);
      setFile(null);
    } catch (err) {
      console.error('Error uploading the file', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center mb-4">
      <input 
        type="file" 
        onChange={handleFileChange} 
        className="hidden" 
        id={`file-input-${fileType}`}
        accept={fileType === 'image' ? 'image/*' : 'application/pdf'}
      />
      <label 
        htmlFor={`file-input-${fileType}`}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded cursor-pointer mr-4"
      >
        {fileType === 'image' ? 'Elegir Imagen' : 'Elegir PDF'}
      </label>
      <button
        onClick={handleUpload}
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${!file || uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!file || uploading}
      >
        {uploading ? 'Subiendo...' : 'Subir'}
      </button>
      {file && (
        <span className="ml-4 text-gray-600">{file.name}</span>
      )}
    </div>
  );
};

export default ImageUpload;
