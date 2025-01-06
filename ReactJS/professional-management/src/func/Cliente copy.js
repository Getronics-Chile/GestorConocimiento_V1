import React, { useState, useEffect } from "react";
import axios from "axios";

const APIURL = "http://localhost:8000";

function ClienteForm() {
    // Definir los estados para clientes, nuevo cliente y búsqueda
    const [clientes, setClientes] = useState([]);
    const [newCliente, setNewCliente] = useState({
        rut: "",
        activo: false,
        logo: "",  // Guardamos el logo en base64 sin el prefijo
        razonSocial: "",
        rubro: ""
    });
    const [searchTerm, setSearchTerm] = useState("");

    // Obtener todos los clientes
    const getClientes = async () => {
        try {
            const response = await axios.get(`${APIURL}/api/cliente/listarTodos`);
            setClientes(response.data); // Guardamos los datos en el estado de clientes
        } catch (error) {
            console.error("Error al obtener clientes:", error);
        }
    };

    // Función para manejar la carga del logo (imagen)
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Eliminar el prefijo 'data:image/png;base64,' antes de guardarlo
                const base64Logo = reader.result.split(',')[1]; // Solo la parte base64
                setNewCliente({ ...newCliente, logo: base64Logo }); // Guardamos solo la cadena base64 sin el prefijo
            };
            reader.readAsDataURL(file); // Convertir la imagen a base64
        }
    };

    // Agregar un nuevo cliente
    const addCliente = async () => {
        if (
            !newCliente.rut ||
            !newCliente.activo ||
            !newCliente.razonSocial ||
            !newCliente.logo ||  // Verifica que el logo esté en base64
            !newCliente.rubro
        ) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        try {
            // Enviar los datos como JSON (incluyendo la cadena base64 para el logo)
            await axios.post(
                `${APIURL}/api/cliente/crear`,
                newCliente,
                { headers: { "Content-Type": "application/json" } }
            );
            alert("Cliente agregado exitosamente.");
            setNewCliente({
                rut: "",
                razonSocial: "",
                rubro: "",
                activo: false,
                logo: "", // Limpiar el campo del logo
            });
            getClientes(); // Volver a cargar la lista de clientes
        } catch (error) {
            console.error("Error al agregar cliente:", error);
            alert("Error al agregar cliente.");
        }
    };

    useEffect(() => {
        getClientes(); // Obtener los clientes al cargar el componente
    }, []);

    return (
        <div>
            <h1>Formulario de Clientes</h1>

            <form
                className="row g-3 mb-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    addCliente(); // Llamar a la función para agregar un cliente
                }}
            >
                {/* Formulario de cliente */}
                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="RUT"
                        value={newCliente.rut}
                        onChange={(e) =>
                            setNewCliente({ ...newCliente, rut: e.target.value })
                        }
                        required
                    />
                </div>

                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Razón Social"
                        value={newCliente.razonSocial}
                        onChange={(e) =>
                            setNewCliente({ ...newCliente, razonSocial: e.target.value })
                        }
                        required
                    />
                </div>

                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Rubro"
                        value={newCliente.rubro}
                        onChange={(e) =>
                            setNewCliente({ ...newCliente, rubro: e.target.value })
                        }
                        required
                    />
                </div>

                <div className="col-md-4">
                    <label>
                        <input
                            type="checkbox"
                            checked={newCliente.activo}
                            onChange={(e) =>
                                setNewCliente({ ...newCliente, activo: e.target.checked })
                            }
                        />{" "}
                        Activo
                    </label>
                </div>

                {/* Campo para cargar el logo */}

                <div className="col-md-4">
                    <label>Logo</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleLogoChange} // Cambiar logo
                        required
                    />
                </div>

                {/* Botón de agregar cliente */}
                <div className="col-12">
                    <button type="submit" className="btn btn-primary">
                        <i className="fa fa-floppy-o" aria-hidden="true"></i> Guardar Cliente
                    </button>
                </div>
            </form>

            {/* Barra de búsqueda */}
            <div className="search-wrapper">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar por RUT"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Tabla de clientes */}
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>RUT</th>
                        <th>Razón Social</th>
                        <th>Rubro</th>
                        <th>Activo</th>
                        <th>Logo</th> {/* Columna para mostrar el logo */}
                    </tr>
                </thead>
                <tbody>
                    {clientes
                        .filter((cliente) => {
                            const searchLowerCase = searchTerm.toLowerCase();
                            return (
                                cliente.rut.toLowerCase().includes(searchLowerCase) ||
                                cliente.razonSocial.toLowerCase().includes(searchLowerCase)
                            );
                        })
                        .map((cliente, index) => (
                            <tr key={index}>
                                <td>{cliente.rut}</td>
                                <td>{cliente.razonSocial}</td>
                                <td>{cliente.rubro}</td>
                                <td>{cliente.activo ? "Sí" : "No"}</td>
                                <td>
                                    {cliente.logo && <img src={`data:image/png;base64,${cliente.logo}`} alt="Logo" width="50" height="50" />}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

export default ClienteForm;
