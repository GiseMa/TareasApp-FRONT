import { createContext, useContext, useEffect, useReducer } from "react";
import taskApi from "../api/taskApi";
import { authReducer } from "./authReducer";
import { taskReducer } from "./taskReducer";

import { types } from "./types";
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

 const init = () =>{

   const token = localStorage.getItem('token');
   
   return {
    logged: !!token,
    user: null,
    token,
    errorMsg: null,
    checking: true,
    succesfulRegister: false,
   }
}

export const AuthProvider = ({children}) => {

    const [authState, dispatch] = useReducer(authReducer, {}, init);
    const [taskState, taskDispatch] = useReducer(taskReducer);
    const navigate = useNavigate();

    const checkToken = async () => {

        if(!localStorage.getItem('token')) {
            dispatch({type: types.logout})
        
            navigate('/auth/login', { replace: true }); 
            return
        }

        try {
            const resp = await taskApi.get('/auth/renew');
            const data = resp.data;

            if(data.ok && data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                dispatch({ type: types.login, payload: data.user});
            }

            dispatch({ type: types.finishChecking });
        } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            const msg = error.response?.data?.msg || error.message;
            console.log('Error validando el token:', error);
            dispatch({type: types.logout});
            setError(msg);

            return {ok: false, errorMsg: msg};
        };

    };

    useEffect(() => {
      checkToken();
    }, [])
    
    const login = async ({email, password}) => {

        try {
            const resp = await taskApi.post('/auth/login', {email, password});

            const data = resp.data;

            if(data.ok) {
                const user = {
                    uid: data.uid,
                    name: data.name,
                }
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(user));

                dispatch({ type: types.login, payload: user});
                return {ok: true};
            }

        } catch (error) {
            const msg = error.response?.data?.msg || error.message;
            dispatch({type: types.logout});
            setError(msg);
            return {ok: false, errorMsg: msg};
        };

    };

    const logout = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        taskDispatch({type: types.resetTasks});
        dispatch({type: types.logout})
    };

    const onLogout = async () => {
        await logout();
        navigate('/auth/login', {
            replace: true,
        });
    };


    const register = async ({name, email, password}) => {
        try {
            const resp = await taskApi.post('/auth/register', {name, email, password});

            const data = resp.data;

            if(data.ok) {            
                dispatch({ type: types.register, payload: data.msg});
                return {ok: true, msg: data.msg};
            }

        } catch (error) {
            const msg = error.response?.data?.msg || error.message;
            setError(msg);
            return {ok: false, errorMsg: msg};
        };
    };

    const setError = (msg) => {
        dispatch({type: types.errorAuth, payload: msg});
    };

    const clearError = () => {
        dispatch({ type: types.clearErrorAuth });
    };

    const clearRegister = () => {
        dispatch({ type: types.clearRegister });
    };


    return (
        <AuthContext.Provider value={{...authState, register, login, logout,onLogout, setError, clearError, clearRegister}}>
            {children}
        </AuthContext.Provider>
    );

 };

 export const useAuth = () => useContext(AuthContext);

