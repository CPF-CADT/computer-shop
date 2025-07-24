import { FaStar } from 'react-icons/fa';

const StarRating = ({ rating = 0 }) => {
  const totalStars = 5;
  return (
    <div className="flex items-center text-yellow-400">
      {[...Array(totalStars)].map((_, i) => (
        <FaStar key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'} />
      ))}
    </div>
  );
};

export default function ReviewCard({ review }) {

  return (
    <div className="flex items-start space-x-4 p-4 border-b last:border-b-0">
      <div className="flex-grow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
          <h4 className="font-bold text-gray-800">{review.customerName}</h4>
          <div className="mt-1 sm:mt-0">
            <StarRating rating={review.rating} />
          </div>
        </div>
        <p className="text-gray-600 mb-2">"{review.comment}"</p>
        <p className="text-xs text-gray-400">
          Reviewed on {new Date(review.feedbackDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}