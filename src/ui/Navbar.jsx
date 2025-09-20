import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useTask } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";

export const Navbar = ({drawerWidth}) => {

  const {tasks} = useTask();
  const {onLogout} = useAuth();

  return (
    <Box sx={{ flexGrow: 1 }}>
    <AppBar position="fixed" 
            sx={{ sm: `${drawerWidth}px`, width: `calc(100% - ${drawerWidth}px)`,
                  backgroundColor: '#274215', 
                  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px' 
                }}>
        <Toolbar sx={{justifyContent: "space-between", alignItems: "center"}}>
          <Box sx={{display: "flex", alignItems: "center", gap: 5}}>
              {
               tasks.filter(t => t.completed).length === 0 ?
                <Typography>¡Vos podes lograrlo!</Typography> :
                <Typography>Tareas completadas: {tasks.filter(t => t.completed).length}</Typography>
              }
              {
                tasks.filter(t => !t.completed).length === 0 && tasks.length > 0 ?
                <Typography>¡Buen trabajo!</Typography> :
                <Typography>Tareas pendientes: {tasks.filter(t => !t.completed).length}</Typography> 
              }

          </Box>
          <Button color="inherit" onClick={onLogout}>Salir</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
