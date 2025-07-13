import { createContext, useContext, useReducer } from "react";
import { uiReducer } from "./uiReducer";
import { types } from "./types";

const UIContext = createContext();

const initialState = {
    isModalOpen: false,
    isLoading: false,
    error: null,
}

export const UIProvider = ({children}) => {

    const [uiState, dispatch] = useReducer(uiReducer, initialState);

    const openModal =  () => {
        dispatch({type: types.openModal});
    }

    const closeModal =  () => {
        dispatch({type: types.closeModal});
    }

    return (
        <UIContext.Provider value={{...uiState, openModal, closeModal}}>
            {children}
        </UIContext.Provider>
    );
    };
    
export const useUI = () =>  useContext(UIContext);