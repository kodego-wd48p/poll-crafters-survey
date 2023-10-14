import axios from 'axios';
import router from './router';

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`
})

axiosClient.interceptors.request.use((config) => {
    const token ='123'; // to do!
    config.headers.Authorization = `Bearer ${localStorage.getItem('TOKEN')}`
    return config
});

axiosClient.interceptors.response.use(response => {
    return response;
}, error => {
    if(error.response && error.response.status === 401) { //check if it has an error status of 401
        router.navigate('/login'); // if status is 401 redirect it to the login page    
        return error;
    }
    throw error; //if the status is not 401 then throw error    
})

export default axiosClient;