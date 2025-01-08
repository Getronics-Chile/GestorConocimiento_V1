import React, { useState, useEffect } from "react";
import axios from "axios";

const APIURL = "http://localhost:8000";

function ProfesionalForm() {
  const [profesionales, setProfesionales] = useState([]);
  const [newProfesional, setNewProfesional] = useState({
    idSap: null,
    rut: "",
    nombres: "",
    apaterno: "",
    amaterno: "",
    fechaNacimiento: "",
    nacionalidad: "",
    direccion: "",
    telefono: "",
    correoElectronico: "",
    anioExperiencia: null,
    perfilProfesional: "",
    nivelExperiencia: "",
    fechaIngresoGetronics: "",
    fechaEgresoGetronics: "",
    referido: false,
    estadoProfesional: null,
    fotografia: "",
    conocimientoProfesional: [],
    formacionAcademicaProfesional: [],
    idiomasProfesional: [],
    experienciaLaboralProfesional: [],
    certificacionProfesional: [],
    referenciaProfesional: [],
    publicacionesProfesional: [],
    rrssPortafolioProfesional: [],
    proyectos: [],
    jefeServicio: {}
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProfesional, setEditingProfesional] = useState(null);

  const getProfesionales = async () => {
    try {
      const response = await axios.get(`${APIURL}/api/profesional/listarTodos`);
      setProfesionales(response.data);
    } catch (error) {
      console.error("Error al obtener profesionales:", error);
    }
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Foto = reader.result.split(',')[1];
        setNewProfesional({ ...newProfesional, fotografia: base64Foto });
      };
      reader.readAsDataURL(file);
    }
  };

  const addOrUpdateProfesional = async () => {
    try {
      if (editingProfesional) {
        await axios.put(
          `${APIURL}/api/profesional/actualizar/${editingProfesional.id}`,
          newProfesional,
          { headers: { "Content-Type": "application/json" } }
        );
        alert("Profesional actualizado exitosamente.");
      } else {
        await axios.post(
          `${APIURL}/api/profesional/crear`,
          newProfesional,
          { headers: { "Content-Type": "application/json" } }
        );
        alert("Profesional agregado exitosamente.");
      }

      resetForm();
      getProfesionales();
    } catch (error) {
      console.error("Error al guardar profesional:", error);
      alert("Error al guardar profesional.");
    }
  };

  const resetForm = () => {
    setNewProfesional({
      idSap: 0,
      rut: "",
      nombres: "",
      apaterno: "",
      amaterno: "",
      fechaNacimiento: "",
      nacionalidad: "",
      direccion: "",
      telefono: "",
      correoElectronico: "",
      anioExperiencia: 0,
      perfilProfesional: "",
      nivelExperiencia: "",
      fechaIngresoGetronics: "",
      fechaEgresoGetronics: "",
      referido: false,
      estadoProfesional: 1,
      fotografia: "",
      conocimientoProfesional: [],
      formacionAcademicaProfesional: [],
      idiomasProfesional: [],
      experienciaLaboralProfesional: [],
      certificacionProfesional: [],
      referenciaProfesional: [],
      publicacionesProfesional: [],
      rrssPortafolioProfesional: [],
      proyectos: [],
      jefeServicio: {}
    });
    setEditingProfesional(null);
  };

  const editProfesional = (profesional) => {
    setEditingProfesional(profesional);
    setNewProfesional(profesional);
  };

  const handleJsonUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target.result);
          setNewProfesional((prev) => ({
            ...prev,
            ...jsonData
          }));
          alert("Archivo JSON cargado exitosamente.");
        } catch (error) {
          console.error("Error al leer el archivo JSON:", error);
          alert("El archivo no es un JSON válido.");
        }
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    getProfesionales();
  }, []);

  return (
    <div>
      <h1>{editingProfesional ? "Modificar Profesional" : "Agregar Profesional"}</h1>

      <form
        className="row g-3 mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          addOrUpdateProfesional();
        }}
      >
        {/* Campos del profesional */}


        {/* Formulario de subida de JSON */}
        <div className="mb-4">
          <label htmlFor="uploadJson" className="form-label">Cargar datos desde archivo JSON</label>
          <input
            type="file"
            id="uploadJson"
            className="form-control"
            accept=".json"
            onChange={handleJsonUpload}
          />

        </div>

        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="RUT"
            value={newProfesional.rut}
            onChange={(e) => setNewProfesional({ ...newProfesional, rut: e.target.value })}
            required
          />
        </div>

        <div className="col-md-4">
          <input
            type="number"
            className="form-control"
            placeholder="Id Sap"
            value={newProfesional.idSap}
            onChange={(e) => setNewProfesional({ ...newProfesional, idSap: e.target.value })}
            required
          />
        </div>

        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Nombres"
            value={newProfesional.nombres}
            onChange={(e) => setNewProfesional({ ...newProfesional, nombres: e.target.value })}
            required
          />
        </div>

        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Apellido Paterno"
            value={newProfesional.apaterno}
            onChange={(e) => setNewProfesional({ ...newProfesional, apaterno: e.target.value })}
            
          />
        </div>

        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Apellido Materno"
            value={newProfesional.amaterno}
            onChange={(e) => setNewProfesional({ ...newProfesional, amaterno: e.target.value })}
          />
        </div>

        <div className="col-md-4">
          <input
            type="date"
            className="form-control"
            placeholder="Fecha de Nacimiento"
            value={newProfesional.fechaNacimiento}
            onChange={(e) => setNewProfesional({ ...newProfesional, fechaNacimiento: e.target.value })}
          />
        </div>

        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Nacionalidad"
            value={newProfesional.nacionalidad}
            onChange={(e) => setNewProfesional({ ...newProfesional, nacionalidad: e.target.value })}
          />
        </div>

        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Dirección"
            value={newProfesional.direccion}
            onChange={(e) => setNewProfesional({ ...newProfesional, direccion: e.target.value })}
          />
        </div>

        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Teléfono"
            value={newProfesional.telefono}
            onChange={(e) => setNewProfesional({ ...newProfesional, telefono: e.target.value })}
          />
        </div>

        <div className="col-md-4">
          <input
            type="email"
            className="form-control"
            placeholder="Correo Electrónico"
            value={newProfesional.correoElectronico}
            onChange={(e) => setNewProfesional({ ...newProfesional, correoElectronico: e.target.value })}
          />
        </div>

        <div className="col-md-4">
          <input
            type="number"
            className="form-control"
            placeholder="Años de Experiencia"
            value={newProfesional.anioExperiencia}
            onChange={(e) => setNewProfesional({ ...newProfesional, anioExperiencia: e.target.value })}
          />
        </div>

        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Perfil Profesional"
            value={newProfesional.perfilProfesional}
            onChange={(e) => setNewProfesional({ ...newProfesional, perfilProfesional: e.target.value })}
          />
        </div>

        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Nivel de Experiencia"
            value={newProfesional.nivelExperiencia}
            onChange={(e) => setNewProfesional({ ...newProfesional, nivelExperiencia: e.target.value })}
          />
        </div>

        <div className="col-md-4">
          <input
            type="date"
            className="form-control"
            placeholder="Fecha de Ingreso a Getronics"
            value={newProfesional.fechaIngresoGetronics}
            onChange={(e) => setNewProfesional({ ...newProfesional, fechaIngresoGetronics: e.target.value })}
          />
        </div>

        <div className="col-md-4">
          <input
            type="date"
            className="form-control"
            placeholder="Fecha de Egreso de Getronics"
            value={newProfesional.fechaEgresoGetronics}
            onChange={(e) => setNewProfesional({ ...newProfesional, fechaEgresoGetronics: e.target.value })}
          />
        </div>

        <div className="col-md-4">
          <label>
            <input
              type="checkbox"
              checked={newProfesional.referido}
              onChange={(e) => setNewProfesional({ ...newProfesional, referido: e.target.checked })}
            />{" "}
            Referido
          </label>
        </div>

        <div className="col-md-4">
          <label>
            <input
              type="checkbox"
              checked={newProfesional.estadoProfesional === 1}
              onChange={(e) => setNewProfesional({ ...newProfesional, estadoProfesional: e.target.checked ? 1 : 0 })}
            />{" "}
            Estado Profesional (1: Activo, 0: Inactivo)
          </label>
        </div>

        <div className="col-md-4">
          <label>Fotografía</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleFotoChange}
            required={!editingProfesional}
          />
        </div>

        {/* Conocimientos Profesionales */}
        <div className="col-12">
          <h5>Conocimientos Profesionales</h5>
          <button type="button" className="btn btn-secondary" onClick={() => {
            const nuevoConocimiento = { aniosExperiencia: 0, habilidad: "", nivelCompetencia: "BASICO", tipoHabilidad: "CONOCIMIENTO" };
            setNewProfesional({ ...newProfesional, conocimientoProfesional: [...newProfesional.conocimientoProfesional, nuevoConocimiento] });
          }}>
            Agregar Conocimiento
          </button>
          {newProfesional.conocimientoProfesional.map((item, index) => (
            <div key={index} className="row mt-2">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Habilidad"
                  value={item.habilidad}
                  onChange={(e) => {
                    const conocimientos = [...newProfesional.conocimientoProfesional];
                    conocimientos[index].habilidad = e.target.value;
                    setNewProfesional({ ...newProfesional, conocimientoProfesional: conocimientos });
                  }}
                />
              </div>
              <div className="col-md-4">
                <select
                  className="form-control"
                  value={item.nivelCompetencia}
                  onChange={(e) => {
                    const conocimientos = [...newProfesional.conocimientoProfesional];
                    conocimientos[index].nivelCompetencia = e.target.value;
                    setNewProfesional({ ...newProfesional, conocimientoProfesional: conocimientos });
                  }}>
                  <option value="BASICO">Básico</option>
                  <option value="INTERMEDIO">Intermedio</option>
                  <option value="AVANZADO">Avanzado</option>
                </select>
              </div>
              <div className="col-md-4">
                <button type="button" className="btn btn-danger" onClick={() => {
                  const conocimientos = newProfesional.conocimientoProfesional.filter((_, i) => i !== index);
                  setNewProfesional({ ...newProfesional, conocimientoProfesional: conocimientos });
                }}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Formación Académica Profesional */}
        <div className="col-12">
          <h5>Formación Académica</h5>
          <button type="button" className="btn btn-secondary" onClick={() => {
            const nuevaFormacion = { anioFin: "", anioInicio: "", carrera: "", institucion: "", situacionAcademica: "" };
            setNewProfesional({ ...newProfesional, formacionAcademicaProfesional: [...newProfesional.formacionAcademicaProfesional, nuevaFormacion] });
          }}>
            Agregar Formación Académica
          </button>
          {newProfesional.formacionAcademicaProfesional.map((item, index) => (
            <div key={index} className="row mt-2">
              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Año Inicio"
                  value={item.anioInicio}
                  onChange={(e) => {
                    const formacion = [...newProfesional.formacionAcademicaProfesional];
                    formacion[index].anioInicio = e.target.value;
                    setNewProfesional({ ...newProfesional, formacionAcademicaProfesional: formacion });
                  }}
                />
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Año Fin"
                  value={item.anioFin}
                  onChange={(e) => {
                    const formacion = [...newProfesional.formacionAcademicaProfesional];
                    formacion[index].anioFin = e.target.value;
                    setNewProfesional({ ...newProfesional, formacionAcademicaProfesional: formacion });
                  }}
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Carrera"
                  value={item.carrera}
                  onChange={(e) => {
                    const formacion = [...newProfesional.formacionAcademicaProfesional];
                    formacion[index].carrera = e.target.value;
                    setNewProfesional({ ...newProfesional, formacionAcademicaProfesional: formacion });
                  }}
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Institución"
                  value={item.institucion}
                  onChange={(e) => {
                    const formacion = [...newProfesional.formacionAcademicaProfesional];
                    formacion[index].institucion = e.target.value;
                    setNewProfesional({ ...newProfesional, formacionAcademicaProfesional: formacion });
                  }}
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Situación Académica"
                  value={item.situacionAcademica}
                  onChange={(e) => {
                    const formacion = [...newProfesional.formacionAcademicaProfesional];
                    formacion[index].situacionAcademica = e.target.value;
                    setNewProfesional({ ...newProfesional, formacionAcademicaProfesional: formacion });
                  }}
                />
              </div>
              <div className="col-md-4">
                <button type="button" className="btn btn-danger" onClick={() => {
                  const formacion = newProfesional.formacionAcademicaProfesional.filter((_, i) => i !== index);
                  setNewProfesional({ ...newProfesional, formacionAcademicaProfesional: formacion });
                }}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Idiomas */}
        <div className="col-12">
          <h5>Idiomas</h5>
          <button type="button" className="btn btn-secondary" onClick={() => {
            const nuevoIdioma = { nombre: "", nivelDominio: "" };
            setNewProfesional({ ...newProfesional, idiomasProfesional: [...newProfesional.idiomasProfesional, nuevoIdioma] });
          }}>
            Agregar Idioma
          </button>
          {newProfesional.idiomasProfesional.map((item, index) => (
            <div key={index} className="row mt-2">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Idioma"
                  value={item.nombre}
                  onChange={(e) => {
                    const idiomas = [...newProfesional.idiomasProfesional];
                    idiomas[index].nombre = e.target.value;
                    setNewProfesional({ ...newProfesional, idiomasProfesional: idiomas });
                  }}
                />
              </div>
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nivel de Dominio"
                  value={item.nivelDominio}
                  onChange={(e) => {
                    const idiomas = [...newProfesional.idiomasProfesional];
                    idiomas[index].nivelDominio = e.target.value;
                    setNewProfesional({ ...newProfesional, idiomasProfesional: idiomas });
                  }}
                />
              </div>
              <div className="col-md-4">
                <button type="button" className="btn btn-danger" onClick={() => {
                  const idiomas = newProfesional.idiomasProfesional.filter((_, i) => i !== index);
                  setNewProfesional({ ...newProfesional, idiomasProfesional: idiomas });
                }}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Experiencia Laboral */}
        <div className="col-12">
          <h5>Experiencia Laboral</h5>
          <button type="button" className="btn btn-secondary" onClick={() => {
            const nuevaExperiencia = { cargo: "", descripcion: "", empresa: "", fechaInicio: "", fechaFin: "" };
            setNewProfesional({ ...newProfesional, experienciaLaboralProfesional: [...newProfesional.experienciaLaboralProfesional, nuevaExperiencia] });
          }}>
            Agregar Experiencia
          </button>
          {newProfesional.experienciaLaboralProfesional.map((item, index) => (
            <div key={index} className="row mt-2">
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cargo"
                  value={item.cargo}
                  onChange={(e) => {
                    const experiencia = [...newProfesional.experienciaLaboralProfesional];
                    experiencia[index].cargo = e.target.value;
                    setNewProfesional({ ...newProfesional, experienciaLaboralProfesional: experiencia });
                  }}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Descripción"
                  value={item.descripcion}
                  onChange={(e) => {
                    const experiencia = [...newProfesional.experienciaLaboralProfesional];
                    experiencia[index].descripcion = e.target.value;
                    setNewProfesional({ ...newProfesional, experienciaLaboralProfesional: experiencia });
                  }}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Empresa"
                  value={item.empresa}
                  onChange={(e) => {
                    const experiencia = [...newProfesional.experienciaLaboralProfesional];
                    experiencia[index].empresa = e.target.value;
                    setNewProfesional({ ...newProfesional, experienciaLaboralProfesional: experiencia });
                  }}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="date"
                  className="form-control"
                  placeholder="Fecha Inicio"
                  value={item.fechaInicio}
                  onChange={(e) => {
                    const experiencia = [...newProfesional.experienciaLaboralProfesional];
                    experiencia[index].fechaInicio = e.target.value;
                    setNewProfesional({ ...newProfesional, experienciaLaboralProfesional: experiencia });
                  }}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="date"
                  className="form-control"
                  placeholder="Fecha Fin"
                  value={item.fechaFin}
                  onChange={(e) => {
                    const experiencia = [...newProfesional.experienciaLaboralProfesional];
                    experiencia[index].fechaFin = e.target.value;
                    setNewProfesional({ ...newProfesional, experienciaLaboralProfesional: experiencia });
                  }}
                />
              </div>
              <div className="col-md-4">
                <button type="button" className="btn btn-danger" onClick={() => {
                  const experiencia = newProfesional.experienciaLaboralProfesional.filter((_, i) => i !== index);
                  setNewProfesional({ ...newProfesional, experienciaLaboralProfesional: experiencia });
                }}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Certificaciones */}
        <div className="col-12">
          <h5>Certificaciones</h5>
          <button type="button" className="btn btn-secondary" onClick={() => {
            const nuevaCertificacion = { fechaEmision: "", fechaVencimiento: "", institucionEmisora: "", nombreCertificacion: "" };
            setNewProfesional({ ...newProfesional, certificacionProfesional: [...newProfesional.certificacionProfesional, nuevaCertificacion] });
          }}>
            Agregar Certificación
          </button>
          {newProfesional.certificacionProfesional.map((item, index) => (
            <div key={index} className="row mt-2">
              <div className="col-md-3">
                <input
                  type="date"
                  className="form-control"
                  placeholder="Fecha Emisión"
                  value={item.fechaEmision}
                  onChange={(e) => {
                    const certificacion = [...newProfesional.certificacionProfesional];
                    certificacion[index].fechaEmision = e.target.value;
                    setNewProfesional({ ...newProfesional, certificacionProfesional: certificacion });
                  }}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="date"
                  className="form-control"
                  placeholder="Fecha Vencimiento"
                  value={item.fechaVencimiento}
                  onChange={(e) => {
                    const certificacion = [...newProfesional.certificacionProfesional];
                    certificacion[index].fechaVencimiento = e.target.value;
                    setNewProfesional({ ...newProfesional, certificacionProfesional: certificacion });
                  }}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Institución Emisora"
                  value={item.institucionEmisora}
                  onChange={(e) => {
                    const certificacion = [...newProfesional.certificacionProfesional];
                    certificacion[index].institucionEmisora = e.target.value;
                    setNewProfesional({ ...newProfesional, certificacionProfesional: certificacion });
                  }}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre Certificación"
                  value={item.nombreCertificacion}
                  onChange={(e) => {
                    const certificacion = [...newProfesional.certificacionProfesional];
                    certificacion[index].nombreCertificacion = e.target.value;
                    setNewProfesional({ ...newProfesional, certificacionProfesional: certificacion });
                  }}
                />
              </div>
              <div className="col-md-4">
                <button type="button" className="btn btn-danger" onClick={() => {
                  const certificacion = newProfesional.certificacionProfesional.filter((_, i) => i !== index);
                  setNewProfesional({ ...newProfesional, certificacionProfesional: certificacion });
                }}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Referencias */}
        <div className="col-12">
          <h5>Referencias</h5>
          <button type="button" className="btn btn-secondary" onClick={() => {
            const nuevaReferencia = { cargo: "", empresa: "", nombreReferente: "", relacionCandidato: "", telefonoContacto: "" };
            setNewProfesional({ ...newProfesional, referenciaProfesional: [...newProfesional.referenciaProfesional, nuevaReferencia] });
          }}>
            Agregar Referencia
          </button>
          {newProfesional.referenciaProfesional.map((item, index) => (
            <div key={index} className="row mt-2">
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cargo"
                  value={item.cargo}
                  onChange={(e) => {
                    const referencia = [...newProfesional.referenciaProfesional];
                    referencia[index].cargo = e.target.value;
                    setNewProfesional({ ...newProfesional, referenciaProfesional: referencia });
                  }}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Empresa"
                  value={item.empresa}
                  onChange={(e) => {
                    const referencia = [...newProfesional.referenciaProfesional];
                    referencia[index].empresa = e.target.value;
                    setNewProfesional({ ...newProfesional, referenciaProfesional: referencia });
                  }}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre Referente"
                  value={item.nombreReferente}
                  onChange={(e) => {
                    const referencia = [...newProfesional.referenciaProfesional];
                    referencia[index].nombreReferente = e.target.value;
                    setNewProfesional({ ...newProfesional, referenciaProfesional: referencia });
                  }}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Relación con Candidato"
                  value={item.relacionCandidato}
                  onChange={(e) => {
                    const referencia = [...newProfesional.referenciaProfesional];
                    referencia[index].relacionCandidato = e.target.value;
                    setNewProfesional({ ...newProfesional, referenciaProfesional: referencia });
                  }}
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Teléfono de Contacto"
                  value={item.telefonoContacto}
                  onChange={(e) => {
                    const referencia = [...newProfesional.referenciaProfesional];
                    referencia[index].telefonoContacto = e.target.value;
                    setNewProfesional({ ...newProfesional, referenciaProfesional: referencia });
                  }}
                />
              </div>
              <div className="col-md-4">
                <button type="button" className="btn btn-danger" onClick={() => {
                  const referencia = newProfesional.referenciaProfesional.filter((_, i) => i !== index);
                  setNewProfesional({ ...newProfesional, referenciaProfesional: referencia });
                }}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Proyectos, Publicaciones, RRSS, etc. */}
        {/* Estos pueden añadirse en forma similar si deseas gestionar esos campos también. */}
        {/* Ejemplo para Proyectos: */}

        <div className="col-12">
          <h5>Proyectos</h5>
          <button type="button" className="btn btn-secondary" onClick={() => {
            const nuevoProyecto = { nombre: "", descripcion: "", fechaInicio: "", fechaFin: "" };
            setNewProfesional({ ...newProfesional, proyectos: [...newProfesional.proyectos, nuevoProyecto] });
          }}>
            Agregar Proyecto
          </button>
          {newProfesional.proyectos.map((item, index) => (
            <div key={index} className="row mt-2">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre del Proyecto"
                  value={item.nombre}
                  onChange={(e) => {
                    const proyectos = [...newProfesional.proyectos];
                    proyectos[index].nombre = e.target.value;
                    setNewProfesional({ ...newProfesional, proyectos });
                  }}
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Descripción"
                  value={item.descripcion}
                  onChange={(e) => {
                    const proyectos = [...newProfesional.proyectos];
                    proyectos[index].descripcion = e.target.value;
                    setNewProfesional({ ...newProfesional, proyectos });
                  }}
                />
              </div>
              <div className="col-md-4">
                <input
                  type="date"
                  className="form-control"
                  placeholder="Fecha Inicio"
                  value={item.fechaInicio}
                  onChange={(e) => {
                    const proyectos = [...newProfesional.proyectos];
                    proyectos[index].fechaInicio = e.target.value;
                    setNewProfesional({ ...newProfesional, proyectos });
                  }}
                />
              </div>
              <div className="col-md-4">
                <input
                  type="date"
                  className="form-control"
                  placeholder="Fecha Fin"
                  value={item.fechaFin}
                  onChange={(e) => {
                    const proyectos = [...newProfesional.proyectos];
                    proyectos[index].fechaFin = e.target.value;
                    setNewProfesional({ ...newProfesional, proyectos });
                  }}
                />
              </div>
              <div className="col-md-4">
                <button type="button" className="btn btn-danger" onClick={() => {
                  const proyectos = newProfesional.proyectos.filter((_, i) => i !== index);
                  setNewProfesional({ ...newProfesional, proyectos });
                }}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Jefe de Servicio */}
        <div className="col-12">
          <h5>Jefe de Servicio</h5>
          <input
            type="text"
            className="form-control"
            placeholder="Nombre del Jefe de Servicio"
            value={newProfesional.jefeServicio.nombre || ""}
            onChange={(e) => setNewProfesional({ ...newProfesional, jefeServicio: { ...newProfesional.jefeServicio, nombre: e.target.value } })}
          />
          <input
            type="text"
            className="form-control mt-2"
            placeholder="Cargo del Jefe"
            value={newProfesional.jefeServicio.cargo || ""}
            onChange={(e) => setNewProfesional({ ...newProfesional, jefeServicio: { ...newProfesional.jefeServicio, cargo: e.target.value } })}
          />
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            <i className="fa fa-floppy-o" aria-hidden="true"></i> {editingProfesional ? "Actualizar Profesional" : "Guardar Profesional"}
          </button>
        </div>
      </form>

      {/* Barra de búsqueda */}
      <div className="search-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por RUT o Nombres"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabla de profesionales */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>RUT</th>
            <th>Nombres</th>
            <th>Apellido Paterno</th>
            <th>Activo</th>
            <th>Foto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {profesionales
            .filter((profesional) => {
              const searchLowerCase = searchTerm.toLowerCase();
              return (
                profesional.rut.toLowerCase().includes(searchLowerCase) ||
                profesional.nombres.toLowerCase().includes(searchLowerCase) ||
                profesional.apaterno.toLowerCase().includes(searchLowerCase)
              );
            })
            .map((profesional, index) => (
              <tr key={index}>
                <td>{profesional.rut}</td>
                <td>{profesional.nombres}</td>
                <td>{profesional.apaterno}</td>
                <td>{profesional.estadoProfesional === 1 ? "Sí" : "No"}</td>
                <td>
                  {profesional.fotografia &&
                    <img src={`data:image/png;base64,${profesional.fotografia}`} alt="Foto" width="50" height="50" />}
                </td>
                <td>
                  <button className="btn btn-warning" onClick={() => editProfesional(profesional)}>Editar</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProfesionalForm;