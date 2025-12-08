import { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import reviewService from '@services/review-service';

/**
 * ReviewForm Component - Street Style
 * Form gửi review cho sản phẩm
 * 
 * @param {Number} productId - Product ID
 * @param {Function} onReviewSubmitted - Callback khi submit thành công
 * @param {Boolean} hasExistingReview - User đã review chưa
 */
const ReviewForm = ({ productId, onReviewSubmitted, hasExistingReview = false }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (rating === 0) {
      toast.error('PLEASE SELECT A RATING!');
      return;
    }

    if (!comment.trim()) {
      toast.error('PLEASE WRITE A COMMENT!');
      return;
    }

    try {
      setIsSubmitting(true);

      const reviewData = {
        productId: productId,
        rating: rating,
        comment: comment.trim(),
      };

      await reviewService.createReview(reviewData);
      
      toast.success('REVIEW SUBMITTED!', {
        icon: '⭐',
        style: {
          background: '#000000',
          color: '#ffffff',
          border: '2px solid #000000',
          fontWeight: 'bold',
        },
      });

      // Reset form
      setRating(0);
      setComment('');

      // Callback
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      const errorMessage = err.message || 'CANNOT SUBMIT REVIEW';
      toast.error(errorMessage.toUpperCase());
    } finally {
      setIsSubmitting(false);
    }
  };

  // Nếu đã review rồi
  if (hasExistingReview) {
    return (
      <div className="p-6 border-2 border-dark-950 bg-light-100 text-center">
        <p className="text-sm font-bold uppercase tracking-wider text-gray-600">
          YOU HAVE ALREADY REVIEWED THIS PRODUCT
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 border-2 border-dark-950 bg-light-50">
      <h3 className="text-2xl font-display font-black uppercase tracking-tight">
        WRITE A REVIEW
      </h3>

      {/* Rating Selector */}
      <div className="space-y-3">
        <label className="block text-sm font-black uppercase tracking-wider">
          YOUR RATING *
        </label>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-125"
            >
              <FiStar
                size={32}
                fill={star <= (hoveredRating || rating) ? '#000000' : 'none'}
                className={
                  star <= (hoveredRating || rating)
                    ? 'text-dark-950'
                    : 'text-gray-300'
                }
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-4 text-sm font-bold uppercase tracking-wider text-gray-600">
              {rating} / 5
            </span>
          )}
        </div>
      </div>

      {/* Comment Field */}
      <div className="space-y-3">
        <label className="block text-sm font-black uppercase tracking-wider">
          YOUR REVIEW *
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="SHARE YOUR THOUGHTS ABOUT THIS PRODUCT..."
          rows={5}
          className="w-full px-4 py-3 border-2 border-dark-950 
                   text-dark-950 placeholder-gray-400
                   focus:outline-none focus:border-street-red
                   font-medium resize-none uppercase"
          maxLength={500}
          required
        />
        <p className="text-xs font-bold uppercase tracking-wider text-gray-600">
          {comment.length} / 500 CHARACTERS
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || rating === 0 || !comment.trim()}
        className="w-full py-4 bg-dark-950 border-2 border-dark-950 text-light-50 
                 font-black uppercase text-lg tracking-wider
                 hover:bg-street-red hover:border-street-red hover:scale-[1.02]
                 transition-all duration-300
                 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
      </button>

      {/* Note */}
      <p className="text-xs text-gray-600 font-bold uppercase tracking-wide text-center">
        * YOU MUST PURCHASE THIS PRODUCT TO REVIEW
      </p>
    </form>
  );
};

export default ReviewForm;

