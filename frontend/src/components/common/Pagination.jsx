import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

/**
 * Pagination Component - Street Style
 * Pagination controls với bold design
 * 
 * @param {Number} currentPage - Current page (0-indexed)
 * @param {Number} totalPages - Total number of pages
 * @param {Function} onPageChange - Handler khi page thay đổi
 * @param {Boolean} loading - Loading state
 */
const Pagination = ({ currentPage = 0, totalPages = 1, onPageChange, loading = false }) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first, last, current, and nearby pages
      if (currentPage < 3) {
        // Near start
        for (let i = 0; i < 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages - 1);
      } else if (currentPage > totalPages - 4) {
        // Near end
        pages.push(0);
        pages.push('...');
        for (let i = totalPages - 4; i < totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Middle
        pages.push(0);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages - 1);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePrevious = () => {
    if (currentPage > 0 && !loading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1 && !loading) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    if (page !== '...' && page !== currentPage && !loading) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center space-x-2 py-8">
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentPage === 0 || loading}
        className="w-10 h-10 border-2 border-dark-950 bg-transparent text-dark-950
                 hover:bg-dark-950 hover:text-light-50 transition-all
                 disabled:opacity-30 disabled:cursor-not-allowed
                 flex items-center justify-center"
        aria-label="Previous page"
      >
        <FiChevronLeft size={20} />
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => (
        <button
          key={index}
          onClick={() => handlePageClick(page)}
          disabled={page === '...' || page === currentPage || loading}
          className={`
            min-w-[40px] h-10 px-3 border-2 font-bold text-sm
            transition-all
            ${page === currentPage
              ? 'bg-dark-950 border-dark-950 text-light-50'
              : page === '...'
              ? 'bg-transparent border-transparent text-gray-400 cursor-default'
              : 'bg-transparent border-dark-950 text-dark-950 hover:bg-dark-950 hover:text-light-50'
            }
            disabled:cursor-not-allowed
          `}
        >
          {page === '...' ? '...' : page + 1}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages - 1 || loading}
        className="w-10 h-10 border-2 border-dark-950 bg-transparent text-dark-950
                 hover:bg-dark-950 hover:text-light-50 transition-all
                 disabled:opacity-30 disabled:cursor-not-allowed
                 flex items-center justify-center"
        aria-label="Next page"
      >
        <FiChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;

