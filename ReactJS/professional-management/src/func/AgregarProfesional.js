import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../node_modules/font-awesome/css/font-awesome.min.css";

const APIURL = "http://localhost:8000";

function AddProfessional() {
  const [setProfesionales] = useState([]);
  const [newProfessional, setNewProfessional] = useState({
    rut: "",
    idSAP: "",
    nombres: "",
    apaterno: "",
    amaterno: "",
    fechaNacimiento: "",
    direccion: "",
    correoElectronico: "",
    telefono: "",
    anioExperiencia: 0,
    nivelExperiencia: "",
    fechaIngresoGetronics: "",
    fechaEgresoGetronics: "",
    activo: true,
    referido: true,
    listaNegra: true,
    conocimientoTecnicoProfesional: [],
    idiomasProfesional: [],
    formacionAcademicaProfesional: [],
    certificacionProfesional: [],
    cliente: { id: "" },
  });

  const [newHabilidad, setNewHabilidad] = useState({ nombre: "", nivelCompetencia: "" });
  const [newIdioma, setNewIdioma] = useState({ nombre: "", nivelDominio: "" });
  const [newFormacion, setNewFormacion] = useState({
    carrera: "",
    institucion: "",
    anioInicio: "",
    anioFin: "",
  });

  const [newCertificacion, setNewCertificacion] = useState({
    nombreCertificacion: "",
    institucionEmisora: "",
    fechaEmision: "",
    fechaVencimiento: "",
  });

  const [habilidades, setHabilidades] = useState([]);
  const [idiomas, setIdiomas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [professionalSummary, setProfessionalSummary] = useState(null);

  useEffect(() => {
    getHabilidades();
    getIdiomas();
    getClientes();
  }, []);

  const getProfessionals = async () => {
    try {
      const response = await axios.get(`${APIURL}/api/profesional/listarTodos`);
      setProfesionales(response.data);
    } catch (error) {
      console.error("Error al obtener profesionales:", error);
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

  const getIdiomas = async () => {
    try {
      const response = await axios.get(`${APIURL}/api/idiomas/listar`);
      setIdiomas(response.data);
    } catch (error) {
      console.error("Error al obtener idiomas:", error);
    }
  };

  const getClientes = async () => {
    try {
      const response = await axios.get(`${APIURL}/api/cliente/listarTodos`);
      setClientes(response.data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
    }
  };

  const addHabilidad = () => {
    if (newHabilidad.nombre && newHabilidad.nivelCompetencia) {
      setNewProfessional((prevState) => ({
        ...prevState,
        conocimientoTecnicoProfesional: [
          ...prevState.conocimientoTecnicoProfesional,
          newHabilidad,
        ],
      }));
      setNewHabilidad({ nombre: "", nivelCompetencia: "" });
    } else {
      alert("Completa los campos de habilidad antes de agregar.");
    }
  };

  const addIdioma = () => {
    if (newIdioma.nombre && newIdioma.nivelDominio) {
      setNewProfessional((prevState) => ({
        ...prevState,
        idiomasProfesional: [
          ...prevState.idiomasProfesional,
          newIdioma,
        ],
      }));
      setNewIdioma({ nombre: "", nivelDominio: "" });
    } else {
      alert("Completa los campos de idioma antes de agregar.");
    }
  };

  const addFormacion = () => {
    if (
      newFormacion.carrera &&
      newFormacion.institucion &&
      newFormacion.anioInicio &&
      newFormacion.anioFin
    ) {
      setNewProfessional((prevState) => ({
        ...prevState,
        formacionAcademicaProfesional: [
          ...prevState.formacionAcademicaProfesional,
          newFormacion,
        ],
      }));
      setNewFormacion({
        carrera: "",
        institucion: "",
        anioInicio: "",
        anioFin: "",
      });
    } else {
      alert("Completa los campos de formación académica antes de agregar.");
    }
  };

  const addCertificacion = () => {
    if (
      newCertificacion.nombreCertificacion &&
      newCertificacion.institucionEmisora &&
      newCertificacion.fechaEmision &&
      newCertificacion.fechaVencimiento
    ) {
      setNewProfessional((prevState) => ({
        ...prevState,
        certificacionProfesional: [
          ...prevState.certificacionProfesional,
          newCertificacion,
        ],
      }));
      setNewCertificacion({
        nombreCertificacion: "",
        institucionEmisora: "",
        fechaEmision: "",
        fechaVencimiento: "",
      });
    } else {
      alert("Completa los campos de certificación antes de agregar.");
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

      setProfessionalSummary(newProfessional);

      setNewProfessional({
        rut: "",
        idSAP: "",
        nombres: "",
        apaterno: "",
        amaterno: "",
        fechaNacimiento: "",
        direccion: "",
        correoElectronico: "",
        telefono: "",
        anioExperiencia: 0,
        nivelExperiencia: "",
        fechaIngresoGetronics: "",
        fechaEgresoGetronics: "",
        activo: true,
        referido: true,
        listaNegra: true,
        conocimientoTecnicoProfesional: [],
        idiomasProfesional: [],
        formacionAcademicaProfesional: [],
        certificacionProfesional: [],
        cliente: { id: "" },
      });

      getProfessionals();
    } catch (error) {
      console.error("Error al agregar profesional:", error);
      alert("Error al agregar profesional.");
    }
  };

  return (
    <div>
      <h1>Agregar Profesional</h1>
      <hr />
      <form
        className="row g-3 mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          addProfessional();
        }}
      >
        {/* Información básica */}
        <div className="col-md-4">
          <label>RUT</label>
          <input
            type="text"
            className="form-control"
            value={newProfessional.rut}
            onChange={(e) =>
              setNewProfessional({ ...newProfessional, rut: e.target.value })
            }
          />
        </div>
        <div className="col-md-4">
          <label>ID SAP</label>
          <input
            type="text"
            className="form-control"
            value={newProfessional.idSAP}
            onChange={(e) =>
              setNewProfessional({ ...newProfessional, idSAP: e.target.value })
            }
          />
        </div>
        <div className="col-md-4">
          <label>Nombres</label>
          <input
            type="text"
            className="form-control"
            value={newProfessional.nombres}
            onChange={(e) =>
              setNewProfessional({ ...newProfessional, nombres: e.target.value })
            }
          />
        </div>
        <div className="col-md-4">
          <label>Apellido Paterno</label>
          <input
            type="text"
            className="form-control"
            value={newProfessional.apaterno}
            onChange={(e) =>
              setNewProfessional({ ...newProfessional, apaterno: e.target.value })
            }
          />
        </div>
        <div className="col-md-4">
          <label>Apellido Materno</label>
          <input
            type="text"
            className="form-control"
            value={newProfessional.amaterno}
            onChange={(e) =>
              setNewProfessional({ ...newProfessional, amaterno: e.target.value })
            }
          />
        </div>
        <div className="col-md-4">
          <label>Fecha de Nacimiento</label>
          <input
            type="date"
            className="form-control"
            value={newProfessional.fechaNacimiento}
            onChange={(e) =>
              setNewProfessional({
                ...newProfessional,
                fechaNacimiento: e.target.value,
              })
            }
          />
        </div>
        <div className="col-md-4">
          <label>Dirección</label>
          <input
            type="text"
            className="form-control"
            value={newProfessional.direccion}
            onChange={(e) =>
              setNewProfessional({ ...newProfessional, direccion: e.target.value })
            }
          />
        </div>
        <div className="col-md-4">
          <label>Teléfono</label>
          <input
            type="text"
            className="form-control"
            value={newProfessional.telefono}
            onChange={(e) =>
              setNewProfessional({ ...newProfessional, telefono: e.target.value })
            }
          />
        </div>
        <div className="col-md-4">
          <label>Correo Electrónico</label>
          <input
            type="email"
            className="form-control"
            value={newProfessional.correoElectronico}
            onChange={(e) =>
              setNewProfessional({
                ...newProfessional,
                correoElectronico: e.target.value,
              })
            }
          />
        </div>
        <div className="col-md-4">
          <label>Años de Experiencia</label>
          <input
            type="number"
            className="form-control"
            value={newProfessional.anioExperiencia}
            onChange={(e) =>
              setNewProfessional({
                ...newProfessional,
                anioExperiencia: e.target.value,
              })
            }
          />
        </div>
        <div className="col-md-4">
          <label>Nivel de Experiencia</label>
          <input
            type="text"
            className="form-control"
            value={newProfessional.nivelExperiencia}
            onChange={(e) =>
              setNewProfessional({
                ...newProfessional,
                nivelExperiencia: e.target.value,
              })
            }
          />
        </div>
        <div className="col-md-4">
          <label>Fecha de Ingreso a Getronics</label>
          <input
            type="date"
            className="form-control"
            value={newProfessional.fechaIngresoGetronics}
            onChange={(e) =>
              setNewProfessional({
                ...newProfessional,
                fechaIngresoGetronics: e.target.value,
              })
            }
          />
        </div>
        <div className="col-md-4">
          <label>Fecha de Egreso de Getronics</label>
          <input
            type="date"
            className="form-control"
            value={newProfessional.fechaEgresoGetronics}
            onChange={(e) =>
              setNewProfessional({
                ...newProfessional,
                fechaEgresoGetronics: e.target.value,
              })
            }
          />
        </div>
        <div className="col-md-4">
          <label>Activo</label>
          <input
            type="checkbox"
            checked={newProfessional.activo}
            onChange={(e) =>
              setNewProfessional({
                ...newProfessional,
                activo: e.target.checked,
              })
            }
          />
        </div>
        <div className="col-md-4">
          <label>Referido</label>
          <input
            type="checkbox"
            checked={newProfessional.referido}
            onChange={(e) =>
              setNewProfessional({
                ...newProfessional,
                referido: e.target.checked,
              })
            }
          />
        </div>
        <div className="col-md-4">
          <label>Lista Negra</label>
          <input
            type="checkbox"
            checked={newProfessional.listaNegra}
            onChange={(e) =>
              setNewProfessional({
                ...newProfessional,
                listaNegra: e.target.checked,
              })
            }
          />
        </div>
        <div className="col-md-4">
          <label>Cliente (Seleccionar)</label>
          <select
            className="form-control"
            value={newProfessional.cliente?.id || ""}
            onChange={(e) => {
              const selectedClient = clientes.find(cliente => cliente.id === parseInt(e.target.value));
              setNewProfessional({
                ...newProfessional,
                cliente: selectedClient || { id: "", razonSocial: "", rut: "", rubro: "", activo: false },
              });
            }}
          >
            <option value="">Seleccione un cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.razonSocial} {/* Muestra la razón social del cliente */}
              </option>
            ))}
          </select>
        </div>

        {/* Sección de Habilidades */}
        <h3>Agregar Habilidad Tecnológica</h3>
        <div className="col-md-4">
          <label>Habilidad Tecnológica</label>
          <select
            className="form-control"
            value={newHabilidad.nombre}
            onChange={(e) => setNewHabilidad({ ...newHabilidad, nombre: e.target.value })}
          >
            <option value="">Seleccionar habilidad</option>
            {habilidades.map((habilidad) => (
              <option key={habilidad.id} value={habilidad.nombre}>
                {habilidad.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label>Nivel de Competencia</label>
          <select
            className="form-control"
            value={newHabilidad.nivelCompetencia}
            onChange={(e) => setNewHabilidad({ ...newHabilidad, nivelCompetencia: e.target.value })}
          >
            <option value="">Seleccionar nivel</option>
            <option value="Avanzado">Avanzado</option>
            <option value="Medio">Medio</option>
            <option value="Básico">Básico</option>
          </select>
        </div>
        <div className="col-12">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={addHabilidad}
          >
            Agregar Habilidad
          </button>
        </div>

        {/* Lista de Habilidades Agregadas */}
        <div>
          <h5>Habilidades Agregadas:</h5>
          <ul>
            {newProfessional.conocimientoTecnicoProfesional.map((habilidad, index) => (
              <li key={index}>
                {habilidad.nombre} - {habilidad.nivelCompetencia}
              </li>
            ))}
          </ul>
        </div>

        {/* Sección de Idiomas */}
        <h3>Agregar Idioma</h3>
        <div className="col-md-4">
          <label>Idioma</label>
          <select
            className="form-control"
            value={newIdioma.nombre}
            onChange={(e) => setNewIdioma({ ...newIdioma, nombre: e.target.value })}
          >
            <option value="">Seleccionar idioma</option>
            {idiomas.map((idioma) => (
              <option key={idioma.id} value={idioma.nombre}>
                {idioma.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label>Nivel de Dominio</label>
          <select
            className="form-control"
            value={newIdioma.nivelDominio}
            onChange={(e) => setNewIdioma({ ...newIdioma, nivelDominio: e.target.value })}
          >
            <option value="">Seleccionar nivel</option>
            <option value="Avanzado">Avanzado</option>
            <option value="Medio">Medio</option>
            <option value="Básico">Básico</option>
          </select>
        </div>
        <div className="col-12">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={addIdioma}
          >
            Agregar Idioma
          </button>
        </div>

        {/* Lista de Idiomas Agregados */}
        <div className="col-12">
          <h5>Idiomas Agregados:</h5>
          <ul>
            {newProfessional.idiomasProfesional.map((idioma, index) => (
              <li key={index}>{idioma.nombre} - Nivel: {idioma.nivelDominio}</li>
            ))}
          </ul>
        </div>

        {/* Sección de Formación Académica */}
        <h3>Agregar Formación Académica</h3>
        <div className="col-md-4">
          <label>Carrera</label>
          <input
            type="text"
            className="form-control"
            value={newFormacion.carrera}
            onChange={(e) =>
              setNewFormacion({ ...newFormacion, carrera: e.target.value })
            }
          />
        </div>
        <div className="col-md-4">
          <label>Institución</label>
          <input
            type="text"
            className="form-control"
            value={newFormacion.institucion}
            onChange={(e) =>
              setNewFormacion({ ...newFormacion, institucion: e.target.value })
            }
          />
        </div>
        <div className="col-md-4">
          <label>Año de Inicio</label>
          <input
            type="number"
            className="form-control"
            value={newFormacion.anioInicio}
            onChange={(e) =>
              setNewFormacion({ ...newFormacion, anioInicio: e.target.value })
            }
          />
        </div>
        <div className="col-md-4">
          <label>Año de Fin</label>
          <input
            type="number"
            className="form-control"
            value={newFormacion.anioFin}
            onChange={(e) =>
              setNewFormacion({ ...newFormacion, anioFin: e.target.value })
            }
          />
        </div>
        <div className="col-12">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={addFormacion}
          >
            Agregar Formación
          </button>
        </div>

        {/* Lista de Formación Académica Agregada */}
        <div className="col-12">
          <h5>Formación Académica Agregada:</h5>
          <ul>
            {newProfessional.formacionAcademicaProfesional.map((formacion, index) => (
              <li key={index}>{formacion.carrera} en {formacion.institucion} ({formacion.anioInicio} - {formacion.anioFin})</li>
            ))}
          </ul>
        </div>

        {/* Sección de Certificación */}
        <h3>Agregar Certificación</h3>
        <div className="col-md-4">
          <label>Nombre de Certificación</label>
          <input
            type="text"
            className="form-control"
            value={newCertificacion.nombreCertificacion}
            onChange={(e) =>
              setNewCertificacion({
                ...newCertificacion,
                nombreCertificacion: e.target.value,
              })
            }
          />
        </div>
        <div className="col-md-4">
          <label>Institución Emisora</label>
          <input
            type="text"
            className="form-control"
            value={newCertificacion.institucionEmisora}
            onChange={(e) =>
              setNewCertificacion({
                ...newCertificacion,
                institucionEmisora: e.target.value,
              })
            }
          />
        </div>
        <div className="col-md-4">
          <label>Fecha de Emisión</label>
          <input
            type="date"
            className="form-control"
            value={newCertificacion.fechaEmision}
            onChange={(e) =>
              setNewCertificacion({
                ...newCertificacion,
                fechaEmision: e.target.value,
              })
            }
          />
        </div>
        <div className="col-md-4">
          <label>Fecha de Vencimiento</label>
          <input
            type="date"
            className="form-control"
            value={newCertificacion.fechaVencimiento}
            onChange={(e) =>
              setNewCertificacion({
                ...newCertificacion,
                fechaVencimiento: e.target.value,
              })
            }
          />
        </div>
        <div className="col-12">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={addCertificacion}
          >
            Agregar Certificación
          </button>
        </div>

        {/* Lista de Certificaciones Agregadas */}
        <div className="col-12">
          <h5>Certificaciones Agregadas:</h5>
          <ul>
            {newProfessional.certificacionProfesional.map((certificacion, index) => (
              <li key={index}>{certificacion.nombreCertificacion} de {certificacion.institucionEmisora} (Emitido: {certificacion.fechaEmision}, Vencimiento: {certificacion.fechaVencimiento})</li>
            ))}
          </ul>
        </div>

        {/* Botón de envío */}
        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Agregar Profesional
          </button>
        </div>
      </form>

      {/* Resumen del Profesional */}
      {professionalSummary && (
        <div className="mt-5">
          <div className="card shadow-lg rounded">
            <div className="card-header bg-primary text-white">
              <h5>Resumen del Profesional Agregado</h5>
            </div>
            <div className="card-body">
              <ul>
                <li>
                  <strong>RUT:</strong> {professionalSummary.rut}
                </li>
                <li>
                  <strong>ID SAP:</strong> {professionalSummary.idSAP}
                </li>
                <li>
                  <strong>Nombres:</strong> {professionalSummary.nombres} {professionalSummary.apaterno} {professionalSummary.amaterno}
                </li>
                <li>
                  <strong>Fecha de Nacimiento:</strong> {professionalSummary.fechaNacimiento}
                </li>
                <li>
                  <strong>Dirección:</strong> {professionalSummary.direccion}
                </li>
                <li>
                  <strong>Teléfono:</strong> {professionalSummary.telefono}
                </li>
                <li>
                  <strong>Correo Electrónico:</strong> {professionalSummary.correoElectronico}
                </li>
                <li>
                  <strong>Años de Experiencia:</strong> {professionalSummary.anioExperiencia}
                </li>
                <li>
                  <strong>Nivel de Experiencia:</strong> {professionalSummary.nivelExperiencia}
                </li>
                <li>
                  <strong>Fecha de Ingreso a Getronics:</strong> {professionalSummary.fechaIngresoGetronics}
                </li>
                <li>
                  <strong>Fecha de Egreso de Getronics:</strong> {professionalSummary.fechaEgresoGetronics}
                </li>
                <li>
                  <strong>Activo:</strong> {professionalSummary.activo ? "Sí" : "No"}
                </li>
                <li>
                  <strong>Referido:</strong> {professionalSummary.referido ? "Sí" : "No"}
                </li>
                <li>
                  <strong>Lista Negra:</strong> {professionalSummary.listaNegra ? "Sí" : "No"}
                </li>
                <li>
                  <strong>Cliente ID:</strong> {professionalSummary.cliente.id}
                </li>
                <li>
                  <strong>Habilidades:</strong>
                  <ul>
                    {professionalSummary.conocimientoTecnicoProfesional.map((habilidad, index) => (
                      <li key={index}>{habilidad.nombre} - {habilidad.nivelCompetencia}</li>
                    ))}
                  </ul>
                </li>
                <li>
                  <strong>Idiomas:</strong>
                  <ul>
                    {professionalSummary.idiomasProfesional.map((idioma, index) => (
                      <li key={index}>{idioma.nombre} - Nivel: {idioma.nivelDominio}</li>
                    ))}
                  </ul>
                </li>
                <li>
                  <strong>Formación Académica:</strong>
                  <ul>
                    {professionalSummary.formacionAcademicaProfesional.map((formacion, index) => (
                      <li key={index}>{formacion.carrera} en {formacion.institucion} ({formacion.anioInicio} - {formacion.anioFin})</li>
                    ))}
                  </ul>
                </li>
                <li>
                  <strong>Certificaciones:</strong>
                  <ul>
                    {professionalSummary.certificacionProfesional.map((certificacion, index) => (
                      <li key={index}>{certificacion.nombreCertificacion} de {certificacion.institucionEmisora} (Emitido: {certificacion.fechaEmision}, Vencimiento: {certificacion.fechaVencimiento})</li>
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