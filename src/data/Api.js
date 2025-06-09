import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.errors || 'Terjadi kesalahan saat mengambil data pengguna'
    }
  }
};

const getAllUsers = async () => {
  try {
     const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/users/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Terjadi kesalahan ambil user:', error);
    return {
        success: false,
        error: error.response?.data?.errors
      }
  }
};

const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${BASE_URL}/users/current`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.errors || 'Terjadi kesalahan saat mengambil data pengguna'
    }
  }
};

const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/login`, credentials);
    return response.data;
  } catch (error) {
    console.error('Login gagal:', error);
    return {
      success: false,
      error: error.response?.data?.errors || 'Login gagal'
    }
  }
};

const addUser = async (newUser) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.post(`${BASE_URL}/users`, newUser, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.errors || 'Terjadi kesalahan saat menambahkan user'
    }
  }
};

const updateUser = async (newUser) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.patch(`${BASE_URL}/users/current`, newUser, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.errors || 'Terjadi kesalahan saat mengupdate user'
    }
  }
};


  const deleteUser = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.delete(`${BASE_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`Gagal menghapus pengguna dengan ID ${userId}:`, error);
      return {
        success: false,
        error: error.response?.data?.errors || 'Terjadi kesalahan saat menghapus pengguna'
      }
    }
  };


const getProducts = async () => {
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
    return {
        success: false,
        error: error.response?.data?.errors
      }
  }
};

const buatProducts = async (dataproduk) => {
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
    return {
        success: false,
        error: error.response?.data?.errors
      }
  }
};

const updateProduct = async (productId, updatedData) => {
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
    return {
        success: false,
        error: error.response?.data?.errors
      }
  }
};

const searchProduct = async (query) => {
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
    return {
        success: false,
        error: error.response?.data?.errors
      }
  }
};

const deleteProduct = async (productId) => {
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
    return {
        success: false,
        error: error.response?.data?.errors
      }
  }
};

const buatTransaksi = async (dataTransaksi) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.post(`${BASE_URL}/transactions`, dataTransaksi, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    return {
        success: false,
        error: error.response?.data?.errors
      }
  }
};

const getTransactions = async () => {
  try {
     const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil data produk:', error);
    return {
        success: false,
        error: error.response?.data?.errors
      }
  }
};

const searchTransactions = async (searchParams) => {
  const token = localStorage.getItem('token');
  try {
    // Build query parameters
    const params = new URLSearchParams();

    // Handle general search (quick search)
    if (searchParams.general && searchParams.general.trim()) {
      params.append('general', searchParams.general.trim());
    } else {
      // Handle specific field searches
      if (searchParams.produk && searchParams.produk.trim()) {
        params.append('produk', searchParams.produk.trim());
      }

      if (searchParams.user && searchParams.user.trim()) {
        params.append('user', searchParams.user.trim());
      }

      if (searchParams.tanggal && searchParams.tanggal.trim()) {
        params.append('tanggal', searchParams.tanggal.trim());
      }
    }

    // If no search params, return all transactions
    if (params.toString() === '') {
      return await getTransactions();
    }

    const response = await axios.get(`${BASE_URL}/transactions/search?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    return response.data;
  } catch (error) {
    console.error('Gagal mencari transaksi:', error);
    return {
        success: false,
        error: error.response?.data?.errors
      }
  }
};

const deleteTransaction = async (transactionId) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.delete(`${BASE_URL}/transactions/${transactionId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Gagal menghapus transaksi dengan ID ${transactionId}:`, error);
    return {
        success: false,
        error: error.response?.data?.errors
      }
  }
};

const getReports = async () => {
  try {
         const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}/reports`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil data laporan:', error);
    return {
        success: false,
        error: error.response?.data?.errors
      }
  }
};

export {getUserById, getCurrentUser, loginUser, addUser, updateUser, getProducts, buatProducts, updateProduct, searchProduct, deleteProduct, buatTransaksi, getTransactions, searchTransactions, deleteTransaction, getReports, deleteUser, getAllUsers};
