import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import { Bar, Line, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

import "./App.css";
import AddProfessional from "./func/AgregarProfesional"; // Componente de Profesionales
import AddHabilidadesTecnologicas from "./func/AddHabilidadesTecnologicas"; // Componente de Habilidades
import ListProfessional from "./func/ListarProfesionales"; // Componente de Habilidades
import Idiomas from "./func/Idiomas"; // Componente de Idiomas
import ChatGpt from "./chatgpt/DynamicChat";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
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
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    setCurrentDate(formattedDate);

    // Obtener las estadísticas
    getProfessionals();
    getHabilidadesTecnologicas();
    getIdiomas();
  }, []);

  const [isProfesionalesOpen, setProfesionalesOpen] = useState(false);
  const [isSidebarMinimized, setSidebarMinimized] = useState(false);

  const toggleProfesionales = () => {
    setProfesionalesOpen(!isProfesionalesOpen);
  };

  const getProfessionals = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/profesional/listarTodos"
      );
      const data = response.data;

      const totalProfesionales = data.length;
      const promedioExperiencia =
        data.reduce((sum, prof) => sum + Number(prof.anioExperiencia), 0) /
        totalProfesionales;

      const nivelExperiencia = {
        Junior: data.filter((prof) => prof.nivelExperiencia === "Junior").length,
        Semisenior: data.filter((prof) => prof.nivelExperiencia === "Semisenior").length,
        Senior: data.filter((prof) => prof.nivelExperiencia === "Senior").length,
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
  const barChartDataExperience = {
    labels: ["Junior", "Semisenior", "Senior"],
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

  // Gráfico de barras de habilidades por categoría
  const barChartDataSkills = {
    labels: Object.keys(stats.habilidadesPorCategoria),
    datasets: [
      {
        label: "Habilidades por Categoría",
        data: Object.values(stats.habilidadesPorCategoria),
        backgroundColor: ["#FF5733", "#FFBD33", "#33FF57", "#3377FF", "#FF33A5"],
        borderWidth: 1,
      },
    ],
  };

  // Gráfico de líneas de tendencias de crecimiento (ejemplo)
  const lineChartData = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
    datasets: [
      {
        label: "Profesionales Activos",
        data: [10, 15, 20, 25, 30, 40], // Datos de ejemplo
        fill: false,
        backgroundColor: "#42A5F5",
        borderColor: "#1E88E5",
      },
    ],
  };

  // Gráfico de radar para comparación de habilidades
  const radarChartData = {
    labels: Object.keys(stats.habilidadesPorCategoria),
    datasets: [
      {
        label: "Distribución de Habilidades",
        data: Object.values(stats.habilidadesPorCategoria),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "#36A2EB",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <header className="header d-flex justify-content-between align-items-center">
        <span>Getronics - Gestor de Conocimiento</span>
        <span>{currentDate}</span>
      </header>

      <Router>
        <div className="d-flex">
          <div className={`sidebar ${isSidebarMinimized ? "minimized" : ""}`}>
            {/* <button className="toggle-btn" onClick={toggleSidebar}>
                        {isSidebarMinimized ? ">" : "<"}
                      </button> */}
            <ul>
              <li>
                <Link to="/">
                <i class="fa fa-tachometer" aria-hidden="true"></i> Dashboard
                </Link>
              </li>
              <li>
                <Link to="#" onClick={toggleProfesionales}>
                  <i className="fa fa-users" aria-hidden="true"></i> Profesionales
                  &nbsp;
                  <i className={`fa fa-chevron-${isProfesionalesOpen ? "up" : "down"}`} aria-hidden="true"></i>
                </Link>
                {isProfesionalesOpen && (
                  <ul className="sublist">
                    <li>
                      <Link to="/profesionales/agregar">
                        <i className="fa fa-plus" aria-hidden="true"></i> Agregar Profesional
                      </Link>
                    </li>
                    <li>
                      <Link to="/profesionales/listar">
                        <i className="fa fa-list" aria-hidden="true"></i> Listar Profesionales
                      </Link>
                    </li>
                    <li>
                      <Link to="/profesionales/modificar">
                        <i className="fa fa-edit" aria-hidden="true"></i> Modificar Profesional
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <Link to="/clientes">
                <i class="fa fa-handshake-o" aria-hidden="true"></i> Clientes
                </Link>
              </li>
              <li>
                <Link to="/habilidades">
                <i class="fa fa-lightbulb-o" aria-hidden="true"></i> Conocimientos
                </Link>
              </li>
              <li>
                <Link to="/idiomas">
                  <i className="fa fa-language" aria-hidden="true"></i> Idiomas
                </Link>
              </li>

              <li>
                <Link to="/chat/ask">
                <i class="fa fa-question-circle-o" aria-hidden="true"></i> Soporte
                </Link>
              </li>

            </ul>
          </div>

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

                    <div className="charts-container">
                      <div className="chart-card">
                        <h3>Distribución por Nivel de Experiencia</h3>
                        <Bar data={barChartDataExperience} />
                      </div>

                      <div className="chart-card">
                        <h3>Comparación de Habilidades</h3>
                        <Radar data={radarChartData} />
                      </div>
                    </div>
                  </div>
                }
              />
              <Route path="/profesionales/agregar" element={<AddProfessional />} />
              <Route path="/profesionales/listar" element={<ListProfessional />} />
              <Route
                path="/habilidades"
                element={<AddHabilidadesTecnologicas />}
              />
              <Route path="/idiomas" element={<Idiomas />} />
              <Route path="/chat/ask" element={<ChatGpt />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
