import { types } from "./types";

export const taskReducer = (state, action) => {

    switch(action.type) {
        case types.loadTasks:
            return {
                ...state,
                tasks: action.payload,
                isLoading: false,
            };
        case types.saveTask: 
            return {
                ...state,
                tasks: [...state.tasks, action.payload],
            };
        case types.updateTask: 
            return {
                ...state,
                tasks: state.tasks.map(
                    task => task.id === action.payload.id ?
                    action.payload :
                    task
                )
            };
        case types.deleteTask:
            return {
                ...state,
                tasks: state.tasks.filter(task => task.id !== action.payload.id)
            };
        case types.isLaodingTask:
            return {
                ...state,
                isLoading: true,
            };
        case types.errorTask:
            return {
                ...state,
                error: action.payload
            };
        case types.resetTasks:
            return {
                ...state,
                tasks: [],
            };
        case types.loadFilters:
            return {
                ...state,
                filters: action.payload
            };
        case types.saveActualFilters:
            return {
                ...state,
                applyFilters: action.payload || {types: [], states: []}
            }
        default:
            return state;
    }
}