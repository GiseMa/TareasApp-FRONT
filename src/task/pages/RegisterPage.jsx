import { Alert, Box, Button, CircularProgress, Grid, Link, TextField, Typography } from "@mui/material";
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import { useState } from "react";
import { AuthLayout } from "../layout/AuthLayout";
import { useForm } from "../../hooks/useForm";
import { useAuth } from "../../context/"

const formData = {
    name: '',
    email: '',
    password: '',
}

const formValidations = {
    name: [(value) => value.length >= 3, 'El nombre debe de tener al menos tres caracteres'],
    email: [(value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value), 'El correo debe incluir el @ y su dominio'],
    password: [(value) => value.length >= 6, 'La contraseña debe de tener seis o mas caracteres'],
}

export const RegisterPage = () => {

  const {errorMsg, register, clearError, checking} = useAuth();
  const navigate = useNavigate();

  const [formSubmitted, setFormSubmitted] = useState(false);
  

  const {
    name, nameValid,
    email, emailValid,
    password, passwordValid,
    isFormValid, onInputChange, formState,
  } = useForm(formData, formValidations);


  const onSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);
    if(!isFormValid) {
      clearError();
      return;
    }
    const {ok} =  await register(formState);
    if(ok) {
      navigate('/auth/login');
    }
  };

  if (checking) {
    return (
      <AuthLayout title="Cargando...">
        <Box  display="flex" justifyContent="center" alignItems="center" sx={{ height: "60vh", width: "100%" }}>
          <CircularProgress size={80}/>
        </Box>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Registro">
      <form onSubmit={onSubmit} className="animate__animated animate__fadeIn">
        <Grid container direction='column' spacing={1} alignItems='center'>
        <Grid size={{xs: 10}} sx={{mt: 3.5}}>
            <TextField
              label="Nombre completo"
              type="name"
              placeholder="Nombre completo"
              fullWidth
              name="name"
              size=""
              value={name}
              error={!!nameValid && formSubmitted}
              onChange={onInputChange}
              helperText={formSubmitted ? nameValid : ''}
            />
          </Grid>
          <Grid size={{xs: 10}} sx={{mt: 1}}>
            <TextField
              label="Correo"
              type="text"
              placeholder="correo@google.com"
              fullWidth
              name="email"
              value={email}
              error={!!emailValid && formSubmitted}
              onChange={onInputChange}
              helperText={formSubmitted ? emailValid : ''}
            />
          </Grid>
          <Grid size={{xs: 10}} sx={{mt: 1}}>
            <TextField
              label="Contraseña"
              type="password"
              placeholder="Contraseña"
              fullWidth
              name="password"
              value={password}
              error={!!passwordValid && formSubmitted}
              onChange={onInputChange}
              helperText={formSubmitted ? passwordValid : ''}
              />
          </Grid>
          {
            !!formSubmitted && errorMsg && (
              <Grid container spacing={2} sx={{mb: 2, mt: 1}}>
                <Grid grid={{xs: 12}} >
                  <Alert severity="error">{errorMsg}</Alert>
                </Grid>
              </Grid>
            )
          }
          <Grid container spacing={2} sx={{mb: 2, mt:1, display: "flex", justifyContent: "space-between" }}>
            <Grid size={{xs: 12, sm: 5}}>
              <Button 
                variant="contained"
                fullWidth
                sx={{py:1.5, minWidth: '200px', display: "flex", alignItems: "center", justifyContent: "center", backgroundColor:' #274215'}}
                type="submit"
                disabled={checking}
              >
                Crear cuenta
              </Button>
            </Grid>
          </Grid>
          <Grid container direction='row' justifyContent='end' size={12}>
            <Typography sx={{mr: 1}}>¿Ya tienes cuenta?</Typography>
            <Link component={RouterLink} color='#274215' to="/auth/login" onClick={clearError} sx={{ fontFamily: '"Roboto","Helvetica","Arial",sans-serif', size:''}}>
              ¡Logueate!
            </Link>
          </Grid>
        </Grid>
      </form>
    </AuthLayout>
  );
};
