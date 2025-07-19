import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaPlus, FaMinus, FaStar } from 'react-icons/fa';
import { useCart } from '../cart/CartContext'; 
import { useAuth } from '../context/AuthContext'; 
import toast from 'react-hot-toast';
import { apiService } from '../../service/api';
import ProductBreadcrumb from './ProductBreadcrumb';

const StarRating = ({ rating, size = 'text-xl' }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  return (
    <div className={`flex items-center text-yellow-400 ${size}`}>
      {[...Array(fullStars)].map((_, i) => <FaStar key={`full-${i}`} />)}
      {[...Array(totalStars - fullStars)].map((_, i) => <FaStar key={`empty-${i}`} className="text-gray-300" />)}
    </div>
  );
};

// --- Sub-component for the new two-column review section ---
const RatingsAndReviews = ({ product }) => {
    const [newRating, setNewRating] = useState(5);
    const [userName, setUserName] = useState('');
    const [comment, setComment] = useState('');

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const reviewData = {
            productId: product.product_code,
            rating: newRating,
            customerName: userName,
            comment: comment
        };
        try {
            // This is where you would call your API to save the review
            // await apiService.submitReview(reviewData);
            toast.success("Thank you for your review!");
            console.log("Submitting review:", reviewData);
            setUserName('');
            setComment('');
            setNewRating(5);
        } catch (error) {
            toast.error("Could not submit your review. Please try again.");
            console.error("Error submitting review:", error);
        }
    };

    return (
        <div className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Ratings & Reviews</h2>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                {/* Left Column: Existing Reviews List */}
                <div className="lg:col-span-3">
                    <h3 className="text-lg font-semibold mb-4">What our customers are saying ({product.feedback.totalReview} Reviews)</h3>
                    <div className="space-y-6">
                        {product.customerFeedback && product.customerFeedback.length > 0 ? (
                            product.customerFeedback.map(review => (
                                <div key={review.feedback_id} className="pb-6 border-b last:border-b-0">
                                    <div className="flex items-center gap-4 mb-2">
                                        <StarRating rating={review.rating} size="text-lg" />
                                        <p className="font-bold text-gray-800">{review.customerName}</p>
                                    </div>
                                    <p className="text-gray-600 mb-2">"{review.comment}"</p>
                                    <p className="text-xs text-gray-400">
                                        Reviewed on {new Date(review.feedbackDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">There are no reviews for this product yet. Be the first!</p>
                        )}
                    </div>
                </div>

                {/* Right Column: Submit Review Form */}
                <div className="lg:col-span-2">
                    <div className="bg-gray-50 p-6 rounded-lg sticky top-8">
                           <h3 className="text-lg font-semibold mb-4">Write a review</h3>
                         <form onSubmit={handleReviewSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating *</label>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, index) => {
                                        const ratingValue = index + 1;
                                        return (
                                            <button type="button" key={ratingValue} onClick={() => setNewRating(ratingValue)} className="text-2xl focus:outline-none">
                                                <FaStar className={ratingValue <= newRating ? 'text-yellow-400' : 'text-gray-300'} />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">Your name *</label>
                                <input type="text" id="userName" value={userName} onChange={(e) => setUserName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500" />
                            </div>
                             <div>
                                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Your review for this product *</label>
                                <textarea id="comment" rows="4" value={comment} onChange={(e) => setComment(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"></textarea>
                            </div>
                            <button type="submit" className="w-full bg-orange-500 text-white py-2.5 rounded-md font-semibold hover:bg-orange-600 transition">
                                Submit Review
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default function ProductDetails() {
  const { productId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart(); // Get the addToCart function from CartContext
  const { isAuthenticated, user } = useAuth(); // Get auth status and user from AuthContext

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const result = await apiService.getProductDetail(productId);
        setProduct(result);
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    // Check if user is authenticated and customerId is available before adding to cart
    if (!isAuthenticated || !user?.id) {
      toast.error("Please log in to add items to your cart.");
      return;
    }
    // Call the addToCart function from CartContext.
    // It will handle the API call to add the item to the backend cart.
    addToCart({ ...product, qty: quantity });
    // The toast notification for adding to cart is now handled inside CartContext
  };

  const handleQuantityChange = (amount) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + amount));
  };

  if (loading) return <div className="text-center py-20 text-xl font-semibold">Loading product...</div>;
  if (!product) return <div className="text-center py-20 text-xl font-semibold">Product Not Found</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <ProductBreadcrumb product={product} />

      <div className="grid md:grid-cols-2 gap-8 mt-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          {/* Using optional chaining for image_path to prevent errors if product.image_path is null */}
          <img src={product.image_path || 'https://placehold.co/600x400/cccccc/333333?text=No+Image'} alt={product.name} className="w-full object-contain" />
        </div>

        <div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span>Brand: <strong>{product.brand?.name || 'N/A'}</strong></span> {/* Added optional chaining */}
              <span>Code: <strong>{product.product_code}</strong></span>
          </div>
          <p className="text-gray-600 mb-4">{product.description}</p>

          <div className="mb-6">
            <span className="text-3xl font-bold text-gray-800">
                ${parseFloat(product.price?.amount || 0).toFixed(2)} {/* Added optional chaining and default */}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded-md">
              <button onClick={() => handleQuantityChange(-1)} className="p-3 text-gray-600 hover:bg-gray-100"><FaMinus size={12} /></button>
              <span className="px-5 py-2 text-lg font-medium w-16 text-center">{quantity}</span>
              <button onClick={() => handleQuantityChange(1)} className="p-3 text-gray-600 hover:bg-gray-100"><FaPlus size={12} /></button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-grow bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-semibold"
              disabled={!isAuthenticated} // Disable if not logged in
            >
              {isAuthenticated ? 'Add to Cart' : 'Log in to Add to Cart'}
            </button>
          </div>

          <div className="border-t pt-6 text-sm">
            <h2 className="font-semibold mb-2 text-base">Specifications</h2>
            <div className="space-y-1">
                <p><strong>Category:</strong> {product.category?.title || 'N/A'}</p> {/* Added optional chaining */}
                <p><strong>Type:</strong> {product.type?.title || 'N/A'}</p> {/* Added optional chaining */}
            </div>
          </div>
        </div>
      </div>

      {product.feedback && product.customerFeedback && <RatingsAndReviews product={product} />}
    </div>
  );
}
