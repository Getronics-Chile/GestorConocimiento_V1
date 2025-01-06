import React, { useState, useEffect } from "react";
import axios from "axios";

const APIURL = "http://localhost:8000";

function ClienteForm() {
    const [clientes, setClientes] = useState([]);
    const [newCliente, setNewCliente] = useState({
        rut: "",
        activo: false,
        logo: "",
        razonSocial: "",
        rubro: ""
    });
    const [searchTerm, setSearchTerm] = useState("");

    // Estado para el cliente que se está editando
    const [editingCliente, setEditingCliente] = useState(null);

    const getClientes = async () => {
        try {
            const response = await axios.get(`${APIURL}/api/cliente/listarTodos`);
            setClientes(response.data);
        } catch (error) {
            console.error("Error al obtener clientes:", error);
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Logo = reader.result.split(',')[1];
                setNewCliente({ ...newCliente, logo: base64Logo });
            };
            reader.readAsDataURL(file);
        }
    };

    const addOrUpdateCliente = async () => {
        if (!newCliente.rut || !newCliente.razonSocial || !newCliente.logo || !newCliente.rubro) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        try {
            if (editingCliente) {
                // Actualiza el cliente existente
                await axios.put(
                    `${APIURL}/api/cliente/actualizar/${editingCliente.id}`,
                    newCliente,
                    { headers: { "Content-Type": "application/json" } }
                );
                alert("Cliente actualizado exitosamente.");
            } else {
                // Agrega un nuevo cliente
                await axios.post(
                    `${APIURL}/api/cliente/crear`,
                    newCliente,
                    { headers: { "Content-Type": "application/json" } }
                );
                alert("Cliente agregado exitosamente.");
            }

            setNewCliente({
                rut: "",
                razonSocial: "",
                rubro: "",
                activo: false,
                logo: "",
            });
            setEditingCliente(null); // Restablece el cliente en edición
            getClientes(); // Carga la lista de clientes de nuevo
        } catch (error) {
            console.error("Error al guardar cliente:", error);
            alert("Error al guardar cliente.");
        }
    };

    // Seleccionar un cliente para editar
    const editCliente = (cliente) => {
        setEditingCliente(cliente);
        setNewCliente(cliente);
    };

    useEffect(() => {
        getClientes();
    }, []);

    return (
        <div>
            <h1>{editingCliente ? "Modificar Cliente" : "Agregar Cliente"}</h1>

            <form
                className="row g-3 mb-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    addOrUpdateCliente();
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

                <div className="col-md-4">
                    <label>Logo</label>
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleLogoChange}
                        required={!editingCliente} // Requerido si no se está editando
                    />
                </div>

                <div className="col-12">
                    <button type="submit" className="btn btn-primary">
                        <i className="fa fa-floppy-o" aria-hidden="true"></i> {editingCliente ? "Actualizar Cliente" : "Guardar Cliente"}
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
                        <th>Logo</th>
                        <th>Acciones</th> {/* Columna para las acciones */}
                    </tr>
                </thead>
                <tbody>
                    {clientes
                        .filter((cliente) => {
                            const searchLowerCase = searchTerm.toLowerCase();
                            return (
                                cliente.rut.toLowerCase().includes(searchLowerCase) ||
                                cliente.razonSocial.toLowerCase().includes(searchLowerCase) ||
                                cliente.rubro.toLowerCase().includes(searchLowerCase) ||
                                cliente.activo.toString().includes(searchLowerCase)
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
                                <td>
                                    <button className="btn btn-warning" onClick={() => editCliente(cliente)}>Editar</button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

export default ClienteForm;