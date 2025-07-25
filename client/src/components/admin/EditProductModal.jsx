import React, { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { apiService } from "../../service/api";

export default function EditProductModal({
  isOpen,
  onClose,
  onSave,
  productCode,
  categories = [],
  brands = [],
  types = [], // Changed from 'type_products' to 'types' to match props
}) {
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // --- NEW: State management for image upload, matching AddProductModal ---
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  // --- END NEW ---

  // Fetches the product data when the modal opens
  useEffect(() => {
    if (isOpen && productCode) {
      // Reset states when modal opens with a new product
      setSelectedFile(null);
      setIsUploading(false);

      const fetchProduct = async () => {
        setIsLoading(true);
        setError("");
        try {
          const productData = await apiService.getOneProduct(productCode);
          setFormData({
            ...productData,
            category: productData.category?.id || "",
            brand: productData.brand?.id || "",
            type_product: productData.type?.id || "", // Ensure this key matches your data
            price: productData.price?.amount || productData.price, // Handle both object and direct price
          });
          // Set the initial image URL from the fetched data
          setUploadedImageUrl(productData.image || "");
        } catch (err) {
          setError("Failed to load product data.");
          toast.error("Failed to load product data.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [isOpen, productCode]);

  // Handles changes to form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- NEW: Image handling functions from AddProductModal ---
  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
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
        setUploadedImageUrl(url); // Update the final URL
        setSelectedFile(null); // Clear the selected file as it's now uploaded
        setIsUploading(false);
        return "✅ Image uploaded! You can now save the changes.";
      },
      error: (err) => {
        setIsUploading(false);
        return `❌ Upload failed: ${err.message || "Try again."}`;
      },
    });

    // We await here to ensure the upload is complete before proceeding
    await uploadPromise;
  }, [selectedFile]);
  // --- END NEW ---

  // Final submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFile) {
      toast.error("You have a selected image that has not been uploaded yet. Please upload it first or save without changing the image.");
      return;
    }

    const finalData = {
      ...formData,
      image: uploadedImageUrl, 
    };

    try {
      await onSave(productCode, finalData);
      console.log(productCode,finalData)
      onClose();
    } catch (err) {
      // The error toast is also better handled in the parent.
      console.error(err);
    }
  };

  // --- RENDER LOGIC ---
  if (!isOpen) return null;

  // The preview should prioritize a newly selected file, then the uploaded URL
  const imagePreviewUrl = selectedFile
    ? URL.createObjectURL(selectedFile)
    : uploadedImageUrl;

  return (
    <div className="fixed inset-0 z-40 flex justify-center items-center ">
      <div className="bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Edit Product</h2>
            <p className="text-sm text-gray-500">Product Code: {productCode}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {isLoading && <p className="p-6 text-center">Loading...</p>}
        {error && <p className="p-6 text-center text-red-500">{error}</p>}

        {!isLoading && formData && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input type="text" name="name" value={formData.name || ""} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500" required />
            </div>
            {/* ... other form fields like price, description, etc. */}
             <div>
              <label className="block text-sm font-medium text-gray-700">Price ($)</label>
              <input type="number" name="price" value={formData.price || 0} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500" step="0.01" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" value={formData.description || ''} onChange={handleChange} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                  <option value="">Select Category</option>
                  {categories.map((cat) => ( <option key={cat.id} value={cat.id}> {cat.title} </option>))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Brand</label>
                <select name="brand" value={formData.brand} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                  <option value="">Select Brand</option>
                  {brands.map((b) => ( <option key={b.id} value={b.id}> {b.name} </option> ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select name="type_product" value={formData.type_product} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                  <option value="">Select Type</option>
                  {types.map((t) => ( <option key={t.id} value={t.id}> {t.name} </option>))}
                </select>
            </div>


            {/* --- NEW: Image Upload Section matching AddProductModal --- */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Image</label>
              <div className="mt-2 space-y-3">
                <div className="flex items-center gap-4">
                  {imagePreviewUrl ? (
                    <img src={imagePreviewUrl} alt="Preview" className="w-16 h-16 rounded-md object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 text-xs text-center">No Image</div>
                  )}
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} className="hidden" disabled={isUploading}/>

                  <button type="button" onClick={handleSelectFileClick} disabled={isUploading} className="px-4 py-2 text-sm text-purple-700 bg-purple-100 rounded-md hover:bg-purple-200 disabled:opacity-50">
                    {uploadedImageUrl ? "Change Image" : "Select Image"}
                  </button>

                  {/* Show the upload button only if a new file has been selected */}
                  {selectedFile && (
                    <button type="button" onClick={handleUpload} disabled={isUploading} className="px-4 py-2 text-sm text-green-700 bg-green-100 rounded-md hover:bg-green-200 disabled:opacity-50">
                      {isUploading ? "Uploading..." : "Upload Now"}
                    </button>
                  )}
                </div>
              </div>
            </div>
            {/* --- END NEW --- */}
            
            <div className="pt-4 flex justify-end gap-3 border-t mt-6">
              <button type="button" onClick={onClose} disabled={isUploading} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                Cancel
              </button>
              <button type="submit" disabled={isUploading || !!selectedFile} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed">
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}