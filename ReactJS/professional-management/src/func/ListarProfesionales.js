// AddProfessional.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "../../node_modules/font-awesome/css/font-awesome.min.css";
import ReactPaginate from "react-paginate";

const APIURL = "http://localhost:8000";

function AddProfessional() {
  const [profesionales, setProfesionales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0); // Página actual
  const [itemsPerPage] = useState(5); // Número de elementos por página
  const [selectedRows, setSelectedRows] = useState([]); // Filas seleccionadas

  useEffect(() => {
    getProfessionals();
  }, []);

  const exportToPDF = () => {
    const input = document.getElementById("professionalTable");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`profesionales_${new Date().toISOString().split("T")[0]}.pdf`);
    });
  };

  const getProfessionals = async () => {
    try {
      const response = await axios.get(`${APIURL}/api/profesional/listarTodos`);
      setProfesionales(response.data);
    } catch (error) {
      console.error("Error al obtener profesionales:", error);
    }
  };

  const deleteProfessional = async (id) => {
    if (!id) {
      alert("ID no válido");
      return;
    }

    try {
      await axios.delete(`${APIURL}/api/profesional/eliminar/${id}`, {
        headers: { Accept: "*/*" },
      });
      alert("Profesional eliminado exitosamente");
      getProfessionals();
    } catch (error) {
      console.error(
        "Error al eliminar profesional:",
        error.response?.data || error.message
      );
      alert("Error al eliminar profesional.");
    }
  };

  // Manejar cambio de página
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  // Manejar selección de filas
  const toggleRowSelection = (id) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  // Filtrar y paginar profesionales
  const filteredProfessionals = profesionales.filter((prof) => {
    const searchLowerCase = searchTerm.toLowerCase();

    const nombres = prof.nombres ? prof.nombres.toLowerCase() : "";
    const apaterno = prof.apaterno ? prof.apaterno.toLowerCase() : "";
    const amaterno = prof.amaterno ? prof.amaterno.toLowerCase() : "";
    const nivelExperiencia = prof.nivelExperiencia
      ? prof.nivelExperiencia.toLowerCase()
      : "";
    const anioExperiencia = prof.anioExperiencia
      ? prof.anioExperiencia.toString()
      : "";

    // Verificar coincidencias en habilidadesProfesional
    const habilidadesMatch =
      prof.habilidadesProfesional &&
      Array.isArray(prof.habilidadesProfesional) &&
      prof.habilidadesProfesional.some((habilidad) =>
        (habilidad.habilidadTecnologica || "")
          .toLowerCase()
          .includes(searchLowerCase)
      );

    // Verificar coincidencias en formación académica
    const formacionMatch =
      prof.formacionAcademicaProfesional &&
      Array.isArray(prof.formacionAcademicaProfesional) &&
      prof.formacionAcademicaProfesional.some((formacion) =>
        (formacion.carrera || "").toLowerCase().includes(searchLowerCase)
      );

    // Verificar coincidencias en idiomas
    const idiomasMatch =
      prof.idiomasProfesional &&
      Array.isArray(prof.idiomasProfesional) &&
      prof.idiomasProfesional.some((idioma) =>
        (idioma.nombre || "").toLowerCase().includes(searchLowerCase)
      );

    // Verificar coincidencias en los campos del profesional
    return (
      nombres.includes(searchLowerCase) ||
      apaterno.includes(searchLowerCase) ||
      amaterno.includes(searchLowerCase) ||
      anioExperiencia.includes(searchLowerCase) ||
      nivelExperiencia.includes(searchLowerCase) ||
      habilidadesMatch ||
      formacionMatch ||
      idiomasMatch
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
      <h1>Lista de Profesionales</h1>
      <hr></hr>

      {/* Búsqueda */}
      <div className="search-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por campo, formación académica o idiomas"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabla de profesionales */}
      <table className="table table-striped" id="professionalTable">
        <thead>
          <tr>
            <th>Seleccionar</th>
            <th>Id</th>
            <th>A.Paterno A.Materno Nombres</th>
            <th>Años de Experiencia</th>
            <th>Nivel de Experiencia</th>
            <th>Habilidades</th>
            <th>Formación Académica</th>
            <th>Idiomas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentProfessionals.map((prof) => (
            <tr key={prof.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(prof.id)}
                  onChange={() => toggleRowSelection(prof.id)}
                />
              </td>
              <td>{prof.id || "N/A"}</td>
              <td>
                {prof.apaterno || "N/A"} {prof.amaterno || "N/A"}{" "}
                {prof.nombres}
              </td>
              <td>{prof.anioExperiencia || "N/A"}</td>
              <td>{prof.nivelExperiencia || "No Asignado"}</td>
              <td>
                {prof.habilidadesProfesional &&
                Array.isArray(prof.habilidadesProfesional) ? (
                  <ul>
                    {prof.habilidadesProfesional.map((habilidad) => (
                      <li key={habilidad.id}>
                        {habilidad.habilidadTecnologica} (
                        {habilidad.nivelCompetencia})
                      </li>
                    ))}
                  </ul>
                ) : (
                  "No Asignado"
                )}
              </td>
              <td>
                {prof.formacionAcademicaProfesional &&
                Array.isArray(prof.formacionAcademicaProfesional) ? (
                  <ul>
                    {prof.formacionAcademicaProfesional.map((formacion) => (
                      <li key={formacion.id}>
                        {formacion.carrera} - {formacion.institucion}
                      </li>
                    ))}
                  </ul>
                ) : (
                  "No Asignado"
                )}
              </td>
              <td>
                {prof.idiomasProfesional &&
                Array.isArray(prof.idiomasProfesional) ? (
                  <ul>
                    {prof.idiomasProfesional.map((idioma) => (
                      <li key={idioma.id}>
                        {idioma.nombre} ({idioma.nivelDominio})
                      </li>
                    ))}
                  </ul>
                ) : (
                  "No Asignado"
                )}
              </td>
              <td>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => deleteProfessional(prof.id)}
                >
                  <i className="fa fa-trash" aria-hidden="true"></i> Eliminar
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

      <button className="btn button-primary mb-3" onClick={exportToPDF}>
        <i className="fa fa-download" aria-hidden="true"></i> Exportar a PDF
      </button>
    </div>
  );
}

export default AddProfessional;
