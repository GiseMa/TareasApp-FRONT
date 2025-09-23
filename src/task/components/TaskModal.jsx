import { Button, Dialog, DialogActions, DialogTitle,DialogContent, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography, Checkbox, Box } from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import { addHours, addMinutes, differenceInSeconds, isBefore } from "date-fns";
import { es } from "date-fns/locale";
import DatePicker, {registerLocale} from "react-datepicker";
import { useEffect, useState } from "react";
import { useForm } from "../../hooks/useForm";
import { useTask, useUI } from "../../context";

    registerLocale("es", es);

    const taskData = {
        title: '',
        text: '',
        type: 'Escoja un tipo',
        start: new Date(),
        end: addHours(new Date(), 2),
        checkCompleted: false
    }

    const taskValidations = {
        title: [(value) => value.length >= 5, 'El título debe tener al menos cinco caracteres'],
        text:  [(value) => value.length >= 1, 'Por favor, ingrese un texto'],
        type:  [(value) => value !== 'Escoja un tipo', 'Por favor, elija un tipo de tarea'],
    }

export const TaskModal = ({task, isEditMode, setIsEditMode, setEditTask}) => {

    const {closeModal, isModalOpen} = useUI();
    const {getFilters, filters, updateTask, createTask} = useTask();

    const [taskSubmitted, setTaskSubmitted] = useState(false);
    const [dateError, setDateError] = useState(false);

    useEffect(() => {
      getFilters();
    }, []);
    
    const {
        title, titleValid,
        text, textValid,
        type, typeValid,
        start, end, checkCompleted, onResetForm,
        formState, isFormValid, onInputChange, setField,
    } = useForm(taskData, taskValidations);
    
    const isStartDateValid = !isBefore(start, addMinutes(new Date(), -30));
    const isEndDateValid = differenceInSeconds(end,start) > 0;

    useEffect(() => {
      if(!isModalOpen) return;
      if(isEditMode && task) {
        onResetForm({
            title: task.title,
            text: task.text,
            type: task.type,
            start: new Date(task.start),
            end: new Date(task.end), 
            checkCompleted: task.completed 
        });
      } else {
          onResetForm();
      }
      setTaskSubmitted(false);
      setDateError(false);
    }, [isModalOpen, isEditMode, task]);
    
     const handleCancel = () => {
        setTaskSubmitted(false);
        setDateError(false);
        setEditTask(null);
        closeModal();
    };

    /*     const onDateChanged = (date, name ) =>{
        onInputChange({
            target: {
                name: name,
                value: date
            }
        })
        if(dateError) setDateError(false);
    } 
 */

    const onDateChanged = (date, name ) =>{
        setField(name, date);
        if(dateError) setDateError(false);
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        setDateError(false);
        const difference = differenceInSeconds(formState.end, formState.start);

        setTaskSubmitted(true);

        if(!isEditMode) {
            if( (isNaN(difference) || difference <= 0 || !isStartDateValid)) {
                setDateError(true);
                return;
            };
        };

        if(!isFormValid) return;

        const formToSend = {
            ...formState, 
            completed: formState.checkCompleted
        };

        if(isEditMode && task) {
            await updateTask(task, formToSend);
            setIsEditMode(false);
        } else {
            await createTask(formToSend);
        };
    
        closeModal();
    }

  return (
    <Dialog
        open={isModalOpen}
        onClose={handleCancel}
        aria-labelledby="modal-title"
        maxWidth="sm"
        fullWidth
    >
        <DialogTitle>
            <Typography variant="h6" component="div">{isEditMode ? 'Editar tarea' : 'Nueva tarea'}</Typography>
        </DialogTitle>
        <DialogContent dividers>
            <form onSubmit={onSubmit} style={{ padding: '0 10px' }}>
                <Grid sx={{mt: 1, xs: 12, p: 1}}>
                    <TextField
                        label="Nombre de la tarea"
                        type="text" 
                        placeholder="Nombre de la tarea"
                        fullWidth
                        name="title"
                        value={title}
                        onChange={onInputChange} 
                        error={!!titleValid && taskSubmitted}
                        helperText={taskSubmitted ? titleValid : ''}
                        disabled={!!task && task.completed}
                    />
                </Grid>
                <Grid sx={{mt: 2, xs: 12, p: 1}}>
                    <TextField
                        label="Indique aqui su tarea"
                        multiline
                        placeholder="Indique aqui su tarea"
                        fullWidth
                        rows={3}
                        name="text"
                        value={text} 
                        onChange={onInputChange}   
                        error={!!textValid && taskSubmitted}
                        helperText={taskSubmitted ? textValid : ''}
                        disabled={!!task && task.completed}
                    />
                </Grid>
                <Grid  grid={{xs: 8}}  sx={{p: 2, mt: 2, xs: 12}} container>
                    <FormControl fullWidth error={!!typeValid && taskSubmitted}>
                        <InputLabel id="task-type-label">Tipo de Tarea</InputLabel>
                        <Select
                            labelId="task-type-label"
                            id="task-type-select"
                            value={type} 
                            label="Tipo de tarea"
                            name="type"
                            onChange={onInputChange}  
                            disabled={!!task && task.completed} 
                        >
                            <MenuItem value="Escoja un tipo" disabled>Escoja el tipo de tarea</MenuItem>   
                                {
                                    (filters?.types || []).map((t) => (
                                        <MenuItem key={t.name} value={t.name}>{t.name}</MenuItem>
                                    ))
                                }
                        </Select>
                        {
                            taskSubmitted && typeValid && 
                            <Typography color="error" variant="caption">{typeValid}</Typography>
                        }
                    </FormControl>
                </Grid>
                <Grid sx={{mt: 2, xs: 12}} container>
                    <Grid grid={{xs: 6}}  sx={{p: 2}}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>Fecha y hora de inicio</Typography>
                        <DatePicker
                            selected={start}
                            value={start}
                            onChange={(event) => onDateChanged(event, 'start')}
                            className="form-control"
                            dateFormat="Pp"
                            showTimeSelect
                            locale="es"
                            timeCaption="Hora"    
                            disabled={!!task && task.completed}                           
                            customInput={<TextField 
                                            fullWidth 
                                            error={!isStartDateValid && taskSubmitted && !isEditMode} 
                                            helperText={taskSubmitted && !isStartDateValid  && !isEditMode ? 
                                                       "La fecha de inicio no puede ser anterior al día actual" : ""}
                                        />}
                        />
                    </Grid>
                    <Grid grid={{xs: 6}} sx={{p: 2}}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>Fecha y hora de fin</Typography>
                        <DatePicker
                            minDate={start}
                            selected={end}
                            onChange={(event) => onDateChanged(event, 'end')}
                            className="form-control"
                            dateFormat="Pp"
                            showTimeSelect
                            locale="es"
                            timeCaption="Hora"
                            disabled={!!task && task.completed}
                            customInput={<TextField 
                                            fullWidth 
                                            error={!isEndDateValid && taskSubmitted} 
                                            helperText={taskSubmitted && !isEndDateValid && !isEditMode ? 
                                                       "La fecha de fin debe ser posterior a la de inicio" : ""}
                                        />}
                        />
                    </Grid>
                </Grid>
                {
                    isEditMode &&
                     <Grid  grid={{xs:12}} sx={{ mt: 1, px: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1">Completada</Typography>
                            <Checkbox
                                name="checkCompleted"
                                checked={checkCompleted}
                                onChange={(event) =>
                                onInputChange({
                                    target: { name: 'checkCompleted', value: event.target.checked },
                                })
                                }
                            />
                        </Box>
                    </Grid>
                } 
            </form>      
        </DialogContent>
        <DialogActions>
            <Button onClick={handleCancel} variant="outlined" color="secondary">
                 Cancelar
            </Button>
            <Button onClick={onSubmit} variant="outlined" color="primary">
                 Guardar cambios
            </Button>
        </DialogActions>
    </Dialog>
  );
};

