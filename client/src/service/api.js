import axios from 'axios';
// Create a pre-configured instance of axios
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api/',
  headers: {
    'Content-Type': 'application/json'
  }
});

const CHUNK_SIZE = 6 * 1024 * 1024; // 6MB

export const apiService = {
  getOrders: async ({ page = 1, limit = 10, sortBy = 'date', sortType = 'ASC',includeItem=false }) => {
    try {
      const response = await apiClient.get('/order', {
        params: { page, limit, sortBy, sortType,includeItem }
      });
      return response.data; 
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch orders");
    }
  },
  getStoreStatsCount: async (tables) => {
    try {
      const response = await apiClient.post('/store-infor/counts', tables);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch dashboard stats");
    }
  },
  getStoreSaleInfor:async (topProduct)=>{
    try {
      const response = await apiClient.get(`store-infor/sales?top=${topProduct}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch type file");
    }
  }
  ,
  // Recovery API 
  getFileRecovery:async () => {
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
      const response = await apiClient.get('product',{ params:query_param });
      console.log(query_param);
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
      const response = await apiClient.post('product', productData);
      return response.data;
    } catch (error) {
      console.error('API error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to Create Product");
    }
  },

  deleteProduct: async (productId) => {
    try {
     
      const response = await apiClient.delete(`product/${productId}`);
      return response.data;
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

  // --- File Upload Service ---
  uploadFileInChunksService: async (file, { onProgress, onStatusChange, onSuccess, onError }) => {
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uploadId = crypto.randomUUID();       

    onStatusChange('Starting upload...');

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);

      try {
        onStatusChange(`Uploading chunk ${chunkIndex + 1} of ${totalChunks}...`);

        // Using axios for the chunk upload
        const response = await apiClient.post('/service/upload', chunk, {
          headers: {
            'Content-Type': 'application/octet-stream',
            'x-unique-upload-id': uploadId,
            'content-range': `bytes ${start}-${end - 1}/${file.size}`,
          },
        });

        const newProgress = ((chunkIndex + 1) / totalChunks) * 100;
        onProgress(newProgress);

        const result = response.data;

        if (result.url) {
          const transformedUrl = result.url.replace('/upload/', '/upload/w_400/');
          onSuccess(transformedUrl);
          onStatusChange('Upload complete! File available on Cloudinary.');
          return; // Exit the loop and function
        } else {
          onStatusChange(`Chunk ${chunkIndex + 1} uploaded. Server status: ${result.status}`);
        }
      } catch (error) {
        console.error('Error uploading chunk:', error);
        const errorMessage = error.response?.data?.error || error.message || 'Chunk upload failed';
        onError(new Error(errorMessage));
        onStatusChange(`Error: ${errorMessage}`);
        return; // Stop the upload on error
      }
    }
  },

  // --- User API Calls ---
  getUsers: async () => {
    try {
        const response = await apiClient.get('/db/users');
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
        const response = await apiClient.post('/db/users', userData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create user');
    }
  },

  dropUser: async (username, host = '%') => {
    try {
        // For DELETE with body, axios uses the 'data' property in the config object
        const response = await apiClient.delete(`/db/users/${username}`, { data: { host } });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  },

  grantRoleToUser: async (roleName, username, host = '%') => {
    try {
        const response = await apiClient.post('/db/users/grant-role', { roleName, username, host });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to grant role');
    }
  },

  getUserPermissions: async (username, host = '%') => {
    try {
        const response = await apiClient.get(`/db/users/${username}/permissions`, { params: { host } });
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
        const response = await apiClient.get('/db/roles');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch roles');
    }
  },

  createRole: async (roleName) => {
    try {
        const response = await apiClient.post('/db/roles', { roleName });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create role');
    }
  },

  dropRole: async (roleName) => {
    try {
        const response = await apiClient.delete(`/db/roles/${roleName}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete role');
    }
  },

  grantPermissionsToRole: async (data) => {
    try {
        const response = await apiClient.post('/db/roles/grant-permissions', data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to grant permissions');
    }
  },

  getRolePermissions: async (roleName) => {
    try {
        const response = await apiClient.get(`/db/roles/${roleName}/permissions`);
        const data = response.data;
        return data.grants ? data.grants.map(g => Object.values(g)[0]) : [];
    } catch (error) {
        console.error(`Could not fetch permissions for role: ${roleName}`, error);
        return [];
    }
  },

  getTables: async () => {
    try {
        const response = await apiClient.get('/db/tables');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch tables');
    }
  },
   grantPermissionsToUser: async (data) => {
    try {
      const response = await apiClient.post('/db/users/grant-permissions', data);
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
      const response = await apiClient.post('/db/users/revoke-permissions', data);
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
      const response = await apiClient.post('/db/users/update-expiry', data);
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
      const response = await apiClient.post('/db/roles/revoke-permissions', data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to revoke role permissions');
    }
  }
};
