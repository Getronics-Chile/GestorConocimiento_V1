import React, { useState, useEffect } from "react";
import axios from "axios";

const APIURL = "http://localhost:8000";

function ProfesionalForm() {
  const [setProfesionales] = useState([]);
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
  const [resumenProfesionales, setResumenProfesionales] = useState([]);
  const [editingProfesional, setEditingProfesional] = useState(null);
  const [errorModal, setErrorModal] = useState({ show: false, messages: [] });

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

        setResumenProfesionales([...resumenProfesionales, newProfesional]);
      }

      resetForm();
      getProfesionales();
    } catch (error) {
      console.error("Error al guardar profesional:", error);
      if (error.response && error.response.data) {
        setErrorModal({
          show: true,
          messages: Object.values(error.response.data)
        });
      } else {
        setErrorModal({
          show: true,
          messages: ["Error al guardar profesional. Intente nuevamente."]
        });
      }
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

  const handleJsonUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target.result);

          // Si el JSON contiene una fotografía en base64, asegúrate de dejarla tal cual.
          setNewProfesional((prev) => ({
            ...prev,
            ...jsonData,
            // Asegúrate de que si jsonData.fotografia es una cadena no vacía se use, y si no use la fotografía ya existente.
            fotografia: jsonData.fotografia || prev.fotografia
          }));
          alert("Archivo JSON cargado exitosamente.");
        } catch (error) {
          console.error("Error al leer el archivo JSON:", error);
          setErrorModal({ show: true, messages: ["El archivo no es un JSON válido."] });
        }
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
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

        {/* Campos del profesional */}
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="RUT"
            value={newProfesional.rut}
            onChange={(e) => setNewProfesional({ ...newProfesional, rut: e.target.value })}
          />
        </div>

        <div className="col-md-4">
          <input
            type="number"
            className="form-control"
            placeholder="Id Sap"
            value={newProfesional.idSap}
            onChange={(e) => setNewProfesional({ ...newProfesional, idSap: e.target.value })}
          />
        </div>

        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Nombres"
            value={newProfesional.nombres}
            onChange={(e) => setNewProfesional({ ...newProfesional, nombres: e.target.value })}
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

        {/* Proyectos */}
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

      {/* Resumen de Profesionales agregados */}
      <div className="mt-5">
        <div className="card shadow-lg rounded">
          <div className="card-header bg-primary text-white">
            <h5>Resumen de Profesionales Agregados</h5>
          </div>
          <div className="card-body">
            <ul className="list-group">
              {resumenProfesionales.map((profesional, index) => (
                <li key={index} className="list-group-item">
                  <strong>Nombres:</strong> {profesional.nombres} {profesional.apaterno} {profesional.amaterno} <br />
                  <strong>RUT:</strong> {profesional.rut} <br />
                  <strong>Fecha de Nacimiento:</strong> {profesional.fechaNacimiento} <br />
                  <strong>Nacionalidad:</strong> {profesional.nacionalidad} <br />
                  <strong>Dirección:</strong> {profesional.direccion} <br />
                  <strong>Teléfono:</strong> {profesional.telefono} <br />
                  <strong>Correo Electrónico:</strong> {profesional.correoElectronico} <br />
                  <strong>Años de Experiencia:</strong> {profesional.anioExperiencia} <br />
                  <strong>Perfil Profesional:</strong> {profesional.perfilProfesional} <br />
                  <strong>Nivel de Experiencia:</strong> {profesional.nivelExperiencia} <br />
                  <strong>Fecha de Ingreso a Getronics:</strong> {profesional.fechaIngresoGetronics} <br />
                  <strong>Fecha de Egreso de Getronics:</strong> {profesional.fechaEgresoGetronics} <br />
                  <strong>Fotografía:</strong> <img src={`data:image/png;base64,${profesional.fotografia}`} alt="Fotografía" style={{ width: '50px', height: '50px', borderRadius: '50%' }} /><br />
                  <strong>Estado Profesional:</strong> {profesional.estadoProfesional === 1 ? "Activo" : "Inactivo"} <br />
                  <strong>Referido:</strong> {profesional.referido ? "Sí" : "No"} <br />
                  <strong>Jefe de Servicio:</strong> {profesional.jefeServicio.nombre || "No especificado"} ({profesional.jefeServicio.cargo || "No especificado"})<br />
                  <strong>Conocimientos Profesionales:</strong>
                  <ul>
                    {profesional.conocimientoProfesional.map((conocimiento, idx) => (
                      <li key={idx}>{conocimiento.habilidad}</li>
                    ))}
                  </ul>
                  <strong>Formación Académica:</strong>
                  <ul>
                    {profesional.formacionAcademicaProfesional.map((formacion, idx) => (
                      <li key={idx}>{formacion.carrera} en {formacion.institucion} ({formacion.anioInicio} - {formacion.anioFin})</li>
                    ))}
                  </ul>
                  <strong>Idiomas:</strong>
                  <ul>
                    {profesional.idiomasProfesional.map((idioma, idx) => (
                      <li key={idx}>{idioma.nombre} - Nivel: {idioma.nivelDominio}</li>
                    ))}
                  </ul>
                  <strong>Experiencia Laboral:</strong>
                  <ul>
                    {profesional.experienciaLaboralProfesional.map((experiencia, idx) => (
                      <li key={idx}>{experiencia.cargo} en {experiencia.empresa}</li>
                    ))}
                  </ul>
                  <strong>Certificaciones:</strong>
                  <ul>
                    {profesional.certificacionProfesional.map((certificacion, idx) => (
                      <li key={idx}>
                        {certificacion.nombreCertificacion} de {certificacion.institucionEmisora}
                        (Emitido: {certificacion.fechaEmision}, Vencimiento: {certificacion.fechaVencimiento})
                      </li>
                    ))}
                  </ul>
                  <strong>Referencias:</strong>
                  <ul>
                    {profesional.referenciaProfesional.map((referencia, idx) => (
                      <li key={idx}>{referencia.nombreReferente} ({referencia.cargo})</li>
                    ))}
                  </ul>
                  <strong>Proyectos:</strong>
                  <ul>
                    {profesional.proyectos.map((proyecto, idx) => (
                      <li key={idx}>{proyecto.nombre}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Modal de Error */}
      {errorModal.show && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Error</h5>
                <button type="button" className="close" onClick={() => setErrorModal({ show: false, messages: [] })} aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <ul className="list-group">
                  {errorModal.messages.map((msg, idx) => (
                    <li key={idx} className="list-group-item list-group-item-warning">
                      {msg}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setErrorModal({ show: false, messages: [] })}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfesionalForm;