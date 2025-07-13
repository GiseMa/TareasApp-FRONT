import { Box, Toolbar } from "@mui/material";
import { Navbar } from "../../ui/Navbar";
import { SideBar } from "../components/SideBar";

const drawerWidth = 280;

export const TaskLayout = ({children, taskActions = {}}) => {
  return (
    <>
    <Navbar drawerWidth={drawerWidth}/>
    <Box sx={{display: 'flex', minHeight: '100vh',  backgroundColor: '#CAD8D8'}}> 
        <SideBar drawerWidth={drawerWidth} {...taskActions}/>
        {/* E7EEE7 grisesito */}
        <Box component='main' sx={{flexGrow: 1, pt: 3, px: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#CAD8D8'}}>
            <Toolbar/>
            {children}
        </Box>
    </Box>
    </>
  )
}
