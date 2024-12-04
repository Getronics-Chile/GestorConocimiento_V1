import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

import "./App.css";
import AddProfessional from "./func/AddProfessional"; // Componente de Profesionales
import AddHabilidadesTecnologicas from "./func/AddHabilidadesTecnologicas"; // Componente de Habilidades
import Idiomas from "./func/Idiomas"; // Componente de Idiomas
import ChartDataLabels from "chartjs-plugin-datalabels"; // Importa el plugin de datalabels

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels // Registra el plugin de datalabels
);
function App() {
  const [currentDate, setCurrentDate] = useState("");
  const [stats, setStats] = useState({
    totalProfesionales: 0,
    promedioExperiencia: 0,
    nivelExperiencia: {
      Junior: 0,
      Semisenior: 0,
      Senior: 0,
    },
    totalHabilidades: 0,
    totalIdiomas: 0,
    habilidadesPorCategoria: {},
  });

  useEffect(() => {
    const date = new Date();
    const formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
    setCurrentDate(formattedDate);

    // Obtener las estadísticas
    getProfessionals();
    getHabilidadesTecnologicas();
    getIdiomas();
  }, []);

  // Obtener los profesionales
  const getProfessionals = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/profesional/listarTodos"
      );
      const data = response.data;

      // Calcular estadísticas
      const totalProfesionales = data.length;
      const promedioExperiencia =
        data.reduce((sum, prof) => sum + Number(prof.anioExperiencia), 0) /
        totalProfesionales;

      const nivelExperiencia = {
        Junior: data.filter((prof) => prof.nivelExperiencia === "Junior")
          .length,
        Semisenior: data.filter(
          (prof) => prof.nivelExperiencia === "Semi senior"
        ).length,
        Senior: data.filter((prof) => prof.nivelExperiencia === "Senior")
          .length,
      };

      setStats((prevStats) => ({
        ...prevStats,
        totalProfesionales,
        promedioExperiencia: promedioExperiencia.toFixed(2),
        nivelExperiencia,
      }));
    } catch (error) {
      console.error("Error al obtener los profesionales:", error);
    }
  };

  // Obtener las habilidades tecnológicas
  const getHabilidadesTecnologicas = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/habilidadesTecnologicas/listarTodas"
      );
      const habilidades = response.data;

      const totalHabilidades = habilidades.length;
      const habilidadesPorCategoria = habilidades.reduce((acc, habilidad) => {
        const categoria = habilidad.categoria || "Sin categoría";
        acc[categoria] = (acc[categoria] || 0) + 1;
        return acc;
      }, {});

      setStats((prevStats) => ({
        ...prevStats,
        totalHabilidades,
        habilidadesPorCategoria,
      }));
    } catch (error) {
      console.error("Error al obtener las habilidades tecnológicas:", error);
    }
  };

  // Obtener los idiomas
  const getIdiomas = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/idiomas/listar"
      );
      const totalIdiomas = response.data.length;

      setStats((prevStats) => ({
        ...prevStats,
        totalIdiomas,
      }));
    } catch (error) {
      console.error("Error al obtener los idiomas:", error);
    }
  };

  // Gráfico de barras de nivel de experiencia
  const barChartData = {
    labels: ["Junior", "Semi senior", "Senior"],
    datasets: [
      {
        label: "Distribución por Nivel de Experiencia",
        data: [
          stats.nivelExperiencia.Junior,
          stats.nivelExperiencia.Semisenior,
          stats.nivelExperiencia.Senior,
        ],
        backgroundColor: ["#FF5733", "#FFBD33", "#33FF57"],
        borderColor: ["#FF5733", "#FFBD33", "#33FF57"],
        borderWidth: 1,
      },
    ],
  };

  // Gráfico de torta para habilidades por categoría
  const pieChartData = {
    labels: Object.keys(stats.habilidadesPorCategoria),
    datasets: [
      {
        label: "Distribución por Categoría",
        data: Object.values(stats.habilidadesPorCategoria),
        backgroundColor: [
          "#FF5733",
          "#FFBD33",
          "#33FF57",
          "#3377FF",
          "#FF33A5",
        ],
      },
    ],
  };
  

  // Configuración del gráfico de torta con etiquetas de porcentaje
  const pieChartOptions = {
    responsive: true,
    plugins: {
      datalabels: {
        display: true,
        formatter: (value, context) => {
          const total = context.dataset.data.reduce((sum, val) => sum + val, 0); // Sumar todos los valores
          const percentage = ((value / total) * 100).toFixed(2); // Calcular el porcentaje
          return `${percentage}%`; // Mostrar el porcentaje
        },
        color: "white", // Color del texto en las etiquetas
        font: {
          weight: "bold",
          size: 14,
        },
        anchor: "center",
        align: "center",
      },
    },
  };
  

  return (
    <div>
      {/* Header */}
      <header className="header d-flex justify-content-between align-items-center">
        <span>Getronics - Gestor de Conocimiento</span>
        <span>{currentDate}</span>
      </header>

      {/* Sidebar */}
      <Router>
        <div className="d-flex">
          <div className="sidebar">
            <ul>
              <li>
                <Link to="/">
                  <i className="fa fa-home" aria-hidden="true"></i> Inicio
                </Link>
              </li>
              <li>
                <Link to="/profesionales">
                  <i className="fa fa-users" aria-hidden="true"></i>{" "}
                  Profesionales
                </Link>
              </li>
              <li>
                <Link to="/habilidades">
                  <i className="fa fa-desktop" aria-hidden="true"></i>{" "}
                  Habilidades
                </Link>
              </li>
              <li>
                <Link to="/idiomas">
                  <i className="fa fa-language" aria-hidden="true"></i> Idiomas
                </Link>
              </li>
            </ul>
          </div>

          {/* Contenido principal */}
          <div className="content">
            <Routes>
              <Route
                path="/"
                element={
                  <div>
                    <h1>Dashboard</h1>

                    {/* Mostrar estadísticas con gráficos */}
                    <div className="stats-container">
                      <div className="stat-card">
                        <h3>Total de Profesionales</h3>
                        <p>{stats.totalProfesionales}</p>
                      </div>
                      <div className="stat-card">
                        <h3>Promedio de Años de Experiencia</h3>
                        <p>{stats.promedioExperiencia} años</p>
                      </div>
                      <div className="stat-card">
                        <h3>Total de Habilidades</h3>
                        <p>{stats.totalHabilidades}</p>
                      </div>
                      <div className="stat-card">
                        <h3>Total de Idiomas</h3>
                        <p>{stats.totalIdiomas}</p>
                      </div>
                    </div>

                    {/* Gráficos */}
                    <div className="charts-container">
                      <div className="chart-card">
                        <h3>Distribución por Nivel de Experiencia</h3>
                        <Bar data={barChartData} />
                      </div>

                      <div className="chart-card">
                        <h3>Distribución por Categoría de Habilidades</h3>
                        <Pie data={pieChartData} options={pieChartOptions} />
                      </div>
                    </div>
                  </div>
                }
              />
              <Route path="/profesionales" element={<AddProfessional />} />
              <Route
                path="/habilidades"
                element={<AddHabilidadesTecnologicas />}
              />
              <Route path="/idiomas" element={<Idiomas />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
