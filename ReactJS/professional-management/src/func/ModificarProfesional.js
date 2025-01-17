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
  const [editingProfesional, setEditingProfesional] = useState(null);
  
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

  useEffect(() => {
    }, []);



}