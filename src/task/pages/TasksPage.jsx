import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Snackbar, Stack, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from "react";
import { useTask, useUI } from "../../context"
import { TaskModal, Filters } from "../components";
import { TaskLayout } from "../layout/TaskLayout";

export const TasksPage = () => {

  const {getTasks, tasks, isLoading, deleteTask, completeTask, applyFilters} = useTask();
  const {openModal} = useUI();

  const [editTask, setEditTask] = useState(null);
  const [showAlert, setShowAlert] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState([]);
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    getTasks();

  }, []);

  const handleToggle =  (value) =>  () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);

    }
    
    setChecked(newChecked);
  };
  const handleDeleteSelected = async () => {
    
   if(checked.length === 0) {
      setShowAlert({open: true, message: 'Tenés que elegir por lo menos una tarea para eliminar'});
      return;
    }

    const selectedTasks = tasks.filter(t => checked.includes(t.id));
    const isCompleted = selectedTasks.some(t => t.completed);

    if (isCompleted) {
      setTaskToDelete(selectedTasks);
      setConfirmationDialog(true);    
    } else {
      for(const task of selectedTasks) {
        await deleteTask(task);
      }
    }

    setChecked([]);
  };

  const handleConfirmSave = async () => {

    for (const task of taskToDelete) {
      await deleteTask(task);
    };
    setChecked([]);
    setTaskToDelete([]);
    setConfirmationDialog(false);
  };

  const handleCancelSave = () => {
    setTaskToDelete([]);
    setConfirmationDialog(false);
  };

  const handleCompleteSelected = async () => {

    if(checked.length === 0) {
      setShowAlert({open: true, message: 'Tenés que elegir por lo menos una tarea para marcar como completada'});
      return;
    };

    const hasCompleted = checked.some(taskId => {
      const task = tasks.find(t => t.id === taskId);
      return task?.completed;
    });

    if(hasCompleted) {
      setShowAlert({open: true, message: 'Debe seleccionar únicamente tareas pendientes'});
      return;
    };

    for(const taskId of checked) {
      const task = tasks.find(t => t.id === taskId);
      if(task) await completeTask(task, {completed: true});
    };
    
    setChecked([]);
  };


  const handleUpdateTask = async () => {

    if(checked.length === 0 || checked.length > 1) {
      setShowAlert({open: true, message: 'Tenés que elegir una única tarea para modificar'});
      return;
    }

    const taskId = checked[0];
    const task = tasks.find(t => t.id === taskId);
    if(task) {
      setEditTask(task);
      setIsEditMode(true);
      openModal()
    } 

    setChecked([]);
  };

  const areThereFilters = applyFilters.types.length > 0 || applyFilters.state !== '';

  const tasksWithFilters = areThereFilters ? tasks.filter(task => {

    const getType = applyFilters.types.length === 0 || applyFilters.types.includes(task.type);
    const getState = applyFilters.state === '' ||
                     (applyFilters.state === 'Completadas' && task.completed) ||
                     (applyFilters.state === 'Pendientes' && !task.completed) ||
                     (applyFilters.state === 'Todas');
    
    return getType && getState;
  }) : tasks;

  let visibleTasks = tasksWithFilters.filter((t) => {
    if(applyFilters.state !== 'Todas') {
      return !t.eliminated;
    }
    return true;
  });

  if(applyFilters.order.includes('Mas antiguo')) {
    visibleTasks.sort((a, b) => new Date(a.start) - new Date(b.start));
  } else if(applyFilters.order.includes('Mas reciente')) {
    visibleTasks.sort((a, b) => new Date(b.start) - new Date(a.start));
  };

    if (isLoading) {
      return (
        <TaskLayout title="Cargando...">
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: "60vh", width: "100%" }}>
            <CircularProgress size={70}/>
          </Box>
        </TaskLayout>
      );
    }

  return (
    <TaskLayout  
      taskActions={{
        onDeleteSelected: handleDeleteSelected,
        onCompleteSelected: handleCompleteSelected, 
        onUpdateTask: handleUpdateTask
     }}
    >
      <Typography variant="h4" gutterBottom sx={{fontWeight: "bold", }}>LISTA DE TAREAS</Typography>
      <Filters/>
      <TaskModal task={editTask} isEditMode={isEditMode} setIsEditMode={setIsEditMode} setEditTask={setEditTask}/>
          {
            !isLoading && visibleTasks.length === 0  ? (
              <Alert severity="error" sx={{py: 3, mt: 3, mx: 'auto', width: 'fit-content' ,backgroundColor: '#D98958'}}>
                No hay tareas guardadas
              </Alert>
            ) : 
            (
             <Stack spacing={2} sx={{width: '100%', maxWidth: 'md', mx: 'auto', px: {xs: 0, sm: 2, md: 4}, alignItems: 'stretch', py: 3}} >
               {
                visibleTasks.map((t) => {
                    const labelId = `checkbox-list-label-${t.id}`;
                    return (
                      <Grid grid={{xs: 12, sm: 6}}  key={t.id}>
                        <Accordion 
                          key={t.id}
                          sx={{ width: '100%', mb: 2, backgroundColor: t.completed ? '#9FCC6D' :'#F1B634'}}>
                          <AccordionSummary
                              expandIcon={<ExpandMoreIcon/>} 
                              aria-controls="panel1bh-content"
                              id="panel1bh-header"
                              sx={{minHeight: 56}}
                            >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%'}}>
                              {
                                !t.eliminated &&
                                <Checkbox 
                                  edge="start"
                                  checked={checked.includes(t.id)} 
                                  onChange={handleToggle(t.id)}
                                  onClick={(event) => event.stopPropagation()}
                                  tabIndex={-1}
                                  disableRipple
                                  inputProps={{ 'aria-label': labelId }}
                                />
                              }
                              <Box sx={{display: 'flex', justifyContent:'space-between', alignItems:'center', flex: 1}}>
                                <Typography fontWeight="bold">{t.title}</Typography>
                                 <Typography sx={{ whiteSpace: 'pre-line', flexDirection: 'row-reverse', pr: 4}}>
                                      <strong>Inicio: </strong>  {new Date(t.start).toLocaleString()}
                                 </Typography>
                              </Box>                            </Box>
                          </AccordionSummary>
                          <AccordionDetails sx={{px: 3}}>
                              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1, width: '100%' }}>
                                <Box sx={{flex: 1}}> 
                                  <Typography sx={{ whiteSpace: 'pre-line' }}>
                                     <strong>Detalle: </strong> {t.text}
                                  </Typography>
                                </Box>
                                <Box sx={{ display: { xs: 'none', sm: 'block' }, borderLeft: '2px solid #CAD8D8', mx: 2 }} />
                                  <Box sx={{flex: 1, display: 'flex', flexDirection: "column", gap: 1}}>
                                   <Typography sx={{ whiteSpace: 'pre-line' }}>
                                      <strong>Tipo: </strong> {t.type}
                                    </Typography>
                                    <Typography sx={{ whiteSpace: 'pre-line' }}>
                                      <strong>Inicio: </strong> {new Date(t.start).toLocaleString()}
                                    </Typography>
                                    <Typography sx={{ whiteSpace: 'pre-line' }}>
                                      <strong>Fin: </strong> {new Date(t.end).toLocaleString()}
                                    </Typography>
                                    <Typography sx={{ whiteSpace: 'pre-line' }}>
                                      <strong>Estado: </strong>
                                      {t.eliminated ? 'Completada y elimininada' : t.completed ? 'Completada' : 'Pendiente'}
                                    </Typography>
                                  </Box>
                                </Box>
                              <Box sx={{display: 'flex', flexDirection:'column', gap: 1}}> 
                            </Box>
                          </AccordionDetails>
                       </Accordion>
                      </Grid>
                    );
                  }   
                )}
              </Stack>  
            )}
            {
              showAlert && (
                <Snackbar
                  open={showAlert}
                  autoHideDuration={5000}
                  onClose={() => setShowAlert(false)} 
                  message={showAlert.message}
                  sx={{
                    '& .MuiSnackbarContent-root': {
                    px: 2,  maxWidth: '320px'
                    }
                  }}
                />
              )
            }
            <Dialog
              open={confirmationDialog}
              onClose={handleCancelSave}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{`¿Estás seguro de eliminar ${taskToDelete.length} tareas?`}</DialogTitle> 
              <DialogContent>
                <DialogContentText id="alert-dialog-description">Las tareas no podran seguir siendo consultadas</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancelSave} color="primary">Cancelar</Button>
                <Button onClick={handleConfirmSave} color="primary">Guardar</Button>
              </DialogActions> 
            </Dialog>
    </TaskLayout>
  ); 
};               

