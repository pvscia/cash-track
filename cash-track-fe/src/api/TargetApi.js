import AxiosApi from "./axiosApi";

export const getTargetApi = async () => {
  try {
    const res = await AxiosApi.get('/targets/getAll');
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};


export const addTargetApi = async (payload) => {
  try {
    const res = await AxiosApi.post('/targets/add', payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const updateTargetApi = async (payload) => {
  try {
    const res = await AxiosApi.put('/targets/update', payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const deleteTargetApi = async (payload) => {
  try {
    const res = await AxiosApi.delete('/targets/delete', {
      data: payload
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};