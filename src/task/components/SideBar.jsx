import { Box, Button, Divider, Drawer, Stack, Typography} from "@mui/material"
import SaveIcon from '@mui/icons-material/Save';
import DynamicFeedOutlinedIcon from '@mui/icons-material/DynamicFeedOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import { useMemo } from "react";
import { useUI,useTask } from '../../context';

export const SideBar = ({drawerWidth = 240, onDeleteSelected, onCompleteSelected, onUpdateTask}) => {

   const {openModal} = useUI();
   const {tasks} = useTask();

   const currentTasks = useMemo(() => tasks.length === 0, [tasks] );
   const allCompleted = useMemo(() => (
      tasks.length > 0 && tasks.every(task => task.completed) 
      ) || currentTasks, [currentTasks, tasks]
   );

  return (
     <Box component='nav' 
        sx={{width:{sm:drawerWidth}, flexShrink:{sm: 0}, '& button': { m: 1 }}}
      >
        <Drawer variant='permanent' open         
            sx={{
               display: { xs: 'block' },
               '& .MuiDrawer-paper': {
               boxSizing: 'border-box',
               width: drawerWidth,
               padding: 2, backgroundColor: '#CAD8D8',
               boxShadow: `
               rgba(0, 0, 0, 0.25) 0px 54px 55px,
               rgba(0, 0, 0, 0.12) 0px -12px 30px,
               rgba(0, 0, 0, 0.12) 0px 4px 6px,
               rgba(0, 0, 0, 0.17) 0px 12px 13px,
               rgba(0, 0, 0, 0.09) 0px -3px 5px` 
            }}}
         >
            <Typography variant="h4" gutterBottom sx={{textAlign: "center", fontWeight: "bold"}}>BRUCE</Typography>
            <Divider sx={{ mt: 2 }}/>
            <Stack direction="column" spacing={7} sx={{mt: 3, p: 2}}> 
               <Button variant="contained" sx={{backgroundColor: '#274215'}} onClick={openModal} startIcon={<SaveIcon/>}>
                  Crear tarea
               </Button>
               <Divider sx={{ mt: 2 }}/>
               <Button variant="contained" sx={{backgroundColor: '#EEA402'}} disabled={currentTasks} onClick={onUpdateTask} startIcon={<DynamicFeedOutlinedIcon/>}>
                  Editar
               </Button>
               <Divider sx={{ mt: 2 }}/>
               <Button variant="contained" sx={{backgroundColor: '#85BB4D'}} disabled={allCompleted} onClick={onCompleteSelected} startIcon={<CheckCircleOutlineOutlinedIcon/>}>
                  Marcar como completada
               </Button>      
               <Divider sx={{ mt: 2 }}/>
               <Button variant="contained" sx={{backgroundColor: '#DD7236'}} disabled={currentTasks} onClick={onDeleteSelected} startIcon={<DeleteIcon/>}>
                  Eliminar
               </Button>
               <Divider sx={{ mt: 2 }} />
            </Stack>
         </Drawer>
     </Box>
  )
}

