import AxiosApi from "./axiosApi";

export const getCategoryApi = async () => {
  try {
    const res = await AxiosApi.get('/categories/getAll');
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};


export const addCategoryApi = async (payload) => {
  try {
    const res = await AxiosApi.post('/categories/add', payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const updateCategoryApi = async (payload) => {
  try {
    const res = await AxiosApi.put('/categories/update', payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const deleteCategoryApi = async (payload) => {
  try {
    const res = await AxiosApi.delete('/categories/delete', {
      data: payload
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};