import React, { useEffect, useState } from "react";
import axios from "axios";

const APIURL = "http://localhost:8000";

function AddHabilidadesTecnologicas() {
  const [habilidades, setHabilidades] = useState([]);
  const [newHabilidad, setNewHabilidad] = useState({
    nombre: "",
    categoria: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Obtener todas las habilidades
  const getHabilidades = async () => {
    try {
      const response = await axios.get(`${APIURL}/api/habilidadesTecnologicas/listarTodas`);
      setHabilidades(response.data);
    } catch (error) {
      console.error("Error al obtener habilidades:", error);
    }
  };

  // Agregar una nueva habilidad
  const addHabilidad = async () => {
    if (!newHabilidad.nombre || !newHabilidad.categoria) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    try {
      await axios.post(
        `${APIURL}/api/habilidadesTecnologicas/crear`,
        newHabilidad,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      alert("Habilidad agregada exitosamente.");
      setNewHabilidad({ nombre: "", categoria: "" }); // Limpiar formulario
      getHabilidades(); // Volver a cargar la lista de habilidades
    } catch (error) {
      console.error("Error al agregar habilidad:", error);
      alert("Error al agregar habilidad.");
    }
  };

  useEffect(() => {
    getHabilidades(); // Cargar habilidades al inicio
  }, []);

  return (
    
    <div>
      <h1>Gestión de Habilidades Tecnológicas</h1>

      <form
        className="row g-3 mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          addHabilidad();
        }}
      >
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre de Habilidad"
            value={newHabilidad.nombre}
            onChange={(e) =>
              setNewHabilidad({
                ...newHabilidad,
                nombre: e.target.value,
              })
            }
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Categoría"
            value={newHabilidad.categoria}
            onChange={(e) =>
              setNewHabilidad({
                ...newHabilidad,
                categoria: e.target.value,
              })
            }
            required
          />
        </div>

        <div className="col-12">
        <button type="submit" className="btn btn-primary">
          <i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar Habilidad
          </button>
        </div>

          
      </form>

      {/* Barra de búsqueda */}
      <div className="search-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por nombre o categoría"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabla de habilidades */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Categoría</th>
          </tr>
        </thead>
        <tbody>
          {habilidades
            .filter((habilidad) => {
              const searchLowerCase = searchTerm.toLowerCase();
              return (
                habilidad.nombre.toLowerCase().includes(searchLowerCase) ||
                habilidad.categoria.toLowerCase().includes(searchLowerCase)
              );
            })
            .map((habilidad, index) => (
              <tr key={index}>
                <td>{habilidad.id}</td>
                <td>{habilidad.nombre}</td>
                <td>{habilidad.categoria}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default AddHabilidadesTecnologicas;
