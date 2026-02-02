import AxiosApi from "./AxiosApi";

export const getWalletApi = async () => {
  try {
    const res = await AxiosApi.get('/wallets/getAll');
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};


export const addWalletApi = async (payload) => {
  try {
    const res = await AxiosApi.post('/wallets/add', payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const updateWalletApi = async (payload) => {
  try {
    const res = await AxiosApi.put('/wallets/update', payload);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const deleteWalletApi = async (payload) => {
  try {
    const res = await AxiosApi.delete('/wallets/delete', {
      data: payload
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};