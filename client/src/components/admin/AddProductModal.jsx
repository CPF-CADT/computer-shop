import React, { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { apiService } from "../../service/api";

export default function EditProductModal({
  isOpen,
  onClose,
  onSave,
  productCode,
  categories,
  brands,
  types,
}) {
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen && productCode) {
      const fetchProduct = async () => {
        setIsLoading(true);
        setError("");
        try {
          const productData = await apiService.getOneProduct(productCode);
          setFormData({
            ...productData,
            category: productData.category?.id || "",
            brand: productData.brand?.id || "",
            type: productData.type?.id || "",
            price: productData.price.amount,
            image: productData.image || "",
          });
          setUploadedImageUrl(productData.image || "");
        } catch (err) {
          setError("Failed to load product data.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [isOpen, productCode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = useCallback(async () => {
    if (!selectedFile) {
      toast.error("Please select an image file first.");
      return;
    }
    setIsUploading(true);
    const uploadPromise = apiService.uploadImageToCloudinary(selectedFile);
    toast.promise(uploadPromise, {
      loading: "Uploading image...",
      success: (url) => {
        setUploadedImageUrl(url);
        setFormData((prev) => ({ ...prev, image: url }));
        setIsUploading(false);
        return "✅ Image uploaded!";
      },
      error: (err) => {
        setIsUploading(false);
        return `❌ Upload failed: ${err.message || "Try again."}`;
      },
    });
    await uploadPromise;
  }, [selectedFile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(productCode, formData);
      toast.success("✅ Product updated!");
      onClose();
    } catch (err) {
      toast.error("❌ Failed to update product.");
      console.error(err);
    }
  };

  if (!isOpen) return null;

  const imagePreview = selectedFile
    ? URL.createObjectURL(selectedFile)
    : uploadedImageUrl;

  return (
    <div className="fixed inset-0 z-40 flex justify-center items-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-xl m-4 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Edit Product</h2>
            <p className="text-sm text-gray-500">Product Code: {productCode}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        {isLoading && <p className="p-6 text-center">Loading product details...</p>}
        {error && <p className="p-6 text-center text-red-500">{error}</p>}

        {!isLoading && formData && (
          <form onSubmit={handleSubmit}>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price || 0}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  step="0.01"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Brand
                </label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Brand</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Type</option>
                  {types.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* IMAGE UPLOAD SECTION */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Product Image
                </label>
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-16 h-16 rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-3 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 text-sm"
                  >
                    {selectedFile ? "Change Image" : "Select Image"}
                  </button>
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm"
                    >
                      {isUploading ? "Uploading..." : "Upload Image"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUploading}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
