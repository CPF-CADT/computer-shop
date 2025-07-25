import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlus, FaMinus, FaStar } from 'react-icons/fa';
import { useCart } from '../cart/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { apiService } from '../../service/api';
import ProductBreadcrumb from './ProductBreadcrumb';
import ReviewCard from './ReviewCard'; 

const RatingsAndReviews = ({ product, onReviewSubmitted }) => {
    const [newRating, setNewRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated || !user?.id) {
            toast.error("Please log in to submit a review.");
            navigate('/login');
            return;
        }
        setIsSubmitting(true);
        try {
            await apiService.addFeedbackForProduct(user.id, product.product_code, newRating, comment);
            toast.success("Thank you! Your review has been submitted.");
            setComment('');
            setNewRating(5);
            if (onReviewSubmitted) onReviewSubmitted();
        } catch (error) {
            toast.error(error.message || "Could not submit your review.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Ratings & Reviews</h2>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                <div className="lg:col-span-3">
                    <h3 className="text-lg font-semibold mb-4">What our customers are saying ({product.feedback?.totalReview || 0} Reviews)</h3>
                    <div className="space-y-2 bg-white rounded-lg border">
                        {product.customerFeedback && product.customerFeedback.length > 0 ? (
                            product.customerFeedback.map(review => (
                                <ReviewCard key={review.feedback_id} review={review} />
                            ))
                        ) : (
                            <div className="text-center py-8 px-4">
                                <p className="text-gray-500">There are no reviews for this product yet. Be the first!</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="lg:col-span-2">
                   <div className="bg-gray-50 p-6 rounded-lg sticky top-8 border">
                       <h3 className="text-lg font-semibold mb-4">Write a review</h3>
                       <form onSubmit={handleReviewSubmit} className="space-y-4">
                           <div>
                               <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating *</label>
                               <div className="flex items-center gap-1">
                                   {[...Array(5)].map((_, index) => (
                                       <button type="button" key={index + 1} onClick={() => setNewRating(index + 1)} className="text-2xl focus:outline-none">
                                           <FaStar className={(index + 1) <= newRating ? 'text-yellow-400' : 'text-gray-300'} />
                                       </button>
                                   ))}
                               </div>
                           </div>
                           <div>
                               <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Your review *</label>
                               <textarea id="comment" rows="4" value={comment} onChange={(e) => setComment(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                           </div>
                           <button
                               type="submit"
                               disabled={isSubmitting || !isAuthenticated || user?.role !== 'customer'}
                               className="w-full bg-orange-500 text-white py-2.5 rounded-md font-semibold hover:bg-orange-600 transition disabled:bg-gray-400"
                           >
                               {isSubmitting ? 'Submitting...' : (isAuthenticated ? 'Submit Review' : 'Log in to Review')}
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
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { isAuthenticated,user } = useAuth();

    const fetchProduct = useCallback(async () => {
        try {
            !loading && setLoading(true);
            const result = await apiService.getProductDetail(productId);
            setProduct(result);
        } catch (error) {
            console.error('Error fetching product:', error);
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            toast.error("Please log in to add items to your cart.");
            navigate('/login');
            return;
        }
        addToCart({ ...product, qty: quantity });
    };

    const handleQuantityChange = (amount) => {
        setQuantity((prev) => Math.max(1, prev + amount));
    };

    if (loading && !product) return <div className="text-center py-20 text-xl font-semibold">Loading product...</div>;
    if (!product) return <div className="text-center py-20 text-xl font-semibold">Product Not Found</div>;

    return (
        <div className="max-w-6xl mx-auto p-4">
            <ProductBreadcrumb product={product} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <img src={product.image_path || 'https://placehold.co/600x400'} alt={product.name} className="w-full h-auto object-contain" />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-2xl lg:text-3xl font-bold mb-2">{product.name}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span>Brand: <strong>{product.brand?.name || 'N/A'}</strong></span>
                        <span>Code: <strong>{product.product_code}</strong></span>
                    </div>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <div className="mb-6">
                        <span className="text-3xl font-bold text-gray-800">${parseFloat(product.price?.amount || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center border rounded-md">
                            <button onClick={() => handleQuantityChange(-1)} className="p-3"><FaMinus size={12} /></button>
                            <span className="px-5 py-2 text-lg font-medium">{quantity}</span>
                            <button onClick={() => handleQuantityChange(1)} className="p-3"><FaPlus size={12} /></button>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            // disabled={user?.role !== 'customer'}
                            className={`flex-grow py-3 rounded-lg font-semibold transition bg-orange-500 text-white hover:bg-orange-600`}
                            >
                            Add to Cart
                        </button>

                    </div>
                    <div className="border-t pt-6 text-sm">
                        <h2 className="font-semibold mb-2 text-base">Specifications</h2>
                        <div className="space-y-1">
                            <p><strong>Category:</strong> {product.category?.title || 'N/A'}</p>
                            <p><strong>Type:</strong> {product.type?.title || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
            {product && <RatingsAndReviews product={product} onReviewSubmitted={fetchProduct} />}
        </div>
    );
}