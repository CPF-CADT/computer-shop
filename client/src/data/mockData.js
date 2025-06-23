import G713PI from '../assets/G713PI.jpg';

// Homepage Specific Data
export const homePageLaptops = [
  {
    product_code: "HOME-ASUS-G713PI",
    name: "ASUS ROG Strix G17 | G713PI",
    image_path: G713PI,
    price: { amount: "1899.00", currency: "USD" },
    description: "AMD R9-7945HX, 64GB DDR5 RAM, 1TB SSD, RTX 4070",
    brand: "ASUS",
    category: { id: 1, title: "Laptops" },
    type: { id: 1, title: "Gaming Laptop" },
    discount: { type: "Percentage", value: "10.00" },
    feedback: { rating: "4.5", totalReview: 5 },
  },
  {
    product_code: "HOME-MSI-RAIDER",
    name: "MSI Raider GE78 HX",
    image_path: G713PI,
    price: { amount: "2499.00", currency: "USD" },
    description: "Intel i9-13980HX, 32GB RAM, 2TB SSD, RTX 4090",
    brand: "MSI",
    category: { id: 1, title: "Laptops" },
    type: { id: 1, title: "Gaming Laptop" },
    discount: { type: "Percentage", value: "15.00" },
    feedback: { rating: "4.8", totalReview: 8 },
  },
  {
    product_code: "HOME-LENOVO-LEGION",
    name: "Lenovo Legion Pro 7i",
    image_path: G713PI,
    price: { amount: "2199.00", currency: "USD" },
    description: "Intel i9-13900HX, 32GB RAM, 1TB SSD, RTX 4080",
    brand: "Lenovo",
    category: { id: 1, title: "Laptops" },
    type: { id: 1, title: "Gaming Laptop" },
    discount: { type: "Percentage", value: "12.00" },
    feedback: { rating: "4.7", totalReview: 6 },
  }
];

// Home page latest products (different from Laptop page latest products)
export const homeLatestProducts = [
  {
    product_code: "HOME-LATEST-ROG",
    name: "ASUS ROG Flow X16",
    image_path: G713PI,
    price: { amount: "2799.00", currency: "USD" },
    description: "NEW! AMD R9-7945HX, 64GB DDR5, RTX 4090",
    brand: "ASUS",
    category: { id: 1, title: "Laptops" },
    type: { id: 1, title: "Gaming Laptop" },
    discount: { type: "Percentage", value: "8.00" },
    feedback: { rating: "5.0", totalReview: 3 },
  },
    {
    product_code: "HOME-LATEST-ROG",
    name: "ASUS ROG Flow X16",
    image_path: G713PI,
    price: { amount: "2799.00", currency: "USD" },
    description: "NEW! AMD R9-7945HX, 64GB DDR5, RTX 4090",
    brand: "ASUS",
    category: { id: 1, title: "Laptops" },
    type: { id: 1, title: "Gaming Laptop" },
    discount: { type: "Percentage", value: "8.00" },
    feedback: { rating: "5.0", totalReview: 3 },
  },
  {
    product_code: "HOME-LATEST-ALIENWARE",
    name: "Alienware x16 R2",
    image_path: G713PI,
    price: { amount: "3299.00", currency: "USD" },
    description: "NEW! Intel i9-14900HX, 64GB DDR5, RTX 4090",
    brand: "Alienware",
    category: { id: 1, title: "Laptops" },
    type: { id: 1, title: "Gaming Laptop" },
    discount: { type: "Percentage", value: "5.00" },
    feedback: { rating: "4.9", totalReview: 2 },
  }
];

// Laptop Page Main Catalog
export const mockLaptop = [
  {
    product_code: "ROG-STRIX-G17",
    name: "ROG STRIX G17",
    image_path: G713PI,
    price: { amount: "1999.00", currency: "USD" },
    description: "AMD R9-7945HX, 64GB DDR5 RAM, 1TB SSD, RTX 4070, 17.3'' 240Hz",
    brand: "ASUS",
    category: { id: 1, title: "Laptops" },
    type: { id: 1, title: "Gaming Laptop" },
    discount: { type: "Percentage", value: "5.00" },
    feedback: { rating: "4.8", totalReview: 12 },
  },
    {
    product_code: "ROG-STRIX-G17",
    name: "ROG STRIX G17",
    image_path: G713PI,
    price: { amount: "1999.00", currency: "USD" },
    description: "AMD R9-7945HX, 64GB DDR5 RAM, 1TB SSD, RTX 4070, 17.3'' 240Hz",
    brand: "ASUS",
    category: { id: 1, title: "Laptops" },
    type: { id: 1, title: "Gaming Laptop" },
    discount: { type: "Percentage", value: "5.00" },
    feedback: { rating: "4.8", totalReview: 12 },
  },
  {
    product_code: "ROG-ZEPHYRUS",
    name: "ROG Zephyrus G14",
    image_path: G713PI,
    price: { amount: "1599.00", currency: "USD" },
    description: "AMD Ryzen 9, 32GB RAM, 1TB SSD, RTX 4060, 14'' QHD, Windows 11 Home",
    brand: "ASUS",
    category: { id: 1, title: "Laptops" },
    type: { id: 1, title: "Gaming Laptop" },
    discount: { type: "Percentage", value: "12.00" },
    feedback: { rating: "4.7", totalReview: 8 },
  },
  {
    product_code: "ROG-STRIX-SCAR",
    name: "ROG Strix SCAR 17",
    image_path: G713PI,
    price: {
      amount: "799.00",
      currency: "USD",
    },
    description: "Intel i5, 16GB RAM, 512GB SSD, Intel Iris Xe, 15.6'' FHD, Windows 11 Home",
    brand: "ASUS",
    category: {
      id: 1,
      title: "Laptops",
    },
    type: {
      id: 2,
      title: "Ultrabook",
    },
    discount: {
      type: "Percentage",
      value: "5.00",
    },
    feedback: {
      rating: "4.2",
      totalReview: 3,
    },
  },
  {
    product_code: "ASUS-TUF-A15",
    name: "ASUS TUF Gaming A15",
    image_path: G713PI,
    price: { amount: "1299.00", currency: "USD" },
    description: "AMD Ryzen 7 6800H, 16GB RAM, 512GB SSD, RTX 3060, 15.6'' 144Hz, Windows 11",
    brand: "ASUS",
    category: { id: 1, title: "Laptops" },
    type: { id: 1, title: "Gaming Laptop" },
    discount: { type: "Percentage", value: "15.00" },
    feedback: { rating: "4.6", totalReview: 15 },
  },
  {
    product_code: "MSI-RAIDER",
    name: "MSI Raider GE78 HX",
    image_path: G713PI,
    price: { amount: "2899.00", currency: "USD" },
    description: "Intel i9-13980HX, 32GB RAM, 2TB SSD, RTX 4080, 17'' QHD+, Windows 11",
    brand: "MSI",
    category: { id: 1, title: "Laptops" },
    type: { id: 1, title: "Gaming Laptop" },
    discount: { type: "Percentage", value: "7.00" },
    feedback: { rating: "4.8", totalReview: 6 },
  }
];

// Latest Products Sidebar for Laptop Page
export const latestProducts = [
  {
    product_code: "LATEST-ASUS-G713PI",
    name: "ASUS ROG Strix G17 (2024)",
    image_path: G713PI,
    price: { amount: "2199.00", currency: "USD" },
    description: "NEW! AMD R9-7945HX, 64GB DDR5, RTX 4080",
    brand: "ASUS",
    category: { id: 1, title: "Laptops" },
    type: { id: 1, title: "Gaming Laptop" },
    discount: { type: "Percentage", value: "5.00" },
    feedback: { rating: "5.0", totalReview: 2 },
  },
  {
    product_code: "MSI-TITAN-NEW",
    name: "MSI Titan GT77 (2024)",
    image_path: G713PI,
    price: { amount: "3499.00", currency: "USD" },
    description: "NEW! Intel i9-13980HX, 64GB DDR5, RTX 4090",
    brand: "MSI",
    category: { id: 1, title: "Laptops" },
    type: { id: 1, title: "Gaming Laptop" },
    discount: { type: "Percentage", value: "8.00" },
    feedback: { rating: "4.9", totalReview: 3 },
  },
  // Keep 3 items for Latest Products sidebar
];

// PC Page Data
export const mockPC = [
  {
    product_code: "PC-ULTIMATE",
    name: "Ultimate Gaming PC",
    image_path: G713PI, // Use G713PI as placeholder
    price: {
      amount: "2499.00",
      currency: "USD",
    },
    description: "Intel i9-13900K, 64GB RAM, 2TB SSD, RTX 4090, Windows 11 Pro",
    brand: "Custom",
    category: {
      id: 2,
      title: "Desktops",
    },
    type: {
      id: 1,
      title: "Gaming PC",
    },
    discount: {
      type: "Percentage",
      value: "8.00",
    },
    feedback: {
      rating: "5.0",
      totalReview: 12,
    },
  },
  {
    product_code: "PC-STREAMER",
    name: "Streamer Pro PC",
    image_path: G713PI, // Use G713PI as placeholder
    price: {
      amount: "1799.00",
      currency: "USD",
    },
    description: "AMD Ryzen 7 7800X, 32GB RAM, 1TB SSD, RTX 4070, Windows 11 Home",
    brand: "Custom",
    category: {
      id: 2,
      title: "Desktops",
    },
    type: {
      id: 2,
      title: "Streaming PC",
    },
    discount: {
      type: "Percentage",
      value: "10.00",
    },
    feedback: {
      rating: "4.8",
      totalReview: 7,
    },
  },
  {
    product_code: "PC-BUDGET",
    name: "Budget Office PC",
    image_path: G713PI, // Use G713PI as placeholder
    price: {
      amount: "599.00",
      currency: "USD",
    },
    description: "Intel i3, 8GB RAM, 256GB SSD, Intel UHD, Windows 11 Home",
    brand: "Custom",
    category: {
      id: 2,
      title: "Desktops",
    },
    type: {
      id: 3,
      title: "Office PC",
    },
    discount: {
      type: "Percentage",
      value: "3.00",
    },
    feedback: {
      rating: "4.0",
      totalReview: 2,
    },
  },
  
  {
    product_code: "PC-WORKSTATION",
    name: "Workstation Pro",
    image_path: G713PI,
    price: { amount: "2999.00", currency: "USD" },
    description: "Intel Xeon, 128GB RAM, 4TB SSD, RTX A6000, Windows 11 Pro",
    brand: "Custom",
    category: { id: 2, title: "Desktops" },
    type: { id: 4, title: "Workstation" },
    discount: { type: "Percentage", value: "7.00" },
    feedback: { rating: "4.9", totalReview: 4 },
  },
  {
    product_code: "PC-ENTRY",
    name: "Entry Level PC",
    image_path: G713PI,
    price: { amount: "499.00", currency: "USD" },
    description: "Intel Pentium, 4GB RAM, 128GB SSD, Windows 11 Home",
    brand: "Custom",
    category: { id: 2, title: "Desktops" },
    type: { id: 5, title: "Entry Level" },
    discount: { type: "Percentage", value: "2.00" },
    feedback: { rating: "3.8", totalReview: 1 },
  },
];

// Combined products for cart and checkout
export const mockProducts = [...mockLaptop, ...mockPC];
export const mockShippingMethods = [
  { id: 'standard', name: 'Standard Shipping (5-7 Days)', price: 5.00 },
  { id: 'express', name: 'Express Shipping (2-3 Days)', price: 15.00 },
];