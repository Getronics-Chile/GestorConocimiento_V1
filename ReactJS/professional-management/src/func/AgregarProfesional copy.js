import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../node_modules/font-awesome/css/font-awesome.min.css";

const APIURL = "http://localhost:8000";

function AddProfessional() {
  const [setProfesionales] = useState([]);
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

  const [newHabilidad, setNewHabilidad] = useState({
    habilidadTecnologica: "",
    nivelCompetencia: "",
  });

  const [habilidades, setHabilidades] = useState([]);
  const [professionalSummary, setProfessionalSummary] = useState(null); // Estado para el resumen

  useEffect(() => {
    getHabilidades();
  }, []);

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

  const addProfessional = async () => {
    try {
      const professionalData = { ...newProfessional };

      console.log("Datos enviados al backend:", professionalData);

      await axios.post(`${APIURL}/api/profesional/crear`, professionalData, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Profesional agregado exitosamente");

      // Establecer el resumen de los datos agregados
      setProfessionalSummary(newProfessional);

      // Resetear formulario
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

  return (
    <div>
      <h1>Agregar Profesionales</h1>
      <hr />
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
          <ul>
            {newProfessional.habilidadesProfesional.map((habilidad, index) => (
              <li key={index}>
                {habilidad.habilidadTecnologica} ({habilidad.nivelCompetencia})
              </li>
            ))}
          </ul>
        </div>

        <div className="col-12">
          <button type="submit" className="btn button-primary">
            <i className="fa fa-floppy-o" aria-hidden="true"></i> Guardar
            Profesional
          </button>
        </div>
      </form>

      {/* Resumen del profesional agregado */}
      {professionalSummary && (
        <div className="mt-5">
          <div className="card shadow-lg rounded">
            <div className="card-header bg-primary text-white">
              <h5>Resumen del Profesional Agregado</h5>
            </div>
            <div className="card-body">
              <ul>
                <li><strong>Nombre:</strong> {professionalSummary.nombres} {professionalSummary.apaterno} {professionalSummary.amaterno}</li>
                <li><strong>Años de Experiencia:</strong> {professionalSummary.anioExperiencia}</li>
                <li><strong>Nivel de Experiencia:</strong> {professionalSummary.nivelExperiencia}</li>
                <li><strong>Habilidades:</strong>
                  <ul>
                    {professionalSummary.habilidadesProfesional.map((habilidad, index) => (
                      <li key={index}>
                        {habilidad.habilidadTecnologica} ({habilidad.nivelCompetencia})
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddProfessional;
