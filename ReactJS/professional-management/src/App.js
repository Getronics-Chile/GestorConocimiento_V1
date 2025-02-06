import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate, useNavigate } from "react-router-dom";
import Login from "./func/Login";
import PrivateRoute from "./func/PrivateRoute";
import { AuthProvider } from "./auth/AuthProvider";
import "bootstrap/dist/css/bootstrap.min.css";
import Dropdown from "react-bootstrap/Dropdown";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import { Bar, Radar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, RadialLinearScale, Title, Tooltip, Legend } from "chart.js";
import axios from "axios";
import "./App.css";
import AddProfessional from "./func/AgregarProfesional"; // Componente de Profesionales
import ModifyProfessional from "./func/ModificarProfesional"; // Componente de Profesionales
import AddHabilidadesTecnologicas from "./func/AddHabilidadesTecnologicas"; // Componente de Habilidades
import ListProfessional from "./func/ListarProfesionales"; // Componente de Habilidades
import Idiomas from "./func/Idiomas"; // Componente de Idiomas
//import ChatGpt from "./chatgpt/DynamicChat";

import AddCliente from "./func/Cliente";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, RadialLinearScale, Title, Tooltip, Legend);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    navigate("/login"); // Redirige al usuario a la página de login
  };

  useEffect(() => {
    const date = new Date();
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    // Obtener las estadísticas *Mover desde app.js hacia componente dashboard
    // getProfessionals();
    // getHabilidadesTecnologicas();
    // getIdiomas();
  }, []);

  const [isProfesionalesOpen, setProfesionalesOpen] = useState(false);
  const [isSidebarMinimized, setSidebarMinimized] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user ? user?.username : "";

  const toggleProfesionales = () => {
    setProfesionalesOpen(!isProfesionalesOpen);
  };

  const getProfessionals = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/profesional/listarTodos");
      const data = response.data;

      const totalProfesionales = data.length;
      const promedioExperiencia = data.reduce((sum, prof) => sum + Number(prof.anioExperiencia), 0) / totalProfesionales;

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
      const response = await axios.get("http://localhost:8000/api/habilidadesTecnologicas/listarTodas");
      const habilidades = response.data;

      const totalHabilidades = habilidades.length;
      const habilidadesPorCategoria = habilidades.reduce((acc, habilidad) => {
        const categoria = habilidad.categoria || "Sin categoría"; // Si no tiene categoría, asigna "Sin categoría"
        acc[categoria] = (acc[categoria] || 0) + 1;
        return acc;
      }, {});

      setStats((prevStats) => ({
        ...prevStats,
        habilidadesPorCategoria,
      }));

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
      const response = await axios.get("http://localhost:8000/api/idiomas/listar");
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
        data: [stats.nivelExperiencia.Junior, stats.nivelExperiencia.Semisenior, stats.nivelExperiencia.Senior],
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
        {isAuthenticated ? (
          <>
            <header className="header d-flex justify-content-between align-items-center">
              <span>Getronics - Gestor de Conocimiento</span>
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                {username}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {/* <Dropdown.Item href="#/action-1">Configuración</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Contacto</Dropdown.Item>
                  <Dropdown.Divider /> */}
                  <Dropdown.Item href="#/action-3" onClick={handleLogout}>Cerrar Sesión</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </header>

            <div className="d-flex">
              <div className={`sidebar ${isSidebarMinimized ? "minimized" : ""}`}>
                <ul>
                  <li>
                    <Link to="/">
                      <i className="fa fa-tachometer" aria-hidden="true"></i> Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="#" onClick={toggleProfesionales}>
                      <i className="fa fa-users" aria-hidden="true"></i> Profesionales &nbsp;
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
                    <Link to="/clientes/crear">
                      <i className="fa fa-handshake-o" aria-hidden="true"></i> Clientes
                    </Link>
                  </li>
                  <li>
                    <Link to="/habilidades">
                      <i className="fa fa-lightbulb-o" aria-hidden="true"></i> Conocimientos
                    </Link>
                  </li>
                  <li>
                    <Link to="/idiomas">
                      <i className="fa fa-language" aria-hidden="true"></i> Idiomas
                    </Link>
                  </li>
                  <li>
                    <Link to="/chat/ask">
                      <i className="fa fa-question-circle-o" aria-hidden="true"></i> Prometeo
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
                        <h1>Bienvenido</h1>
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
                  <Route path="/login" element={<Login />} />
                  <Route path="/profesionales/agregar" element={<AddProfessional />} />
                  <Route path="/profesionales/listar" element={<ListProfessional />} />
                  <Route path="/profesionales/modificar" element={<ModifyProfessional />} />
                  <Route path="/habilidades" element={<AddHabilidadesTecnologicas />} />
                  <Route path="/idiomas" element={<Idiomas />} />
                  <Route path="/clientes/crear" element={<AddCliente />} />
                </Routes>
              </div>
            </div>
          </>
        ) : (
          <Login setIsAuthenticated={setIsAuthenticated} />
        )}
      </div>
  );
}

export default App;
