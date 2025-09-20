import { createContext, useContext, useReducer } from "react";
import taskApi from "../api/taskApi";
import { taskReducer } from "./taskReducer";
import { types } from "./types";

const TaskContext = createContext();

const initialState = {
    tasks: [],
    filters: [],
    applyFilters: {types: [], state: '', order: ''},
    isLoading: false,
    error: null,
}

export const TaskProvider = ({children}) => {

    const [taskState, dispatch] = useReducer(taskReducer, initialState);

    const getTasks = async () => {
        try {
            const {data} = await taskApi.get('/tasks');
            dispatch({type: types.loadTasks, payload: data.tasks});
            return {ok: true};
        } catch (error) {
            console.log('Error al obtener las tareas: ', error);
            const msg = error.response?.data?.msg || '[FRONT] No se pudieron cargar las tareas';
            dispatch({type: types.errorTask, payload: msg});
            return {ok: false, errorMsg: msg};
        };
    };

    const createTask = async (task) => {
        
        try {
            const {data} = await taskApi.post('/tasks', task);
            dispatch({type: types.saveTask, payload: data.task});
            return {ok: true};
        } catch (error) {
            console.log('Error guardando la tarea: ', error);
            const msg = error.response?.data?.msg
            dispatch({type: types.errorTask, payload: msg});
            return {ok: false, errorMsg: msg};
        };
    };
    
     const updateTask = async (task, updatedData) => {
        try {
            const {data} = await taskApi.put(`/tasks/${task.id}`, updatedData);
            dispatch({type: types.updateTask, payload: data.task})
            return {ok: true};
        } catch (error) {
            console.log('Error actualizando la tarea: ', error);
            const msg = error.response?.data?.msg
            dispatch({type: types.errorTask, payload: msg});
            return {ok: false, errorMsg: msg};
        };
    };

    const completeTask = async (task) => {
        try {
            const {data} = await taskApi.patch(`/tasks/${task.id}`);
            dispatch({type: types.updateTask, payload: data.task})
            return {ok: true};
        } catch (error) {
            console.log('Error actualizando la tarea: ', error);
            const msg = error.response?.data?.msg
            dispatch({type: types.errorTask, payload: msg});
            return {ok: false, errorMsg: msg};
        };
    };
 

    const deleteTask = async (task) => {
        try {
            const { data } = await taskApi.delete(`/tasks/${task.id}`);
            dispatch({type: types.deleteTask, payload: task})
            return {ok: true};
        } catch (error) {
            console.log('Error eliminando la tarea: ', error);
            const msg = error.response?.data?.msg
            dispatch({type: types.errorTask, payload: msg});
            return {ok: false, errorMsg: msg};
        };
    };

    const getFilters = async () => {
        try {
            const {data} = await taskApi.get(`/tasks/filters`);
            dispatch({type: types.loadFilters, payload: data})
            return {ok: true};
        } catch (error) {
            console.log('Error obteniendo tipos de filtros: ', error);
            const msg = error.response?.data?.msg
            dispatch({type: types.errorTask, payload: msg});
            return {ok: false, errorMsg: msg};
        };
    };

    const saveActualFilters =  (selectedFilters) => {
        dispatch({type: types.saveActualFilters, payload: selectedFilters})
        return {ok: true};
    
    };
    

    return (
        <TaskContext.Provider value={{...taskState, getTasks, createTask, updateTask, deleteTask,  completeTask, getFilters, saveActualFilters}}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTask = () =>  useContext(TaskContext);