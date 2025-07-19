import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { apiService } from '../../service/api'; // Adjust path as needed for your apiService
import { useAuth } from '../context/AuthContext'; // Adjust path as needed for your AuthContext
import toast from 'react-hot-toast'; // For user notifications

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user, isAuthenticated } = useAuth(); // Get user object and authentication status
  const [cartItems, setCartItems] = useState([]); // State to hold cart items
  const [loadingCart, setLoadingCart] = useState(true); // Loading state for cart operations
  const [cartError, setCartError] = useState(null); // Error state for cart operations

  const customerId = user?.id;

  const fetchCartItems = useCallback(async () => {
    if (!isAuthenticated || !customerId) {
      setCartItems([]);
      setLoadingCart(false);
      return;
    }

    setLoadingCart(true); // Start loading
    setCartError(null); // Clear previous errors
    try {
      const data = await apiService.getCartItems(customerId);
      setCartItems(data); // Update cart items with data from API
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartError(error.message); // Set error message
      setCartItems([]); // Clear cart on error to prevent displaying stale/incorrect data
      toast.error("Failed to load cart items."); // Notify user
    } finally {
      setLoadingCart(false); // End loading
    }
  }, [isAuthenticated, customerId]); // Dependencies for useCallback

  // Effect hook to call fetchCartItems whenever authentication status or customerId changes
  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]); // Dependency on the memoized fetchCartItems function


  const addToCart = async (productToAdd) => {
    if (!isAuthenticated || !customerId) {
      toast.error("Please log in to add items to your cart.");
      return;
    }

    try {
      // Check if the item already exists in the local cart state
      const existingItem = cartItems.find(item => item.product_code === productToAdd.product_code);

      if (existingItem) {
        // If item exists, update its quantity via PUT API
        const newQty = existingItem.qty + productToAdd.qty;
        await apiService.updateCartItemQuantity(customerId, productToAdd.product_code, newQty);

        // Optimistically update local state
        setCartItems(prevItems =>
          prevItems.map(item =>
            item.product_code === productToAdd.product_code
              ? { ...item, qty: newQty } // Update quantity
              : item
          )
        );
        toast.success(`Updated quantity for ${productToAdd.name} in cart.`);
      } else {
        // If item doesn't exist, add new item via POST API
        await apiService.addToCartItem(
          customerId,
          productToAdd.product_code,
          productToAdd.qty,
          productToAdd.price.amount // price_at_purchase from product object
        );

        // --- FIX START ---
        // Construct the new item for local state to match the structure from the backend API
        // This assumes your backend's getCartItems returns a structure like:
        // { product_code, qty, price_at_purchase, product: { name, image_path, ... } }
        setCartItems(prevItems => [...prevItems, {
          product_code: productToAdd.product_code,
          qty: productToAdd.qty,
          price_at_purchase: productToAdd.price.amount,
          // Create the nested 'product' object to match the API response structure
          product: {
            name: productToAdd.name,
            image_path: productToAdd.image_path,
            // Include any other product details that your backend's getCartItems
            // might include in the nested 'product' object, e.g.,
            // description: productToAdd.description,
            // price: productToAdd.price, // if your API nests the full price object
          }
        }]);
        // --- FIX END ---
        toast.success(`${productToAdd.qty} x ${productToAdd.name} added to cart!`);
      }
    } catch (error) {
      console.error("Error adding/updating cart item:", error);
      toast.error(error.message || "Failed to add item to cart.");
      // Consider re-fetching cart items from backend on error to ensure sync
      fetchCartItems();
    }
  };

  /**
   * Updates the quantity of an existing item in the cart.
   * @param {string} productCode - The code of the product to update.
   * @param {number} newQty - The new quantity for the item.
   */
  const updateCartItem = async (productCode, newQty) => {
    if (!isAuthenticated || !customerId) {
      toast.error("Please log in to modify your cart.");
      return;
    }
    if (newQty <= 0) {
      // If quantity is 0 or less, remove the item
      await removeFromCart(productCode);
      return;
    }

    try {
      await apiService.updateCartItemQuantity(customerId, productCode, newQty);
      // Optimistically update local state
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.product_code === productCode
            ? { ...item, qty: newQty }
            : item
        )
      );
      toast.success("Cart item quantity updated.");
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      toast.error(error.message || "Failed to update cart item quantity.");
      fetchCartItems(); // Re-fetch on error
    }
  };

  /**
   * Removes an item from the cart.
   * @param {string} productCode - The code of the product to remove.
   */
  const removeFromCart = async (productCode) => {
    if (!isAuthenticated || !customerId) {
      toast.error("Please log in to modify your cart.");
      return;
    }

    try {
      await apiService.removeCartItem(customerId, productCode);
      // Optimistically update local state
      setCartItems(prevItems => prevItems.filter(item => item.product_code !== productCode));
      toast.success("Item removed from cart.");
    } catch (error) {
      console.error("Error removing cart item:", error);
      toast.error(error.message || "Failed to remove item from cart.");
      fetchCartItems(); // Re-fetch on error
    }
  };

  // Calculate total items and total price based on local cart state
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.qty * item.price_at_purchase), 0);

  // Value provided by the context to its consumers
  const value = {
    cartItems,
    loadingCart,
    cartError,
    totalItems,
    totalPrice,
    addToCart,
    updateCartItem,
    removeFromCart,
    fetchCartItems, // Expose fetch function for manual refresh if needed
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to consume the CartContext
export const useCart = () => {
  return useContext(CartContext);
};
