import React, { useState, useRef, useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { apiService } from "../../service/api";

const initialFormData = {
  name: "",
  Code: "",
  price: "",
  quantity: 1,
  description: "",
  category: "",
  brand: "",
  type_product: "",
};
export default function AddProductModal({ isOpen, onClose, onAddProduct }) {

  const [formData, setFormData] = useState(initialFormData);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [type_products, setTypeProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const [categoriesData, brandsData, typesData] = await Promise.all([
            apiService.getAllCategories(),
            apiService.getAllBrands(),
            apiService.getAllTypeProducts(),
          ]);
          setCategories(categoriesData);
          setBrands(brandsData);
          setTypeProducts(typesData);
        } catch (err) {
          setError("Failed to load required data. Please try again.");
          toast.error("Failed to load form data.");
          console.error("Failed to fetch product data:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [isOpen]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadedImageUrl(""); 
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
        setSelectedFile(null);
        setIsUploading(false);
        return "✅ Image uploaded! You can now add the product.";
      },
      error: (err) => {
        setIsUploading(false);
        return `❌ Upload failed: ${err.message || "Please try again."}`;
      },
    });

    await uploadPromise.catch(err => console.error(err));
  }, [selectedFile]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedFile) {
      toast.error("You have a selected image that has not been uploaded. Please upload it first.");
      return;
    }

    if (!uploadedImageUrl) {
      toast.error("Please select and upload a product image.");
      return;
    }
    const productData = {
      name: formData.name,
      code: formData.Code,
      description: formData.description,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity, 10),
      category: parseInt(formData.category, 10),
      brand: parseInt(formData.brand, 10),
      type_product: parseInt(formData.type_product, 10),
      image: uploadedImageUrl,
    };

    await onAddProduct(productData);
    setFormData(initialFormData);
    setUploadedImageUrl("");
    setSelectedFile(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
    
    onClose();
  };
  if (!isOpen) return null;

  const imagePreviewUrl = selectedFile
    ? URL.createObjectURL(selectedFile)
    : uploadedImageUrl;
  return (
    <div className="fixed inset-0 z-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-5 text-gray-800">Add New Product</h2>
        {isLoading && <p className="text-center p-6">Loading form data...</p>}
        {error && <p className="text-center p-6 text-red-500">{error}</p>}

        {!isLoading && !error && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Product Code</label>
              <input type="text" name="Code" value={formData.Code} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md" required>
                    <option value="">Select</option>
                    {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.title}</option>))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Brand</label>
                    <select name="brand" value={formData.brand} onChange={handleChange} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md" required>
                    <option value="">Select</option>
                    {brands.map((b) => (<option key={b.id} value={b.id}>{b.name}</option>))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select name="type_product" value={formData.type_product} onChange={handleChange} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md" required>
                    <option value="">Select</option>
                    {type_products.map((t) => (<option key={t.id} value={t.id}>{t.name}</option>))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required step="0.01" min="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required step="1" min="0" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Product Image</label>
              <div className="mt-2 space-y-3">
                <div className="flex items-center gap-4">
                  {imagePreviewUrl ? (
                    <img src={imagePreviewUrl} alt="Preview" className="w-20 h-20 rounded-md object-cover" />
                  ) : (
                    <div className="w-20 h-20 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 text-xs text-center">No Image</div>
                  )}
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} className="hidden" disabled={isUploading}/>

                  <div className="flex flex-col gap-2">
                    <button type="button" onClick={handleSelectFileClick} disabled={isUploading} className="px-4 py-2 text-sm text-purple-700 bg-purple-100 rounded-md hover:bg-purple-200 disabled:opacity-50">
                      Select Image
                    </button>
                    {selectedFile && (
                      <button type="button" onClick={handleUpload} disabled={isUploading} className="px-4 py-2 text-sm text-green-700 bg-green-100 rounded-md hover:bg-green-200 disabled:opacity-50">
                        {isUploading ? "Uploading..." : "Upload Now"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t mt-6">
              <button type="button" onClick={onClose} disabled={isUploading} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 disabled:opacity-50">
                Cancel
              </button>
              <button type="submit" disabled={isUploading || !!selectedFile} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed">
                Add Product
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}