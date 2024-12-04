// AddProfessional.js
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

  // const [newIdioma, setNewIdioma] = useState({ nombre: "", nivelDominio: "" });
  // const [newFormacion, setNewFormacion] = useState({
  //   carrera: "",
  //   institucion: "",
  // });

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

  // Obtener todas las habilidades
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

  // const addIdioma = () => {
  //   if (newIdioma.nombre && newIdioma.nivelDominio) {
  //     setNewProfessional((prevState) => ({
  //       ...prevState,
  //       idiomasProfesional: [...prevState.idiomasProfesional, newIdioma],
  //     }));
  //     setNewIdioma({ nombre: "", nivelDominio: "" });
  //   } else {
  //     alert("Completa los campos de idioma antes de agregar.");
  //   }
  // };

  // const addFormacion = () => {
  //   if (newFormacion.carrera && newFormacion.institucion) {
  //     setNewProfessional((prevState) => ({
  //       ...prevState,
  //       formacionAcademicaProfesional: [
  //         ...prevState.formacionAcademicaProfesional,
  //         newFormacion,
  //       ],
  //     }));
  //     setNewFormacion({ carrera: "", institucion: "" });
  //   } else {
  //     alert("Completa los campos de formación antes de agregar.");
  //   }
  // };

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


  // Función para manejar el cambio de página
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  // Filtrar los profesionales que se van a mostrar en la página actual
  // const indexOfLastProfessional = (currentPage + 1) * itemsPerPage;
  // const indexOfFirstProfessional = indexOfLastProfessional - itemsPerPage;
  // const currentProfessionals = profesionales.slice(
  //   indexOfFirstProfessional,
  //   indexOfLastProfessional
  // );

  return (
    <div>
      <h1>Gestión de Profesionales</h1>
      <hr></hr>
      <h4>Información personal del profesional</h4>

      <form
        className="row g-3 mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          addProfessional();
        }}
      >
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Nombres"
            value={newProfessional.nombres}
            onChange={(e) =>
              setNewProfessional({
                ...newProfessional,
                nombres: e.target.value,
              })
            }
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Apellido Paterno"
            value={newProfessional.apaterno}
            onChange={(e) =>
              setNewProfessional({
                ...newProfessional,
                apaterno: e.target.value,
              })
            }
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Apellido Materno"
            value={newProfessional.amaterno}
            onChange={(e) =>
              setNewProfessional({
                ...newProfessional,
                amaterno: e.target.value,
              })
            }
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Años de Experiencia"
            value={newProfessional.anioExperiencia}
            onChange={(e) =>
              setNewProfessional({
                ...newProfessional,
                anioExperiencia: e.target.value,
              })
            }
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={newProfessional.nivelExperiencia}
            onChange={(e) =>
              setNewProfessional({
                ...newProfessional,
                nivelExperiencia: e.target.value,
              })
            }
            required
          >
            <option value="">Selecciona un Nivel de Experiencia</option>
            <option value="Junior">Junior</option>
            <option value="Semisenior">Semi senior</option>
            <option value="Senior">Senior</option>
          </select>
        </div>

        {/* Campos para habilidades */}
        <h4>Habilidades del profesional</h4>
        <div className="col-md-6">
          <select
            className="form-select"
            value={newHabilidad.habilidadTecnologica}
            onChange={(e) =>
              setNewHabilidad({
                ...newHabilidad,
                habilidadTecnologica: e.target.value,
              })
            }
            required
          >
            {habilidades.map((habilidad) => (
              <option key={habilidad.id} value={habilidad.nombre}>
                {habilidad.nombre} ({habilidad.categoria})
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={newHabilidad.nivelCompetencia}
            onChange={(e) =>
              setNewHabilidad({
                ...newHabilidad,
                nivelCompetencia: e.target.value,
              })
            }
          >
            <option value="">Nivel de Competencia</option>
            <option value="Básico">Básico</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
          </select>
        </div>

        <div className="col-md-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={addHabilidad}
          >
            + Agregar Habilidad
          </button>
        </div>

        <div className="col-12">
          {/* <h5>Habilidades Agregadas</h5> */}
          <ul>
            {newProfessional.habilidadesProfesional.map((habilidad, index) => (
              <li key={index}>
                {habilidad.habilidadTecnologica} ({habilidad.nivelCompetencia})
              </li>
            ))}
          </ul>
        </div>

        {/* Similar para idiomas y formación */}
        {/* Idiomas */}
        {/* Formación Académica */}

        <div className="col-12">
          <button type="submit" className="btn button-primary">
            <i class="fa fa-floppy-o" aria-hidden="true"></i> Guardar
            Profesional
          </button>
        </div>
      </form>

      <hr></hr>
      <h4>Lista de profesionales</h4>

      {/* Lista de profesionales con búsqueda */}
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
            <th>A.Paterno A.Materno Nombres</th>
            <th>Años de Experiencia</th>
            <th>Nivel de Experiencia</th>
            <th>Habilidades</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {profesionales
            .filter((prof) => {
              const searchLowerCase = searchTerm.toLowerCase();

              // Manejo seguro de valores nulos o indefinidos
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

              // Verificar coincidencias en los campos del profesional
              return (
                nombres.includes(searchLowerCase) ||
                apaterno.includes(searchLowerCase) ||
                amaterno.includes(searchLowerCase) ||
                anioExperiencia.includes(searchLowerCase) ||
                nivelExperiencia.includes(searchLowerCase) ||
                habilidadesMatch
              );
            })

            .map((prof, index) => (
              <tr key={index}>
                <td>{prof.id || "N/A"}</td>
                <td>{prof.apaterno || "N/A"} {prof.amaterno || "N/A"} {prof.nombres}</td>
                <td>{prof.anioExperiencia || "N/A"}</td>
                <td>{prof.nivelExperiencia || "No Asignado"}</td>

                {/* Renderizar habilidades */}
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
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => deleteProfessional(prof.id)}
                  >
                    <i class="fa fa-trash" aria-hidden="true"></i> Eliminar
                  </button>

                  {/* <button class="btn btn-outline-primary" onClick={() => "#"}>
                    <i class="fa fa-cog" aria-hidden="true"></i> Modificar
                  </button> */}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <button className="btn button-primary mb-3" onClick={exportToPDF}>
        <i class="fa fa-download" aria-hidden="true"></i> Exportar a PDF
      </button>

      {/* Paginación */}
      <ReactPaginate
        previousLabel={"Anterior"}
        nextLabel={"Siguiente"}
        pageCount={Math.ceil(profesionales.length / itemsPerPage)} // Total de páginas
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </div>
  );
}

export default AddProfessional;
