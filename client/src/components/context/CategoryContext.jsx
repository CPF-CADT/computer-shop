import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { apiService } from '../../service/api'; // Adjust path as needed

const CategoryContext = createContext(null);

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [typeProducts, setTypeProducts] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState(null);

  // Function to fetch all category-related data
  const fetchCategoryData = useCallback(async () => {
    try {
      setLoadingCategories(true);
      setCategoryError(null);
      const [categoriesData, brandsData, typesData] = await Promise.all([
        apiService.getAllCategories(),
        apiService.getAllBrands(),
        apiService.getAllTypeProducts()
      ]);

      setCategories(categoriesData || []);
      setBrands(brandsData || []);
      setTypeProducts(typesData || []);
    } catch (error) {
      console.error('Error fetching category data:', error);
      setCategoryError('Failed to load categories, brands, or product types.');
    } finally {
      setLoadingCategories(false);
    }
  }, []); 
  useEffect(() => {
    fetchCategoryData();
  }, [fetchCategoryData]); // Dependency on the memoized fetchCategoryData function

  // State for active category (from your previous context version)
  const [activeCategory, setActiveCategory] = useState(null);
  const selectCategory = useCallback((path) => {
    setActiveCategory(path);
  }, []);

  const value = {
    categories,
    brands,
    typeProducts,
    loadingCategories,
    categoryError,
    activeCategory, 
    selectCategory, 
    refetchCategoryData: fetchCategoryData, 
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
};
