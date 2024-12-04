import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import "../../node_modules/font-awesome/css/font-awesome.min.css";
import ReactPaginate from "react-paginate"; // Importamos la librería de paginación

const APIURL = "http://localhost:8000";

function AddProfessional() {
  const [profesionales, setProfesionales] = useState([]);
  const [newProfessional, setNewProfessional] = useState({
    nombres: "",
    apaterno: "",
    amaterno: "",
    anioExperiencia: "",
    nivelExperiencia: "",
    habilidadesProfesional: [],
    idiomasProfesional: [],
    formacionAcademicaProfesional: [],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [newHabilidad, setNewHabilidad] = useState({
    habilidadTecnologica: "",
    nivelCompetencia: "",
  });

  const [habilidades, setHabilidades] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Página actual
  const [itemsPerPage] = useState(5); // Número de elementos por página

  useEffect(() => {
    getProfessionals();
    getHabilidades();
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

  const addHabilidad = () => {
    if (newHabilidad.habilidadTecnologica && newHabilidad.nivelCompetencia) {
      setNewProfessional((prevState) => ({
        ...prevState,
        habilidadesProfesional: [
          ...prevState.habilidadesProfesional,
          newHabilidad,
        ],
      }));
      setNewHabilidad({ habilidadTecnologica: "", nivelCompetencia: "" });
    } else {
      alert("Completa los campos de habilidad antes de agregar.");
    }
  };

  const getHabilidades = async () => {
    try {
      const response = await axios.get(
        `${APIURL}/api/habilidadesTecnologicas/listarTodas`
      );
      setHabilidades(response.data);
    } catch (error) {
      console.error("Error al obtener habilidades:", error);
    }
  };

  const addProfessional = async () => {
    try {
      const professionalData = { ...newProfessional };

      console.log("Datos enviados al backend:", professionalData);

      await axios.post(`${APIURL}/api/profesional/crear`, professionalData, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Profesional agregado exitosamente");
      setNewProfessional({
        nombres: "",
        apaterno: "",
        amaterno: "",
        anioExperiencia: "",
        nivelExperiencia: "",
        habilidadesProfesional: [],
        idiomasProfesional: [],
        formacionAcademicaProfesional: [],
      });
      getProfessionals();
    } catch (error) {
      console.error("Error al agregar profesional:", error);
      alert("Error al agregar profesional.");
    }
  };

  const deleteProfessional = async (id) => {
    if (!id) {
      alert("ID no válido");
      return;
    }

    try {
      const response = await axios.delete(
        `${APIURL}/api/profesional/eliminar/${id}`,
        {
          headers: {
            Accept: "*/*",
          },
        }
      );
      console.log(response.data);
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

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const indexOfLastProfessional = (currentPage + 1) * itemsPerPage;
  const indexOfFirstProfessional = indexOfLastProfessional - itemsPerPage;
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

    const habilidadesMatch =
      prof.habilidadesProfesional &&
      Array.isArray(prof.habilidadesProfesional) &&
      prof.habilidadesProfesional.some((habilidad) =>
        (habilidad.habilidadTecnologica || "")
          .toLowerCase()
          .includes(searchLowerCase)
      );

    return (
      nombres.includes(searchLowerCase) ||
      apaterno.includes(searchLowerCase) ||
      amaterno.includes(searchLowerCase) ||
      anioExperiencia.includes(searchLowerCase) ||
      nivelExperiencia.includes(searchLowerCase) ||
      habilidadesMatch
    );
  });

  const currentProfessionals = filteredProfessionals.slice(
    indexOfFirstProfessional,
    indexOfLastProfessional
  );

  return (
    <div>
      <h1>Gestión de Profesionales</h1>

      <button className="btn button-primary mb-3" onClick={exportToPDF}>
        <i className="fa fa-download" aria-hidden="true"></i> Exportar a PDF
      </button>

      {/* Formulario de profesionales aquí */}
      {/* ... */}

      <div className="search-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por campo"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="table table-striped" id="professionalTable">
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombres</th>
            <th>Apellido Paterno</th>
            <th>Apellido Materno</th>
            <th>Años de Experiencia</th>
            <th>Nivel de Experiencia</th>
            <th>Habilidades</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentProfessionals.map((prof, index) => (
            <tr key={index}>
              <td>{prof.id || "N/A"}</td>
              <td>{prof.nombres}</td>
              <td>{prof.apaterno || "N/A"}</td>
              <td>{prof.amaterno || "N/A"}</td>
              <td>{prof.anioExperiencia || "N/A"}</td>
              <td>{prof.nivelExperiencia || "N/A"}</td>
              <td>
                {prof.habilidadesProfesional.length > 0 ? (
                  prof.habilidadesProfesional.map((habilidad, i) => (
                    <div key={i}>
                      {habilidad.habilidadTecnologica}
                    </div>
                  ))
                ) : (
                  "N/A"
                )}
              </td>
              <td>
                <button
                  onClick={() => deleteProfessional(prof.id)}
                  className="btn btn-danger"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ReactPaginate
        previousLabel={"< Anterior"}
        nextLabel={"Siguiente >"}
        pageCount={Math.ceil(filteredProfessionals.length / itemsPerPage)}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </div>
  );
}

export default AddProfessional;
