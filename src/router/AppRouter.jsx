import { Box, CircularProgress } from "@mui/material";
import { Navigate, Route, Routes } from "react-router-dom";
import { useContext } from "react"
import { AuthContext } from "../context"
import { TasksPage, LoginPage, RegisterPage } from "../task/pages";
import { TaskLayout } from "../task/layout/TaskLayout";

export const AppRouter = () => {

  const {logged, checking} = useContext(AuthContext);

  if (checking) {
    return (
      <TaskLayout title="Cargando...">
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "60vh", width: "100%" }}>
          <CircularProgress size={70}/>
        </Box>
      </TaskLayout>
    );
  }

  return (
    <>
      <Routes>
        {
          (logged) ?
          (
            <>
              <Route path='/tareas' element={<TasksPage/>}/> 
              <Route path='/*' element={<Navigate to='/tareas'/>}/> 
            </>
          ) :
          (
            <>
            <Route path='/auth/login' element={<LoginPage/>}/> 
            <Route path='/auth/registro' element={<RegisterPage/>}/> 
            <Route path="/*" element={<Navigate to='/auth/login'/>}/>
            </>
          )   
        }

      </Routes>
    </>
  )
}

