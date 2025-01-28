import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "../../node_modules/font-awesome/css/font-awesome.min.css";
import ReactPaginate from "react-paginate";

const APIURL = "http://localhost:8000";

function ModifyProfessional() {
  const [profesionales, setProfesionales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0); 
  const [itemsPerPage] = useState(5); 
  const [selectedProfessional, setSelectedProfessional] = useState(null); 

  useEffect(() => {
    getProfessionals();
  }, []);

  const getProfessionals = async () => {
    try {
      const response = await axios.get(`${APIURL}/api/profesional/listarTodos`);
      setProfesionales(response.data);
    } catch (error) {
      console.error("Error al obtener profesionales:", error);
    }
  };

  const updateProfessional = async () => {
    if (!selectedProfessional) {
      alert("No hay profesional seleccionado para actualizar");
      return;
    }

    try {
      await axios.put(
        `${APIURL}/api/profesional/actualizar/${selectedProfessional.id}`,
        selectedProfessional,
        { headers: { "Content-Type": "application/json" } }
      );
      alert("Profesional actualizado exitosamente");
      setSelectedProfessional(null);
      getProfessionals();
    } catch (error) {
      console.error("Error al actualizar profesional:", error);
      alert("Error al actualizar profesional.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProfessional((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const filteredProfessionals = profesionales.filter((prof) => {
    const searchLowerCase = searchTerm.toLowerCase();
    return (
      prof.nombres.toLowerCase().includes(searchLowerCase) ||
      prof.apaterno.toLowerCase().includes(searchLowerCase) ||
      prof.amaterno.toLowerCase().includes(searchLowerCase) ||
      prof.nivelExperiencia.toLowerCase().includes(searchLowerCase) ||
      prof.anioExperiencia.toString().includes(searchLowerCase) ||
      prof.correoElectronico.toLowerCase().includes(searchLowerCase) ||
      prof.direccion.toLowerCase().includes(searchLowerCase) ||
      prof.telefono.toLowerCase().includes(searchLowerCase) ||
      prof.idSAP.toLowerCase().includes(searchLowerCase)
    );
  });

  const indexOfLastProfessional = (currentPage + 1) * itemsPerPage;
  const indexOfFirstProfessional = indexOfLastProfessional - itemsPerPage;
  const currentProfessionals = filteredProfessionals.slice(
    indexOfFirstProfessional,
    indexOfLastProfessional
  );

  return (
    <div>
      <h1>Modificar Profesional</h1>
      <hr></hr>

      {/* Búsqueda */}
      <div className="search-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por campo"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabla de profesionales */}
      <table className="table table-striped" id="professionalTable">
        <thead>
          <tr>
            <th>RUT</th>
            <th>ID SAP</th>
            <th>Ap.Paterno Ap.Materno, Nombres</th>
            <th>Fecha de Nacimiento</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Correo Electrónico</th>
            <th>Años de Experiencia</th>
            <th>Nivel de Experiencia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentProfessionals.map((prof) => (
            <tr key={prof.id}>
              <td>{prof.rut || "N/A"}</td>
              <td>{prof.idSAP || "N/A"}</td>
              <td>{prof.apaterno || "N/A"} {prof.amaterno || "N/A"}, {prof.nombres || "N/A"}</td>
              <td>{prof.fechaNacimiento || "N/A"}</td>
              <td>{prof.direccion || "N/A"}</td>
              <td>{prof.telefono || "N/A"}</td>
              <td>{prof.correoElectronico || "N/A"}</td>
              <td>{prof.anioExperiencia || "N/A"}</td>
              <td>{prof.nivelExperiencia || "No Asignado"}</td>
              <td>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => setSelectedProfessional(prof)}
                >
                  <i className="fa fa-pencil" aria-hidden="true"></i> Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <ReactPaginate
        previousLabel={"Anterior"}
        nextLabel={"Siguiente"}
        pageCount={Math.ceil(filteredProfessionals.length / itemsPerPage)}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />

      {/* Formulario de edición */}
      {selectedProfessional && (
        <div className="mt-5">
          <h2>Editar Profesional</h2>
          <form
            className="row g-3 mb-4"
            onSubmit={(e) => {
              e.preventDefault();
              updateProfessional();
            }}
          >
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="RUT"
                name="rut"
                value={selectedProfessional.rut}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="ID SAP"
                name="idSAP"
                value={selectedProfessional.idSAP}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Nombres"
                name="nombres"
                value={selectedProfessional.nombres}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Apellido Paterno"
                name="apaterno"
                value={selectedProfessional.apaterno}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Apellido Materno"
                name="amaterno"
                value={selectedProfessional.amaterno}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="date"
                className="form-control"
                placeholder="Fecha de Nacimiento"
                name="fechaNacimiento"
                value={selectedProfessional.fechaNacimiento}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Dirección"
                name="direccion"
                value={selectedProfessional.direccion}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Teléfono"
                name="telefono"
                value={selectedProfessional.telefono}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="email"
                className="form-control"
                placeholder="Correo Electrónico"
                name="correoElectronico"
                value={selectedProfessional.correoElectronico}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="number"
                className="form-control"
                placeholder="Años de Experiencia"
                name="anioExperiencia"
                value={selectedProfessional.anioExperiencia}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Nivel de Experiencia"
                name="nivelExperiencia"
                value={selectedProfessional.nivelExperiencia}
                onChange={handleInputChange}
              />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary">
                <i className="fa fa-floppy-o" aria-hidden="true"></i> Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ModifyProfessional;