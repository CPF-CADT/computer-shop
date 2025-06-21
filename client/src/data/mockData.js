import G713PI from '../assets/G713PI.jpg';

export const mockLaptop = [
  {
    product_code: "ASUS-G713PI",
    name: "ASUS ROG Strix G17 | G713PI",
    image_path: G713PI,
    price: {
      amount: "10099.00",
      currency: "USD",
    },
    description: "AMD R9-7945HX, 64GB DDR5 RAM, 1TB SSD, RTX 4070, 17.3'' 240Hz, Windows 11 Home",
    brand: "ASUS",
    category: {
      id: 1,
      title: "Laptops",
    },
    type: {
      id: 1,
      title: "Gaming Laptop",
    },
    discount: {
      type: "Percentage",
      value: "10.00",
    },
    feedback: {
      rating: "4.5",
      totalReview: 5,
    },
  },
  {
    product_code: "ASUS-ZEPHYRUS",
    name: "ASUS ROG Zephyrus G14",
    image_path: G713PI, // Use G713PI as placeholder, replace with actual image if available
    price: {
      amount: "1599.00",
      currency: "USD",
    },
    description: "AMD Ryzen 9, 32GB RAM, 1TB SSD, RTX 4060, 14'' QHD, Windows 11 Home",
    brand: "ASUS",
    category: {
      id: 1,
      title: "Laptops",
    },
    type: {
      id: 1,
      title: "Gaming Laptop",
    },
    discount: {
      type: "Percentage",
      value: "12.00",
    },
    feedback: {
      rating: "4.7",
      totalReview: 8,
    },
  },
  {
    product_code: "ASUS-VIVOBOOK",
    name: "ASUS VivoBook 15",
    image_path: G713PI, // Use G713PI as placeholder, replace with actual image if available
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
];

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

export const mockProducts = [...mockLaptop, ...mockPC];

export const mockShippingMethods = [
  { id: 'standard', name: 'Standard Shipping (5-7 Days)', price: 5.00 },
  { id: 'express', name: 'Express Shipping (2-3 Days)', price: 15.00 },
];