import AxiosApi from "./axiosApi";

export const loginApi = async (payload) => {
  try {
    const res = await AxiosApi.post('/auth/login', payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};


export const registerApi = async (payload) =>{
    try {
    const res = await AxiosApi.post('/auth/register', payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

export const forgotPasswordApi = async (payload) =>{
    try {
    const res = await AxiosApi.post('/auth/forgot-password', payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}