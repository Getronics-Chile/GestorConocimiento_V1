import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Card,
  CardContent,
  Modal,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";

const APIURL = "http://localhost:8000";

function ProfesionalForm() {
  const [newProfesional, setNewProfesional] = useState({
    rut: "",
    nombres: "",
    apaterno: "",
    amaterno: "",
    fechaNacimiento: "",
    nacionalidad: "",
    direccion: "",
    telefono: "",
    correoElectronico: "",
    anioExperiencia: "",
    perfilProfesional: "",
    nivelExperiencia: "",
    referido: false,
    estadoProfesional: true,
  });
  const [resumenProfesionales, setResumenProfesionales] = useState([]);
  const [errorModal, setErrorModal] = useState({ show: false, messages: [] });

  const addOrUpdateProfesional = async () => {
    try {
      await axios.post(`${APIURL}/api/profesional/crear`, newProfesional, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Profesional agregado exitosamente.");
      setResumenProfesionales([...resumenProfesionales, newProfesional]);
      resetForm();
    } catch (error) {
      console.error("Error al guardar profesional:", error);
      setErrorModal({
        show: true,
        messages: error.response?.data || ["Error al guardar profesional."],
      });
    }
  };

  const resetForm = () => {
    setNewProfesional({
      rut: "",
      nombres: "",
      apaterno: "",
      amaterno: "",
      fechaNacimiento: "",
      nacionalidad: "",
      direccion: "",
      telefono: "",
      correoElectronico: "",
      anioExperiencia: "",
      perfilProfesional: "",
      nivelExperiencia: "",
      referido: false,
      estadoProfesional: true,
    });
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ mt: 4, mb: 4 }}>
        {`Agregar Profesional`}
      </Typography>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addOrUpdateProfesional();
            }}
          >
            <Grid container spacing={2}>
              {/* Campos básicos */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="RUT"
                  fullWidth
                  variant="outlined"
                  value={newProfesional.rut}
                  onChange={(e) =>
                    setNewProfesional({ ...newProfesional, rut: e.target.value })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nombres"
                  fullWidth
                  variant="outlined"
                  value={newProfesional.nombres}
                  onChange={(e) =>
                    setNewProfesional({
                      ...newProfesional,
                      nombres: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Apellido Paterno"
                  fullWidth
                  variant="outlined"
                  value={newProfesional.apaterno}
                  onChange={(e) =>
                    setNewProfesional({
                      ...newProfesional,
                      apaterno: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Apellido Materno"
                  fullWidth
                  variant="outlined"
                  value={newProfesional.amaterno}
                  onChange={(e) =>
                    setNewProfesional({
                      ...newProfesional,
                      amaterno: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Fecha de Nacimiento"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={newProfesional.fechaNacimiento}
                  onChange={(e) =>
                    setNewProfesional({
                      ...newProfesional,
                      fechaNacimiento: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nacionalidad"
                  fullWidth
                  variant="outlined"
                  value={newProfesional.nacionalidad}
                  onChange={(e) =>
                    setNewProfesional({
                      ...newProfesional,
                      nacionalidad: e.target.value,
                    })
                  }
                />
              </Grid>
              {/* Información de contacto */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Dirección"
                  fullWidth
                  variant="outlined"
                  value={newProfesional.direccion}
                  onChange={(e) =>
                    setNewProfesional({
                      ...newProfesional,
                      direccion: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Teléfono"
                  fullWidth
                  variant="outlined"
                  value={newProfesional.telefono}
                  onChange={(e) =>
                    setNewProfesional({
                      ...newProfesional,
                      telefono: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Correo Electrónico"
                  fullWidth
                  variant="outlined"
                  value={newProfesional.correoElectronico}
                  onChange={(e) =>
                    setNewProfesional({
                      ...newProfesional,
                      correoElectronico: e.target.value,
                    })
                  }
                />
              </Grid>
              {/* Configuración adicional */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newProfesional.referido}
                      onChange={(e) =>
                        setNewProfesional({
                          ...newProfesional,
                          referido: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Referido"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newProfesional.estadoProfesional}
                      onChange={(e) =>
                        setNewProfesional({
                          ...newProfesional,
                          estadoProfesional: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Estado Profesional Activo"
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" type="submit">
                  Guardar Profesional
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  sx={{ ml: 2 }}
                  onClick={resetForm}
                >
                  Limpiar
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Resumen de Profesionales */}
      <Typography variant="h5">Resumen de Profesionales</Typography>
      <List>
        {resumenProfesionales.map((profesional, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`${profesional.nombres} ${profesional.apaterno}`}
              secondary={`RUT: ${profesional.rut} | Teléfono: ${profesional.telefono}`}
            />
          </ListItem>
        ))}
      </List>

      {/* Modal de Error */}
      <Modal
        open={errorModal.show}
        onClose={() => setErrorModal({ show: false, messages: [] })}
      >
        <Box sx={{ p: 4, backgroundColor: "white", borderRadius: 2, mx: "auto", my: "20%", width: "50%" }}>
          <Typography variant="h6">Errores</Typography>
          <List>
            {errorModal.messages.map((message, idx) => (
              <ListItem key={idx}>
                <ListItemText primary={message} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Modal>
    </Container>
  );
}

export default ProfesionalForm;
