import { Stack, Box, OutlinedInput, InputLabel, MenuItem, FormControl, Select, Chip } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTask } from '../../context/TaskContext';

export const Filters = () => {
  const { filters, getFilters, saveActualFilters } = useTask();
  const [selectedFilters, setSelectedFilters] = useState({ types: [], state: '', order: '' });

  useEffect(() => {
    getFilters();
  }, []);

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
  
  const selectConfig = [
    { id: 'types', label: 'Tipo de Tarea', multiple: true },
    { id: 'state', label: 'Estado', multiple: false },
    { id: 'order', label: 'Fecha de inicio', multiple: false },
  ];

  return (
    <Box>
      {selectConfig.map(({ id, label, multiple }) => (
        <FormControl key={id} sx={{ m: 3, width: 200 }}>
          <InputLabel id={`${id}-label`}>{label}</InputLabel>
          <Select
            labelId={`${id}-label`}
            id={`${id}-select`}
            label={label}
            multiple={multiple}
            value={selectedFilters[id]}
            onChange={(e) => handleChange(e, id)}
            renderValue={() => ''} 
            input={<OutlinedInput label={label} />}
          >
            {(filters?.[id] || []).map((opt) => (
              <MenuItem key={opt.name} value={opt.name}>{opt.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}

      <Stack direction="row" spacing={1} flexWrap="wrap">
        {selectedFilters.types.map(type => (
          <Chip key={type} label={type} variant="outlined" onDelete={() => handleDelete(type, 'types')} />
        ))}

        {selectedFilters.state && (
          <Chip label={selectedFilters.state} variant="outlined"
                onDelete={() => handleDelete(selectedFilters.state, 'state')} />
        )}

        {selectedFilters.order && (
          <Chip label={selectedFilters.order} variant="outlined"
                onDelete={() => handleDelete(selectedFilters.order, 'order')} />
        )}
      </Stack>
    </Box>
  );
};
