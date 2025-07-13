import { types } from "./types";

export const authReducer = (state, action) => {

   switch(action.type) {
        case types.login:
            return {
                ...state,
                logged: true,
                user: action.payload,
                token: localStorage.getItem('token'),
                errorMsg: null,
                checking: false,
            };
        case types.logout:
            return {
                logged: false,
                user: null,
                token: null,
                errorMsg: action.payload || null,
                checking: false,
            };
        case types.register:
            return {
                logged: false,
                user: null,
                token: null,
                checking: false,
                succesfulRegister: true
            };
        case types.finishChecking:
            return {
                ...state,
                checking: false,
            }; 
        case types.errorAuth:
            return {
                ...state,
                errorMsg: action.payload
            };
        case types.clearErrorAuth:
            return {
                ...state,
                errorMsg: null
            };
        case types.clearRegister:
            return {
                ...state,
                succesfulRegister: false
            }
        default:
            return state;
    }
};