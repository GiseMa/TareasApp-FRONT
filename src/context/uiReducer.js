import { types } from "./types";

export const uiReducer = (state, action) => {

    switch(action.type) {
        case types.openModal:
            return {
                ...state,
                isModalOpen: true,
            };
        case types.closeModal: 
            return {
                ...state,
                isModalOpen: false,
            };
        default:
            return state;
        }
}