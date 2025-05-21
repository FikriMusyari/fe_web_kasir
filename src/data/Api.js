import axios from 'axios';

const BASE_URL = 'https://api-kantin-hono.up.railway.app/api';

export const getUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil data pengguna:', error);
    return [];
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Terjadi kesalahan saat mengambil data pengguna dengan ID ${userId}:`, error);
    return null;
  }
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${BASE_URL}/users/current`, {
      headers: {
        "Authorization": `Bearer ${token}`, 
      },
    });

    return response.data;
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil data pengguna yang sedang login:', error);
    return null;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/login`, credentials);
    return response.data;
  } catch (error) {
    console.error('Login gagal:', error);
    return null;
  }
};
export const addUser = async (newUser) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(newUser)
    });

    if (!response.ok) throw new Error('Gagal menambahkan user');

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};


export const getProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/products`);
    return response.data;
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil data produk:', error);
    return [];
  }
};

export const buatProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/products`);
    return response.data;
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil data produk:', error);
    return [];
  }
};

export const getTransactions = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/transactions`);
    return response.data;
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil data transaksi:', error);
    return [];
  }
};

export const getReports = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/reports`);
    return response.data;
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil data laporan:', error);
    return [];
  }
};
