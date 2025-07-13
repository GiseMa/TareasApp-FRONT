import { Stack, Box, OutlinedInput, InputLabel, MenuItem, FormControl, Select, Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTask } from '../../context/TaskContext';

export const Filters = () => {

  const {filters, getFilters, saveActualFilters} = useTask();

  const [selectedFilters, setSelectedFilters] = useState({types: [], state: '', order: ''});

  useEffect(() => {
    getFilters();
  }, [])
      
  const handleChange = (event, filter) => {
    const { value } = event.target;

    setSelectedFilters((prev) => ({
      ...prev,
      [filter]: value 
    }));
  };

  const handleDelete = (filterToDelete, filter) => {
    setSelectedFilters((prev) => {
      if(filter === 'types') {
        return {
          ...prev,
          types: prev.types.filter((t) => t !== filterToDelete)
        };
      }
      return { ...prev, [filter]: ''}
    })
  };
  
  useEffect(() => {
    saveActualFilters(selectedFilters);
  }, [selectedFilters]);
  
  return (
    <Box>
        <FormControl sx={{ m: 3, width: 200}} >
          <InputLabel id="task-type-label">Tipo de Tarea</InputLabel>
          <Select
            labelId="task-type-label"
            id="task-type-select"
            label="Tipo de tarea"
            value={selectedFilters.types}
            multiple
            onChange={(e) => handleChange(e, 'types')}
            renderValue={() => ''}  
            input={<OutlinedInput label="Tipo de tarea"/>}
          >
            {
              (filters?.types || []).map((t) => (
                <MenuItem key={t.name} value={t.name}>{t.name}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
        <FormControl sx={{ m: 3, width: 200 }}>
          <InputLabel id="task-state">Estado</InputLabel>
          <Select
            labelId="task-state"
            id="task-state-select"
            label="Estado"
            value={selectedFilters.state}
            onChange={(e) => handleChange(e, 'state')}
            renderValue={() => ''}  
            input={<OutlinedInput label="Estado de tarea" />}
          >
            {
              (filters?.state || []).map((s) => (
                <MenuItem key={s.name} value={s.name}>{s.name}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
        <FormControl sx={{ m: 3, width: 200 }}>
          <InputLabel id="task-order">Fecha de inicio</InputLabel>
          <Select
            labelId="task-order"
            id="task-order-select"
            label="Fecha"
            value={selectedFilters.order}
            onChange={(e) => handleChange(e, 'order')}
            renderValue={() => ''}  
            input={<OutlinedInput label="Ordenamiento" />}
          >
            {
              (filters?.order || []).map((d) => (
                <MenuItem key={d.name} value={d.name}>{d.name}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {
            selectedFilters.types.map((type) => (
              <Chip key={type} label={type} variant="outlined" onDelete={() => handleDelete(type, 'types')} />
            ))
          }
          {
            selectedFilters.state && (
               <Chip key={selectedFilters.state} label={selectedFilters.state} variant='outlined' onDelete={() => handleDelete(selectedFilters.state, 'state')}/>
            )
          }
          {
            selectedFilters.order && (
              <Chip 
                  key={selectedFilters.order} 
                  label={selectedFilters.order} 
                  variant="outlined" 
                  onDelete={() => handleDelete(selectedFilters.order, 'order')} 
              />
            )
          }
        </Stack>
    </Box>
  );
};
