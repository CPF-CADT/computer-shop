import { useState } from 'react';
import { FaStar } from "react-icons/fa";

export default function ProductReviews({ productRating, totalReviews }) {
  const [review, setReview] = useState({ name: '', text: '', rating: 5 });
  const [reviews, setReviews] = useState([]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const newReview = {
      ...review,
      id: Date.now(),
      date: new Date().toLocaleDateString()
    };
    setReviews([...reviews, newReview]);
    setReview({ name: '', text: '', rating: 5 });
  };

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-6">Ratings & Reviews</h2>
      
      <div className="mb-8">
        <div className="text-4xl font-bold">
          {productRating}
          <span className="text-sm text-gray-500 ml-2">out of 5</span>
        </div>
        <div className="text-sm text-gray-500">
          There are {reviews.length + totalReviews} reviews for this product.
        </div>
      </div>

      <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-6 rounded-lg mb-8">
        <h3 className="font-bold mb-4">Write a review</h3>
        
        <div className="mb-4">
          <label className="block mb-2">Your name *</label>
          <input
            type="text"
            value={review.name}
            onChange={(e) => setReview({...review, name: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Your review for this product *</label>
          <textarea
            value={review.text}
            onChange={(e) => setReview({...review, text: e.target.value})}
            className="w-full p-2 border rounded h-32"
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

        <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600">
          Submit
        </button>
      </form>

      <div className="space-y-6">
        {[...reviews].map((review, idx) => (
          <div key={idx} className="border-b pb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div>
                <div className="font-medium">{review.name}</div>
                <div className="text-sm text-gray-500">{review.date}</div>
              </div>
            </div>
            <div className="flex gap-1 mb-2">
              {[1,2,3,4,5].map((star) => (
                <FaStar 
                  key={star}
                  className={star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <p className="text-gray-600">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}