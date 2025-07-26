import axios from 'axios';
const apiClient = axios.create({
  baseURL: 'https://computer-shop-4sqx.onrender.com/api/',
  // baseURL: 'http://localhost:3000/api/',
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
export const apiService = {
  staffLogin: async (email, password) => {
    try {
      const response = await apiClient.post(`staff/login`, { email, password })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  },
  sendVerificationCode: async (phoneNumber) => {
    try {
      const response = await apiClient.post('user/request-otp', { phone_number: phoneNumber });
      return response.data;
    } catch (error) {
      console.error("API Error (sendVerificationCode):", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || "Failed to send verification code.";
      throw new Error(errorMessage);
    }
  },

  verifyCode: async (phoneNumber, code) => {
    try {
      const response = await apiClient.post('user/verify-otp', { phone_number: phoneNumber, code: parseInt(code, 10) });
      return response.data;
    } catch (error) {
      console.error("API Error (verifyCode):", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || "Failed to verify code.";
      throw new Error(errorMessage);
    }
  },
  getAllPromotions: async () => {
    try {
      const response = await apiClient.get('promotions');
      return response.data;
    } catch (error) {
      console.error("API Error (getAllPromotions):", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to fetch promotions");
    }
  },

  createPromotion: async (promotionData) => {
    try {
      const response = await apiClient.post('promotions', promotionData);
      return response.data;
    } catch (error) {
      console.error("API Error (createPromotion):", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to create promotion");
    }
  },

  updatePromotion: async (id, updateData) => {
    try {
      const response = await apiClient.put(`promotions/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error("API Error (updatePromotion):", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to update promotion");
    }
  },

  deletePromotion: async (id) => {
    try {
      await apiClient.delete(`promotions/${id}`);
    } catch (error) {
      console.error("API Error (deletePromotion):", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to delete promotion");
    }
  },

  applyPromotionToProduct: async (productCode, promotionId) => {
    try {
      const response = await apiClient.post('promotions/apply', { productCode, promotionId });
      return response.data;
    } catch (error) {
      console.error("API Error (applyPromotionToProduct):", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to apply promotion to product");
    }
  },

  revokePromotionFromProduct: async (promotionId, productCode) => {
    try {
      await apiClient.delete(`promotions/revoke/${promotionId}/${productCode}`);
    } catch (error) {
      console.error("API Error (revokePromotionFromProduct):", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to revoke promotion from product");
    }
  },
  applyPromotionBatch: async (data) => {
    try {
      const response = await apiClient.post('/promotions/apply-batch', data);
      return response.data;
    } catch (error) {
      console.error("API Error (applyPromotionBatch):", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to apply promotion batch");
    }
  },
  getOrdersByCustomerId: async (customerId) => {
    try {
      const response = await apiClient.get(`user/${customerId}/orders`);
      return response.data;
    } catch (error) {
      console.error("API Error (getOrdersByCustomerId):", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to fetch customer orders");
    }
  },
  updateOrderStatus: async (orderId, newStatus) => {
    try {
      const response = await apiClient.patch(`/order/${orderId}/status`, { order_status: newStatus });
      return response.data;
    } catch (error) {
      console.error("API Error (updateOrderStatus):", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to update order status");
    }
  },

  getOneCustomer: async (customerId) => {
    try {
      const response = await apiClient.get(`user/all`, {
        params: { customer_id: customerId },
      });
      return response.data;
    } catch (error) {
      console.error('API Error (getOneCustomer):', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to fetch customer profile");
    }
  },
  getAllCustomers: async (params = {}) => {
    try {
      const response = await apiClient.get('/user/all', { params });
      return response.data;
    } catch (error) {
      console.error("API Error (getAllCustomers):", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to fetch customers");
    }
  },

  updateCustomer: async (customerId, updateData) => {
    try {
      const response = await apiClient.put(`/user/${customerId}`, updateData);
      return response;
    } catch (error) {
      console.error("API Error (updateCustomer):", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to update customer");
    }
  },

  registerCustomer: async (customerData) => {
    try {
      const response = await apiClient.post('/user/register', customerData);
      return response.data;
    } catch (error) {
      console.error("API Error (registerCustomer):", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to register customer");
    }
  },

  getAddressCustomer: async (customerId) => {
    try {
      const response = await apiClient.get(`address-customer/${customerId}`);
      return response.data.data || []; // Assuming addresses are in response.data.data
    } catch (error) {
      console.error("API Error (getAddressCustomer):", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to fetch user addresses");
    }
  },

  addAddressCustomer: async (customerId, addressData) => {
    try {
      const response = await apiClient.post(`address-customer`, {
        customer_id: customerId,
        street_line: addressData.street_line || '',
        commune: addressData.commune || '', // Ensure this matches your backend's expectation if not provided by form
        district: addressData.district,
        province: addressData.province,
        google_map_link: addressData.google_map_link || null, // Ensure this matches your backend's expectation if not provided by form
      });
      return response.data;
    } catch (error) {
      console.error("API Error (addAddressCustomer):", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to add new address");
    }
  },

  updateAddressCustomer: async (addressId, updateData) => {
    try {
      const response = await apiClient.put(`address-customer/${addressId}`, updateData);
      return response.data;
    } catch (error) {
      console.error("API Error (updateAddressCustomer):", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to update address");
    }
  },


  deleteAddressCustomer: async (addressId) => {
    try {
      const response = await apiClient.delete(`address-customer/${addressId}`);
      return response.data;
    } catch (error) {
      console.error("API Error (deleteAddressCustomer):", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to delete address");
    }
  },

  placeOrder: async (customerId, addressId, expressHandle) => {
    try {
      const payload = {
        customer_id: customerId,
        address_id: addressId,
        express_handle: expressHandle

      };
      const response = await apiClient.post(`checkout/place-order`, payload);
      return response.data;
    } catch (error) {
      console.error("API Error (placeOrder):", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to place order");
    }
  },

  getKhqr: async (amountPay, orderId, typeCurrency) => {
    try {
      const response = await apiClient.post(`checkout/get-khqr`, {
        amount_pay: amountPay,
        order_id: orderId,
        typeCurrency: typeCurrency,
      });
      return response.data;
    } catch (error) {
      console.error("API Error (getKhqr):", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to generate KHQR");
    }
  },
  checkPaymentStatus: async (uniqueMd5, orderId) => {
    try {
      const response = await apiClient.post(`checkout/check-payment`, {
        unique_md5: uniqueMd5,
        order_id: orderId,
      });
      return response.data;
    } catch (error) {
      console.error("API Error (checkPaymentStatus):", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to check payment status");
    }
  },
  userRegister: async (name, phone_number, password, profile_url = '') => {
    try {
      const response = await apiClient.post(`user/register`, { name, phone_number, password, profile_url })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch cart items");
    }
  }
  ,
  userLogin: async (phone_number, password) => {
    try {
      const response = await apiClient.post(`user/login`, { phone_number, password })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch cart items");
    }
  },
  getCartItems: async (customerId) => {
    try {
      const response = await apiClient.get(`cart-item/${customerId}`);
      return response.data;
    } catch (error) {
      console.error("API Error (getCartItems):", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to fetch cart items");
    }
  },

  addToCartItem: async (customerId, productCode, qty, priceAtPurchase) => {
    try {
      const response = await apiClient.post(`cart-item/${customerId}`, {
        product_code: productCode,
        qty: qty,
        price_at_purchase: priceAtPurchase,
      });
      return response.data;
    } catch (error) {
      console.error("API Error (addToCartItem):", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to add item to cart");
    }
  },

  updateCartItemQuantity: async (customerId, productCode, qty) => {
    try {
      const response = await apiClient.put(`cart-item/${customerId}`, {
        product_code: productCode,
        qty: qty,
      });
      return response.data;
    } catch (error) {
      console.error("API Error (updateCartItemQuantity):", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to update cart item quantity");
    }
  },

  removeCartItem: async (customerId, productCode) => {
    try {
      const response = await apiClient.delete(`cart-item/${customerId}`, {
        data: { product_code: productCode },
      });
      return response.data;
    } catch (error) {
      console.error("API Error (removeCartItem):", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to remove item from cart");
    }
  }
  ,
  getOrderSummary: async () => {
    try {
      const response = await apiClient.get('order/summary');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch Order stats");
    }
  },
  getOrders: async ({ page = 1, limit = 10, sortBy = 'date', sortType = 'ASC', includeItem = false }) => {
    try {
      const response = await apiClient.get('order', {
        params: { page, limit, sortBy, sortType, includeItem }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch orders");
    }
  },
  getUserOrderdetail: async (order_id) => {
    try {
      const response = await apiClient.get(`order/${order_id}`)
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch orders");
    }
  },
  getStoreStatsCount: async (tables) => {
    try {
      const response = await apiClient.post('store-infor/counts', tables);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch dashboard stats");
    }
  },
  getStoreSaleInfor: async (topProduct) => {
    try {
      const response = await apiClient.get(`store-infor/sales?top=${topProduct}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch type file");
    }
  }
  ,
  // Recovery API 
  getFileRecovery: async () => {
    try {
      const response = await apiClient.get('recovery-db/file');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch type file");
    }
  },
  startRecovery: async (fileList) => {
    try {
      // The body should be an object with the key 'fileRestoreList'
      const response = await apiClient.post('recovery-db', { fileRestoreList: fileList });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to start database recovery");
    }
  },
  // --- Product API
  getProducts: async (query_param) => {
    try {
      const response = await apiClient.get('product', {
        params: query_param,
      });
      console.log("Sending query:", query_param);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch products:', error.message);
      throw error;
    }
  },
  getProductDetail: async (product_id) => {
    try {
      const response = await apiClient.get(`product/${product_id}/detail`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch products:', error.message);
      throw error;
    }
  },
  addFeedbackForProduct: async (customer_id, product_id, rating, comment) => {
    try {
      const response = await apiClient.post(`product/${product_id}/feedback`, {
        customer_id: customer_id,
        rating: rating,
        comment: comment
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch products:', error.message);
      throw error;
    }
  },
  getOneProduct: async (product_id) => {
    try {
      const response = await apiClient.get(`product/${product_id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch products:', error.message);
      throw error;
    }
  },

  addNewProduct: async (productData) => {
    try {
      const response = await apiClient.post('product/', productData);
      return response.status;
    } catch (error) {
      console.error('API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to Create Product");
    }
  },

  deleteProduct: async (productId) => {
    try {

      const response = await apiClient.delete(`product/${productId}`);
      return response.status;
    } catch (error) {
      console.error('API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to delete product");
    }
  },
  updateProduct: async (productCode, updateData) => {
    try {
      const response = await apiClient.put(`product/${productCode}`, updateData);
      return response.data;
    } catch (error) {
      console.error('API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to update product");
    }
  },


  // --- Generic Data Fetching ---
  getAllCategories: async () => {
    try {
      const response = await apiClient.get('category');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch categories");
    }
  },

  getAllTypeProducts: async () => {
    try {
      const response = await apiClient.get('type-product');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch type products");
    }
  },

  getAllBrands: async () => {
    try {
      const response = await apiClient.get('brand');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch brands");
    }
  },

  // --- Category Management ---
  createCategory: async (categoryData) => {
    try {
      const response = await apiClient.post('category', categoryData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create category");
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      const response = await apiClient.put(`category/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update category");
    }
  },

  deleteCategory: async (id) => {
    try {
      const response = await apiClient.delete(`category/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete category");
    }
  },

  // --- Brand Management ---
  createBrand: async (brandData) => {
    try {
      const response = await apiClient.post('brand', brandData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create brand");
    }
  },

  updateBrand: async (id, brandData) => {
    try {
      const response = await apiClient.put(`brand/${id}`, brandData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update brand");
    }
  },

  deleteBrand: async (id) => {
    try {
      const response = await apiClient.delete(`brand/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete brand");
    }
  },

  // --- Type Product Management ---
  createTypeProduct: async (typeData) => {
    try {
      const response = await apiClient.post('type-product', typeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create type product");
    }
  },

  updateTypeProduct: async (id, typeData) => {
    try {
      const response = await apiClient.put(`type-product/${id}`, typeData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update type product");
    }
  },

  deleteTypeProduct: async (id) => {
    try {
      const response = await apiClient.delete(`type-product/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete type product");
    }
  },

  uploadImageToCloudinary: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await apiClient.post('service/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return res.data.url;

    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to upload image");
    }
  },

  // --- User API Calls ---
  getUsers: async () => {
    try {
      const response = await apiClient.get('db/users');
      const users = response.data;

      // The logic to augment users with permissions remains the same
      const augmentedUsers = await Promise.all(users.map(async (user) => {
        const perms = await apiService.getUserPermissions(user.User, user.Host);
        const roles = perms
          .filter(p => p.toUpperCase().startsWith('GRANT `'))
          .map(p => p.match(/`([^`]+)`/)[1]);
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 90);
        return { ...user, roles, expireDate: expireDate.toISOString().slice(0, 10) };
      }));
      return augmentedUsers;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  createUser: async (userData) => {
    try {
      const response = await apiClient.post('db/users', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create user');
    }
  },

  dropUser: async (username, host = '%') => {
    try {
      // For DELETE with body, axios uses the 'data' property in the config object
      const response = await apiClient.delete(`db/users/${username}`, { data: { host } });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  },

  grantRoleToUser: async (roleName, username, host = '%') => {
    try {
      const response = await apiClient.post('db/users/grant-role', { roleName, username, host });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to grant role');
    }
  },

  getUserPermissions: async (username, host = '%') => {
    try {
      const response = await apiClient.get(`db/users/${username}/permissions`, { params: { host } });
      const data = response.data;
      return data.grants ? data.grants.map(g => Object.values(g)[0]) : [];
    } catch (error) {
      // Gracefully return an empty array on failure, as in the original code
      console.error(`Could not fetch permissions for user: ${username}`, error);
      return [];
    }
  },

  // --- Role API Calls ---
  getRoles: async () => {
    try {
      const response = await apiClient.get('db/roles');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch roles');
    }
  },

  createRole: async (roleName) => {
    try {
      const response = await apiClient.post('db/roles', { roleName });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create role');
    }
  },

  dropRole: async (roleName) => {
    try {
      const response = await apiClient.delete(`db/roles/${roleName}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete role');
    }
  },

  grantPermissionsToRole: async (data) => {
    try {
      const response = await apiClient.post('db/roles/grant-permissions', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to grant permissions');
    }
  },

  getRolePermissions: async (roleName) => {
    try {
      const response = await apiClient.get(`db/roles/${roleName}/permissions`);
      const data = response.data;
      return data.grants ? data.grants.map(g => Object.values(g)[0]) : [];
    } catch (error) {
      console.error(`Could not fetch permissions for role: ${roleName}`, error);
      return [];
    }
  },

  getTables: async () => {
    try {
      const response = await apiClient.get('db/tables');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch tables');
    }
  },
  grantPermissionsToUser: async (data) => {
    try {
      const response = await apiClient.post('db/users/grant-permissions', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to grant user permissions');
    }
  },

  /**
   * Revokes specific permissions directly from a user.
   */
  revokePermissionsFromUser: async (data) => {
    try {
      const response = await apiClient.post('db/users/revoke-permissions', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to revoke user permissions');
    }
  },

  /**
   * Updates the password expiration for a user.
   */
  updateUserExpiry: async (data) => {
    try {
      const response = await apiClient.post('db/users/update-expiry', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user expiry');
    }
  },

  /**
   * Revokes permissions from a role. Ensure this exists for the "Edit Role" modal.
   */
  revokePermissionsFromRole: async (data) => {
    try {
      const response = await apiClient.post('db/roles/revoke-permissions', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to revoke role permissions');
    }
  },

  // --- Staff Profile Upload ---
  uploadProfileImage: async (formData) => {
    try {
      const response = await apiClient.post('staff/upload-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to upload staff profile image");
    }
  },
};
