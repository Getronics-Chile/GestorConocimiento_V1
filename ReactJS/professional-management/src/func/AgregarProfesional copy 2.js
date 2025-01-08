import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../node_modules/font-awesome/css/font-awesome.min.css";

const APIURL = "http://localhost:8000";

function AddProfessional() {
  // Inicializa el estado para el profesional
  const [newProfessional, setNewProfessional] = useState({
    id: 0,
    idSap: 0,
    rut: "",
    nombres: "",
    apaterno: "",
    amaterno: "",
    fechaNacimiento: "",
    direccion: "",
    correoElectronico: "",
    telefono: "",
    anioExperiencia: 0,
    perfilProfesional: "",
    nivelExperiencia: "",
    fechaIngresoGetronics: "",
    fechaEgresoGetronics: "",
    referido: true,
    estadoProfesional: "ACTIVO",
    fotografia: [],
    conocimientoProfesional: [],
    formacionAcademicaProfesional: [],
    idiomasProfesional: [],
    experienciaLaboralProfesional: [],
    certificacionProfesional: [],
    referenciaProfesional: [],
    publicacionesProfesional: [],
    rrssPortafolioProfesional: [],
    proyectos: [],
    jefeServicio: { id: 0, profesionalesAsignados: [] },
  });

  const [newHabilidad, setNewHabilidad] = useState({
    habilidad: "",
    tipoHabilidad: "",
    aniosExperiencia: "",
    nivelCompetencia: "",
  });

  const [newIdioma, setNewIdioma] = useState({
    nombre: "",
    nivelDominio: "",
  });

  const [newFormacion, setNewFormacion] = useState({
    carrera: "",
    institucion: "",
    anioInicio: 0,
    anioFin: 0,
  });

  const [newCertificacion, setNewCertificacion] = useState({
    nombreCertificacion: "",
    institucionEmisora: "",
    fechaEmision: "",
    fechaVencimiento: "",
  });

  const [newReferencia, setNewReferencia] = useState({
    nombreReferente: "",
    cargo: "",
    empresa: "",
    telefonoContacto: "",
    relacionCandidato: "",
  });

  const [newPublicacion, setNewPublicacion] = useState({
    tituloPublicacion: "",
    descripcion: "",
    fechaPublicacion: "",
    medioPublicacion: "",
    enlacePublicacion: "",
  });

  // Actualiza la foto del profesional
  const handleFotografiaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Fotografia = reader.result.split(',')[1];
        setNewProfessional((prev) => ({ ...prev, fotografia: [base64Fotografia] })); // Guarda como un array
      };
      reader.readAsDataURL(file);
    }
  };

  const addHabilidad = () => {
    if (newHabilidad.habilidad && newHabilidad.tipoHabilidad && newHabilidad.nivelCompetencia) {
      setNewProfessional((prevState) => ({
        ...prevState,
        conocimientoProfesional: [
          ...prevState.conocimientoProfesional,
          { id: 0, profesional: "", ...newHabilidad },
        ],
      }));
      setNewHabilidad({
        habilidad: "",
        tipoHabilidad: "",
        aniosExperiencia: "",
        nivelCompetencia: "",
      });
    } else {
      alert("Por favor completa todos los campos de habilidad antes de agregar.");
    }
  };

  const addIdioma = () => {
    if (newIdioma.nombre && newIdioma.nivelDominio) {
      setNewProfessional((prevState) => ({
        ...prevState,
        idiomasProfesional: [
          ...prevState.idiomasProfesional,
          { id: 0, profesional: "", ...newIdioma },
        ],
      }));
      setNewIdioma({ nombre: "", nivelDominio: "" });
    } else {
      alert("Por favor completa todos los campos de idioma antes de agregar.");
    }
  };

  const addFormacion = () => {
    if (newFormacion.carrera && newFormacion.institucion && newFormacion.anioInicio && newFormacion.anioFin) {
      setNewProfessional((prevState) => ({
        ...prevState,
        formacionAcademicaProfesional: [
          ...prevState.formacionAcademicaProfesional,
          { id: 0, profesional: "", ...newFormacion },
        ],
      }));
      setNewFormacion({ carrera: "", institucion: "", anioInicio: 0, anioFin: 0 });
    } else {
      alert("Por favor completa todos los campos de formación antes de agregar.");
    }
  };

  const addCertificacion = () => {
    if (newCertificacion.nombreCertificacion && newCertificacion.institucionEmisora && newCertificacion.fechaEmision && newCertificacion.fechaVencimiento) {
      setNewProfessional((prevState) => ({
        ...prevState,
        certificacionProfesional: [
          ...prevState.certificacionProfesional,
          { id: 0, profesional: "", ...newCertificacion },
        ],
      }));
      setNewCertificacion({
        nombreCertificacion: "",
        institucionEmisora: "",
        fechaEmision: "",
        fechaVencimiento: "",
      });
    } else {
      alert("Por favor completa todos los campos de certificación antes de agregar.");
    }
  };

  const addReferencia = () => {
    if (newReferencia.nombreReferente && newReferencia.cargo && newReferencia.empresa && newReferencia.telefonoContacto && newReferencia.relacionCandidato) {
      setNewProfessional((prevState) => ({
        ...prevState,
        referenciaProfesional: [
          ...prevState.referenciaProfesional,
          { id: 0, profesional: "", ...newReferencia },
        ],
      }));
      setNewReferencia({
        nombreReferente: "",
        cargo: "",
        empresa: "",
        telefonoContacto: "",
        relacionCandidato: "",
      });
    } else {
      alert("Por favor completa todos los campos de referencia antes de agregar.");
    }
  };

  const addPublicacion = () => {
    if (newPublicacion.tituloPublicacion && newPublicacion.descripcion && newPublicacion.fechaPublicacion && newPublicacion.medioPublicacion && newPublicacion.enlacePublicacion) {
      setNewProfessional((prevState) => ({
        ...prevState,
        publicacionesProfesional: [
          ...prevState.publicacionesProfesional,
          { id: 0, profesional: "", ...newPublicacion },
        ],
      }));
      setNewPublicacion({
        tituloPublicacion: "",
        descripcion: "",
        fechaPublicacion: "",
        medioPublicacion: "",
        enlacePublicacion: "",
      });
    } else {
      alert("Por favor completa todos los campos de publicación antes de agregar.");
    }
  };

  const addProfessional = async () => {
    try {
      const professionalData = { ...newProfessional };

      await axios.post(`${APIURL}/api/profesional/crear`, professionalData, {
        headers: { "Content-Type": "application/json" },
      });

      alert("Profesional agregado exitosamente");

      setNewProfessional({
        id: 0,
        idSap: 0,
        rut: "",
        nombres: "",
        apaterno: "",
        amaterno: "",
        fechaNacimiento: "",
        direccion: "",
        correoElectronico: "",
        telefono: "",
        anioExperiencia: 0,
        perfilProfesional: "",
        nivelExperiencia: "",
        fechaIngresoGetronics: "",
        fechaEgresoGetronics: "",
        referido: true,
        estadoProfesional: "ACTIVO",
        fotografia: [],
        conocimientoProfesional: [],
        formacionAcademicaProfesional: [],
        idiomasProfesional: [],
        experienciaLaboralProfesional: [],
        certificacionProfesional: [],
        referenciaProfesional: [],
        publicacionesProfesional: [],
        rrssPortafolioProfesional: [],
        proyectos: [],
        jefeServicio: { id: 0, profesionalesAsignados: [] },
      });
    } catch (error) {
      console.error("Error al agregar profesional:", error);
      alert("Error al agregar profesional.");
    }
  };

  return (
    <div>
      <h1>Agregar Profesional</h1>
      <hr />
      <form onSubmit={(e) => { e.preventDefault(); addProfessional(); }}>
        {/* Información básica */}
        <div className="row">
          <div className="col-md-4"><label>RUT</label><input type="text" className="form-control" value={newProfessional.rut} onChange={(e) => setNewProfessional({ ...newProfessional, rut: e.target.value })} /></div>
          <div className="col-md-4"><label>Nombres</label><input type="text" className="form-control" value={newProfessional.nombres} onChange={(e) => setNewProfessional({ ...newProfessional, nombres: e.target.value })} /></div>
          <div className="col-md-4"><label>Apellido Paterno</label><input type="text" className="form-control" value={newProfessional.apaterno} onChange={(e) => setNewProfessional({ ...newProfessional, apaterno: e.target.value })} /></div>
          <div className="col-md-4"><label>Apellido Materno</label><input type="text" className="form-control" value={newProfessional.amaterno} onChange={(e) => setNewProfessional({ ...newProfessional, amaterno: e.target.value })} /></div>
          <div className="col-md-4"><label>Fecha de Nacimiento</label><input type="date" className="form-control" value={newProfessional.fechaNacimiento} onChange={(e) => setNewProfessional({ ...newProfessional, fechaNacimiento: e.target.value })} /></div>
          <div className="col-md-4"><label>Dirección</label><input type="text" className="form-control" value={newProfessional.direccion} onChange={(e) => setNewProfessional({ ...newProfessional, direccion: e.target.value })} /></div>
          <div className="col-md-4"><label>Teléfono</label><input type="text" className="form-control" value={newProfessional.telefono} onChange={(e) => setNewProfessional({ ...newProfessional, telefono: e.target.value })} /></div>
          <div className="col-md-4"><label>Correo Electrónico</label><input type="email" className="form-control" value={newProfessional.correoElectronico} onChange={(e) => setNewProfessional({ ...newProfessional, correoElectronico: e.target.value })} /></div>
          <div className="col-md-4"><label>Años de Experiencia</label><input type="number" className="form-control" value={newProfessional.anioExperiencia} onChange={(e) => setNewProfessional({ ...newProfessional, anioExperiencia: e.target.value })} /></div>
          <div className="col-md-4"><label>Nivel de Experiencia</label><input type="text" className="form-control" value={newProfessional.nivelExperiencia} onChange={(e) => setNewProfessional({ ...newProfessional, nivelExperiencia: e.target.value })} /></div>
          <div className="col-md-4"><label>Fecha de Ingreso a Getronics</label><input type="date" className="form-control" value={newProfessional.fechaIngresoGetronics} onChange={(e) => setNewProfessional({ ...newProfessional, fechaIngresoGetronics: e.target.value })} /></div>
          <div className="col-md-4"><label>Fecha de Egreso de Getronics</label><input type="date" className="form-control" value={newProfessional.fechaEgresoGetronics} onChange={(e) => setNewProfessional({ ...newProfessional, fechaEgresoGetronics: e.target.value })} /></div>
          <div className="col-md-4">
            <label>Referido</label>
            <input type="checkbox" checked={newProfessional.referido} onChange={(e) => setNewProfessional({ ...newProfessional, referido: e.target.checked })} />
          </div>
          <div className="col-md-4"><label>Nacionalidad</label><input type="text" className="form-control" value={newProfessional.nacionalidad} onChange={(e) => setNewProfessional({ ...newProfessional, nacionalidad: e.target.value })} /></div>
          <div className="col-md-4"><label>Perfil profesional</label><input type="text" className="form-control" value={newProfessional.perfilProfesional} onChange={(e) => setNewProfessional({ ...newProfessional, perfilProfesional: e.target.value })} /></div>
          <div className="col-md-4">
            <label>Fotografía</label>
            <input type="file" className="form-control" onChange={handleFotografiaChange} />
          </div>
        </div>

        {/* Habilidades */}
        <h3>Agregar Habilidad Tecnológica</h3>
        <div className="row">
          <div className="col-md-4"><label>Habilidad</label><input type="text" className="form-control" value={newHabilidad.habilidad} onChange={(e) => setNewHabilidad({ ...newHabilidad, habilidad: e.target.value })} /></div>
          <div className="col-md-4">
            <label>Tipo de Habilidad</label>
            <select className="form-control" value={newHabilidad.tipoHabilidad} onChange={(e) => setNewHabilidad({ ...newHabilidad, tipoHabilidad: e.target.value })}>
              <option value="">Seleccionar tipo</option>
              <option value="HABILIDAD">Habilidad</option>
              <option value="CONOCIMIENTO">Conocimiento</option>
              <option value="NEGOCIO">Certificación</option>
            </select>
          </div>
          <div className="col-md-4"><label>Años de Experiencia</label><input type="text" className="form-control" value={newHabilidad.aniosExperiencia} onChange={(e) => setNewHabilidad({ ...newHabilidad, aniosExperiencia: e.target.value })} /></div>
          <div className="col-md-4">
            <label>Nivel de Competencia</label>
            <select className="form-control" value={newHabilidad.nivelCompetencia} onChange={(e) => setNewHabilidad({ ...newHabilidad, nivelCompetencia: e.target.value })}>
              <option value="">Seleccionar nivel</option>
              <option value="BASICO">Básico</option>
              <option value="MEDIO">Medio</option>
              <option value="AVANZADO">Avanzado</option>
            </select>
          </div>
          <div className="col-12">
            <button type="button" className="btn btn-secondary" onClick={addHabilidad}>Agregar Habilidad</button>
          </div>
        </div>

        <h5>Conocimientos del Profesional:</h5>
        <ul>
          {newProfessional.conocimientoProfesional.map((conocimiento, index) => (
            <li key={index}>{conocimiento.habilidad} - {conocimiento.tipoHabilidad} - {conocimiento.aniosExperiencia} años de experiencia - Nivel: {conocimiento.nivelCompetencia}</li>
          ))}
        </ul>

        {/* Idiomas */}
        <h3>Agregar Idioma</h3>
        <div className="row">
          <div className="col-md-4">
            <label>Idioma</label>
            <input type="text" className="form-control" value={newIdioma.nombre} onChange={(e) => setNewIdioma({ ...newIdioma, nombre: e.target.value })} />
          </div>
          <div className="col-md-4">
            <label>Nivel de Dominio</label>
            <select className="form-control" value={newIdioma.nivelDominio} onChange={(e) => setNewIdioma({ ...newIdioma, nivelDominio: e.target.value })}>
              <option value="">Seleccionar nivel</option>
              <option value="Avanzado">Avanzado</option>
              <option value="Medio">Medio</option>
              <option value="Básico">Básico</option>
            </select>
          </div>
          <div className="col-12">
            <button type="button" className="btn btn-secondary" onClick={addIdioma}>Agregar Idioma</button>
          </div>
        </div>

        <h5>Idiomas Agregados:</h5>
        <ul>
          {newProfessional.idiomasProfesional.map((idioma, index) => (
            <li key={index}>{idioma.nombre} - Nivel: {idioma.nivelDominio}</li>
          ))}
        </ul>

        {/* Formación Académica */}
        <h3>Agregar Formación Académica</h3>
        <div className="row">
          <div className="col-md-4"><label>Carrera</label><input type="text" className="form-control" value={newFormacion.carrera} onChange={(e) => setNewFormacion({ ...newFormacion, carrera: e.target.value })} /></div>
          <div className="col-md-4"><label>Institución</label><input type="text" className="form-control" value={newFormacion.institucion} onChange={(e) => setNewFormacion({ ...newFormacion, institucion: e.target.value })} /></div>
          <div className="col-md-4"><label>Año de Inicio</label><input type="number" className="form-control" value={newFormacion.anioInicio} onChange={(e) => setNewFormacion({ ...newFormacion, anioInicio: parseInt(e.target.value || 0) })} /></div>
          <div className="col-md-4"><label>Año de Fin</label><input type="number" className="form-control" value={newFormacion.anioFin} onChange={(e) => setNewFormacion({ ...newFormacion, anioFin: parseInt(e.target.value || 0) })} /></div>
          <div className="col-12">
            <button type="button" className="btn btn-secondary" onClick={addFormacion}>Agregar Formación</button>
          </div>
        </div>

        <h5>Formación Académica Agregada:</h5>
        <ul>
          {newProfessional.formacionAcademicaProfesional.map((formacion, index) => (
            <li key={index}>{formacion.carrera} en {formacion.institucion} ({formacion.anioInicio} - {formacion.anioFin})</li>
          ))}
        </ul>

        {/* Certificaciones */}
        <h3>Agregar Certificación</h3>
        <div className="row">
          <div className="col-md-4"><label>Nombre de Certificación</label><input type="text" className="form-control" value={newCertificacion.nombreCertificacion} onChange={(e) => setNewCertificacion({ ...newCertificacion, nombreCertificacion: e.target.value })} /></div>
          <div className="col-md-4"><label>Institución Emisora</label><input type="text" className="form-control" value={newCertificacion.institucionEmisora} onChange={(e) => setNewCertificacion({ ...newCertificacion, institucionEmisora: e.target.value })} /></div>
          <div className="col-md-4"><label>Fecha de Emisión</label><input type="date" className="form-control" value={newCertificacion.fechaEmision} onChange={(e) => setNewCertificacion({ ...newCertificacion, fechaEmision: e.target.value })} /></div>
          <div className="col-md-4"><label>Fecha de Vencimiento</label><input type="date" className="form-control" value={newCertificacion.fechaVencimiento} onChange={(e) => setNewCertificacion({ ...newCertificacion, fechaVencimiento: e.target.value })} /></div>
          <div className="col-12">
            <button type="button" className="btn btn-secondary" onClick={addCertificacion}>Agregar Certificación</button>
          </div>
        </div>

        <h5>Certificaciones Agregadas:</h5>
        <ul>
          {newProfessional.certificacionProfesional.map((certificacion, index) => (
            <li key={index}>{certificacion.nombreCertificacion} de {certificacion.institucionEmisora} (Emitido: {certificacion.fechaEmision}, Vencimiento: {certificacion.fechaVencimiento})</li>
          ))}
        </ul>

        {/* Referencias */}
        <h3>Agregar Referencia Profesional</h3>
        <div className="row">
          <div className="col-md-4"><label>Nombre del Referente</label><input type="text" className="form-control" value={newReferencia.nombreReferente} onChange={(e) => setNewReferencia({ ...newReferencia, nombreReferente: e.target.value })} /></div>
          <div className="col-md-4"><label>Cargo</label><input type="text" className="form-control" value={newReferencia.cargo} onChange={(e) => setNewReferencia({ ...newReferencia, cargo: e.target.value })} /></div>
          <div className="col-md-4"><label>Empresa</label><input type="text" className="form-control" value={newReferencia.empresa} onChange={(e) => setNewReferencia({ ...newReferencia, empresa: e.target.value })} /></div>
          <div className="col-md-4"><label>Teléfono de Contacto</label><input type="text" className="form-control" value={newReferencia.telefonoContacto} onChange={(e) => setNewReferencia({ ...newReferencia, telefonoContacto: e.target.value })} /></div>
          <div className="col-md-4"><label>Relación con el Candidato</label><input type="text" className="form-control" value={newReferencia.relacionCandidato} onChange={(e) => setNewReferencia({ ...newReferencia, relacionCandidato: e.target.value })} /></div>
          <div className="col-12">
            <button type="button" className="btn btn-secondary" onClick={addReferencia}>Agregar Referencia</button>
          </div>
        </div>

        <h5>Referencias Agregadas:</h5>
        <ul>
          {newProfessional.referenciaProfesional.map((referencia, index) => (
            <li key={index}>{referencia.nombreReferente} - {referencia.cargo} en {referencia.empresa}</li>
          ))}
        </ul>

        {/* Publicaciones */}
        <h3>Agregar Publicación Profesional</h3>
        <div className="row">
          <div className="col-md-4"><label>Título de la Publicación</label><input type="text" className="form-control" value={newPublicacion.tituloPublicacion} onChange={(e) => setNewPublicacion({ ...newPublicacion, tituloPublicacion: e.target.value })} /></div>
          <div className="col-md-4"><label>Descripción</label><input type="text" className="form-control" value={newPublicacion.descripcion} onChange={(e) => setNewPublicacion({ ...newPublicacion, descripcion: e.target.value })} /></div>
          <div className="col-md-4"><label>Fecha de Publicación</label><input type="date" className="form-control" value={newPublicacion.fechaPublicacion} onChange={(e) => setNewPublicacion({ ...newPublicacion, fechaPublicacion: e.target.value })} /></div>
          <div className="col-md-4"><label>Medio de Publicación</label><input type="text" className="form-control" value={newPublicacion.medioPublicacion} onChange={(e) => setNewPublicacion({ ...newPublicacion, medioPublicacion: e.target.value })} /></div>
          <div className="col-md-4"><label>Enlace de Publicación</label><input type="text" className="form-control" value={newPublicacion.enlacePublicacion} onChange={(e) => setNewPublicacion({ ...newPublicacion, enlacePublicacion: e.target.value })} /></div>
          <div className="col-12">
            <button type="button" className="btn btn-secondary" onClick={addPublicacion}>Agregar Publicación</button>
          </div>
        </div>

        <h5>Publicaciones Agregadas:</h5>
        <ul>
          {newProfessional.publicacionesProfesional.map((publicacion, index) => (
            <li key={index}>{publicacion.tituloPublicacion} - {publicacion.medioPublicacion}</li>
          ))}
        </ul>

        {/* Botón de envío */}
        <div className="col-12">
          <button type="submit" className="btn btn-primary">Agregar Profesional</button>
        </div>
      </form>
    </div>
  );
}

export default AddProfessional;