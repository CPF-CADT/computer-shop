import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { mockProducts } from '../../data/mockData';
import { FaStar } from 'react-icons/fa';

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState({
    name: '',
    text: '',
    rating: 5,
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const product = mockProducts.find(p => p.product_code === productId);

  if (!product) {
    return (
      <div className="max-w-[1200px] mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-4">This product is currently out of stock or doesn't exist.</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
        >
          &larr; Go Back
        </button>
      </div>
    );
  }

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    // Add review logic here
    console.log('Review submitted:', review);
    setReview({ name: '', text: '', rating: 5 });
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log('Added to cart:', { product, quantity });
  };

  const discountedPrice = product.discount
    ? (parseFloat(product.price.amount) * (1 - parseFloat(product.discount.value) / 100)).toFixed(2)
    : product.price.amount;

  return (
    <div className="max-w-[1200px] mx-auto p-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-orange-500">Home</Link>
        <span>&gt;</span>
        <Link to="/laptop" className="hover:text-orange-500">Laptops</Link>
        <span>&gt;</span>
        <span className="text-gray-700">{product.name}</span>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-gray-600 hover:text-gray-800 flex items-center"
      >
        &larr; Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Product Image */}
        <div className="bg-white p-4 rounded-lg shadow">
          <img
            src={product.image_path}
            alt={product.name}
            className="w-full object-contain rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={i < product.feedback.rating ? "text-yellow-400" : "text-gray-300"}
                size={20}
              />
            ))}
            <span className="ml-2 text-gray-500">
              ({product.feedback.totalReview} reviews)
            </span>
          </div>

          <div className="mb-6">
            {product.discount && (
              <div className="text-gray-500 line-through">
                ${parseFloat(product.price.amount).toFixed(2)}
              </div>
            )}
            <div className="text-3xl font-bold text-orange-600">
              ${discountedPrice}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Quantity:</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 border rounded hover:bg-gray-100"
              >
                -
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 border rounded hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 mb-6"
          >
            Add to Cart
          </button>

          <div className="border-t pt-6">
            <h2 className="font-bold mb-4">Specifications</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-medium">Brand:</span> {product.brand}</div>
              <div><span className="font-medium">Category:</span> {product.category.title}</div>
              <div><span className="font-medium">Type:</span> {product.type.title}</div>
              {product.discount && (
                <div>
                  <span className="font-medium">Discount:</span> {product.discount.value}%
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6">Reviews</h2>
        
        {/* Write Review Form */}
        <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 className="font-bold mb-4">Write a Review</h3>
          
          <div className="mb-4">
            <label className="block mb-2">Your Name *</label>
            <input
              type="text"
              value={review.name}
              onChange={(e) => setReview({...review, name: e.target.value})}
              className="w-full p-2 border rounded focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Your Review *</label>
            <textarea
              value={review.text}
              onChange={(e) => setReview({...review, text: e.target.value})}
              className="w-full p-2 border rounded h-32 focus:outline-none focus:border-orange-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Rating *</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReview({...review, rating: star})}
                  className={`text-2xl ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  <FaStar />
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
          >
            Submit Review
          </button>
        </form>

        {/* Example Reviews */}
        <div className="space-y-6">
          {[...Array(product.feedback.totalReview)].map((_, idx) => (
            <div key={idx} className="border-b pb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="font-medium">Customer {idx + 1}</div>
                  <div className="text-sm text-gray-500">2 months ago</div>
                </div>
              </div>
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < product.feedback.rating ? "text-yellow-400" : "text-gray-300"}
                  />
                ))}
              </div>
              <p className="text-gray-600">Great product, very satisfied with the purchase!</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}