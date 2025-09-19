import { Alert, Button, Grid, Link, Snackbar, TextField } from "@mui/material";
import {Link as RouterLink } from 'react-router-dom';
import { useState } from "react";
import { AuthLayout } from "../layout/AuthLayout";
import { useForm } from "../../hooks/useForm";
import { useAuth } from "../../context";

const formData = {
    email: '',
    password: '',
}

const formValidations = {
    email: [(value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value), 'El correo debe incluir el @ y su dominio'],
    password: [(value) => value.length >= 6, 'La contraseña debe de tener seis o mas caracteres'],
}
export const LoginPage = () => {

  const {errorMsg, login, clearError, succesfulRegister, clearRegister} = useAuth();

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [isLoading, setisLoading] = useState(false);

  const {
    email, emailValid,
    password, passwordValid,
    isFormValid, onInputChange, formState, 
  } = useForm(formData, formValidations);

  const onCloseSnackbar = () => {
    setShowAlert(false);
    clearRegister()
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    clearError();
    setFormSubmitted(true);
    if(!isFormValid) return;
    
    setisLoading(true);
    await login(formState);
    setisLoading(false);

  };

  return (
    <AuthLayout title="Login">
      <form onSubmit={onSubmit} className="animate__animated animate__fadeIn">
        <Grid container direction='column' spacing={1.5} alignItems='center'>
          <Grid size={{xs: 10}} sx={{mt: 2}}>
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
          <Grid size={{xs: 10}} sx={{mt: 2}}>
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
                <Grid grid={{xs: 12}}>
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
                disabled={isLoading}
              >
                Login
              </Button>
            </Grid>
          </Grid>
          <Grid container direction='row' justifyContent='end' size={12}>
            <Link component={RouterLink} color='#274215' to="/auth/registro" onClick={clearError} sx={{ fontFamily: '"Roboto","Helvetica","Arial",sans-serif' }}>
              Crear una cuenta
            </Link>
          </Grid>
        </Grid>
      </form>
        {
          succesfulRegister && (
            <Snackbar
              open={showAlert}
              autoHideDuration={4000}
              onClose={() => onCloseSnackbar()} 
              message={'El registro se realizo correctamente. ¡Ya podes loguearte!'}
              sx={{
                '& .MuiSnackbarContent-root': {
                px: 2,  maxWidth: '500px'
                }
              }}
            />
          )
        }
    </AuthLayout>
  );
};
