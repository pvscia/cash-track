import AxiosApi from "./axiosApi";

export const loginApi = async (payload) =>{
    const response = await AxiosApi.post('/auth/login',payload);
    return response.data;
}

export const registerApi = async (payload) =>{
    const response = await AxiosApi.post('/auth/register',payload);
    return response.data;
}