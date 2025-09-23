import axios from "axios"

const taskApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

taskApi.interceptors.request.use(config => {
    config.headers = {
        ...config.headers,
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
    return config;
})

export default taskApi;