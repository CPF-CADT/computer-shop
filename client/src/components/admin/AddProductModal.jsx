import { useState, useRef, useCallback,useEffect  } from "react";
import { apiService } from "../../service/api";

export default function AddProductModal({ isOpen, onClose, onAddProduct }) {
  // Form states
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [type_products, setTypeProducts] = useState([]);

    const [name, setName] = useState("");
    const [Code, setCode] = useState(""); // example Code default
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState(1);
    const [type_product, setTypeProduct] = useState(1);
    const [brand, setBrand] = useState(1);
    
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState("Ready to upload");
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

   
  const fileInputRef = useRef(null);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) {
      alert("Please select a file first");
      return;
    }

    const callbacks = {
      onProgress: (p) => setProgress(p),
      onStatusChange: (s) => setStatus(s),
      onSuccess: (url) => {
        setUploadedImageUrl(url);
        setStatus("Upload complete");
      },
      onError: (error) => {
        console.error("Upload failed:", error);
        setStatus("Upload failed");
        setProgress(0);
      },
    };

    await apiService.uploadFileInChunksService(selectedFile, callbacks);
  }, [selectedFile]);

  useEffect(() => {
        const fetchData = async () => {
        try {
            const categoriesData = await apiService.getAllCategories();
            const brandsData = await apiService.getAllBrands();
            const typesData = await apiService.getAllTypeProducts()

            setCategories(categoriesData);
            setBrands(brandsData);
            setTypeProducts(typesData);

        } catch (err) {
            setError(err.message);
            console.error("Failed to fetch product data:", err);
        } finally {
            setLoading(false);
        }
        };

        fetchData();
    }, []); 

    if (loading) {
        return <div>Loading form data...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }
  ///// HOOK RUN BEFORE HERE
  if (!isOpen) return null;
  
  

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setStatus(`File selected: ${file.name}`);
      setProgress(0);
      setUploadedImageUrl("");
    } else {
      setSelectedFile(null);
      setStatus("Ready to upload");
      setUploadedImageUrl("");
      setProgress(0);
    }
  };

  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  };

  // Upload function using your apiServic

  // Submit handler: upload file if not uploaded, then submit form data
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !price || !quantity ) {
      alert("Please fill in all required fields.");
      return;
    }

    // If file selected but not yet uploaded, upload it first
    if (selectedFile && !uploadedImageUrl) {
      await handleUpload();

      if (!uploadedImageUrl) {
        return;
      }
    }

    if (!uploadedImageUrl) {
      alert("Please upload a product image.");
      return;
    }

    // Prepare product data
    const productData = {
      name,
      Code,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      description,
      category,
      brand,
      type_product,
      image: uploadedImageUrl,
    };
    onAddProduct(productData);
    // Reset all states
    setName("");
    setCode("10001");
    setPrice("");
    setQuantity("");
    setDescription(
      "A high-performance Monitor from Razer. Designed for accessories needs."
    );
    setCategory("Accessories");
    setSelectedFile(null);
    setUploadedImageUrl("");
    setProgress(0);
    setStatus("Ready to upload");

    onClose();
  };

  // Render preview if uploaded image or local selected image exists
  const imagePreviewUrl = uploadedImageUrl
    ? uploadedImageUrl
    : selectedFile
    ? URL.createObjectURL(selectedFile)
    : "";

  return (
    <div className="fixed inset-0 bg-transparent z-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-lg max-h-[90vh] overflow-auto">
        <h2 className="text-2xl font-bold mb-5">Add New Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          {/* Code */}
          <div>
            <label
              htmlFor="Code"
              className="block text-sm font-medium text-gray-700"
            >
              Product Code (Code)
            </label>
            <input
              type="text"
              id="Code"
              value={Code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              {categories.map((cate) => (
                <option key={cate.id} value={cate.id}>
                  {cate.title}
                </option>
              ))}
            </select>
          </div>

           {/* brand */}
          <div>
            <label
              htmlFor="brand"
              className="block text-sm font-medium text-gray-700"
            >
              Brand
            </label>
            <select
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>


           {/* Type Product */}
          <div>
            <label
              htmlFor="type-product"
              className="block text-sm font-medium text-gray-700"
            >
              Typr Product
            </label>
            <select
              id="type-product"
              value={type_product}
              onChange={(e) => setTypeProduct(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              {type_products.map((tp) => (
                <option key={tp.id} value={tp.id}>
                  {tp.title}
                </option>
              ))}
            </select>
          </div>

          {/* Price and Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price ($)
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                required
                step="0.01"
              />
            </div>
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700"
              >
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            ></textarea>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Image
            </label>
            <div className="mt-1 flex items-center gap-4">
              {imagePreviewUrl ? (
                <img
                  src={imagePreviewUrl}
                  alt="Preview"
                  className="w-16 h-16 rounded object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}

              <button
                type="button"
                onClick={handleSelectFileClick}
                disabled={progress > 0 && progress < 100}
                className="block px-4 py-2 text-sm text-gray-500 bg-purple-50 rounded-full hover:bg-purple-100"
              >
                Select Image
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                disabled={progress > 0 && progress < 100}
              />
            </div>

            {/* Upload progress and status */}
            <div className="mt-2">
              <div className="text-sm text-gray-700">{status}</div>
              {progress > 0 && (
                <div className="w-full bg-gray-200 rounded-full mt-1">
                  <div
                    className="bg-purple-600 text-xs font-medium text-purple-100 text-center p-0.5 leading-none rounded-full"
                    style={{ width: `${progress}%` }}
                  >
                    {Math.round(progress)}%
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              disabled={progress > 0 && progress < 100}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              disabled={progress > 0 && progress < 100}
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
