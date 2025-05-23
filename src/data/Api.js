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
     const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/products`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil data produk:', error);
    return null;
  }
};

export const buatProducts = async (dataproduk) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.post(`${BASE_URL}/products`, dataproduk, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    return null
  }
};

export const updateProduct = async (productId, updatedData) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.patch(`${BASE_URL}/products/${productId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    console.log(response)
    return response.data;
  } catch (error) {
    console.error(`Gagal mengupdate produk dengan ID ${productId}:`, error);
    return null;
  }
};

export const searchProduct = async (query) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${BASE_URL}/products/search?`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      params: {
        nama: query,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Gagal menghapus produk dengan ID ${productId}:`, error);
    return null;
  }
};

export const deleteProduct = async (productId) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.delete(`${BASE_URL}/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Gagal menghapus produk dengan ID ${productId}:`, error);
    return null;
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
