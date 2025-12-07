import { FiStar, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import reviewService from '@services/review-service';

/**
 * ReviewList Component - Street Style
 * Danh sách reviews của sản phẩm
 * 
 * @param {Array} reviews - Array of review objects
 * @param {Number} averageRating - Average rating
 * @param {Function} onReviewDeleted - Callback khi xóa review
 * @param {Number} currentUserId - Current user ID (optional)
 */
const ReviewList = ({ reviews = [], averageRating = 0, onReviewDeleted, currentUserId }) => {
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('DELETE THIS REVIEW?')) {
      return;
    }

    try {
      await reviewService.deleteReview(reviewId);
      toast.success('REVIEW DELETED!');
      if (onReviewDeleted) {
        onReviewDeleted(reviewId);
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      toast.error('CANNOT DELETE REVIEW');
    }
  };

  // Render stars
  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, index) => (
          <FiStar
            key={index}
            size={16}
            fill={index < rating ? '#000000' : 'none'}
            className={index < rating ? 'text-dark-950' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dark-950">
        <p className="text-gray-600 font-bold uppercase tracking-wide">
          NO REVIEWS YET
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Be the first to review this product
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Average Rating Header */}
      <div className="flex items-center space-x-6 pb-6 border-b-4 border-dark-950">
        <div className="text-center">
          <div className="text-5xl font-black text-dark-950 mb-2">
            {averageRating.toFixed(1)}
          </div>
          {renderStars(Math.round(averageRating))}
          <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mt-2">
            {reviews.length} {reviews.length === 1 ? 'REVIEW' : 'REVIEWS'}
          </p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="p-6 border-2 border-dark-950 bg-light-50 hover:shadow-street transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {/* User Name */}
                  <p className="font-black text-lg uppercase">
                    {review.userFullName || 'Anonymous'}
                  </p>
                  
                  {/* Rating Stars */}
                  {renderStars(review.rating)}
                </div>
                
                {/* Date */}
                <p className="text-xs font-bold uppercase tracking-wider text-gray-600">
                  {formatDate(review.createdAt)}
                </p>
              </div>

              {/* Delete Button (if owner) */}
              {currentUserId && review.userId === currentUserId && (
                <button
                  onClick={() => handleDeleteReview(review.id)}
                  className="p-2 text-gray-600 hover:text-street-red transition-colors"
                  aria-label="Delete review"
                >
                  <FiTrash2 size={18} />
                </button>
              )}
            </div>

            {/* Comment */}
            {review.comment && (
              <p className="text-gray-700 leading-relaxed font-medium">
                {review.comment}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;

