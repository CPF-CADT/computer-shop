import { useState } from 'react';

export default function ProductGallery({ product }) {
  const [selectedImage, setSelectedImage] = useState(product.image_path);

  return (
    <div>
      <div className="mb-4">
        <img
          src={selectedImage}
          alt={product.name}
          className="w-full h-[400px] object-contain rounded-lg bg-white p-4"
        />
      </div>
      <div className="flex gap-4">
        {/* Thumbnail images would go here */}
        <div 
          className="w-20 h-20 border rounded-md p-2 cursor-pointer hover:border-orange-500"
          onClick={() => setSelectedImage(product.image_path)}
        >
          <img
            src={product.image_path}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}