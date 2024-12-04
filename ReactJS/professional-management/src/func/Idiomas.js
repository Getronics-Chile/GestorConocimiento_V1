import React, { useEffect, useState } from "react";
import axios from "axios";
import '../assets/css/Idiomas.css'; // Agregar archivo CSS para estilos

const APIURL = "http://localhost:8000";

function Idiomas() {
  const [idiomas, setIdiomas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Obtener todos los idiomas
  const getIdiomas = async () => {
    try {
      const response = await axios.get(`${APIURL}/api/idiomas/listar`);
      setIdiomas(response.data);
    } catch (error) {
      console.error("Error al obtener idiomas:", error);
    }
  };

  useEffect(() => {
    getIdiomas(); // Cargar idiomas al inicio
  }, []);

  return (
    <div className="container">
      <h1 className="text-center mb-4">Listado de Idiomas</h1>

      {/* Barra de búsqueda */}
      <div className="search-wrapper mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por idioma"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabla de idiomas */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Id</th>
              <th>Idioma</th>
            </tr>
          </thead>
          <tbody>
            {idiomas
              .filter((idioma) => {
                const searchLowerCase = searchTerm.toLowerCase();
                return idioma.nombre.toLowerCase().includes(searchLowerCase);
              })
              .map((idioma, index) => (
                <tr key={index}>
                  <td>{idioma.id}</td>
                  <td>{idioma.nombre}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Idiomas;
