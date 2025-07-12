import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  showStats = true,
  totalItems = 0,
  itemsPerPage = 10,
  size = 'default'
}) => {
  const isCompact = size === 'compact';
  const isLarge = size === 'large';

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const delta = isCompact ? 1 : 2; // Show fewer pages on compact mode
    const range = [];
    const rangeWithDots = [];

    // Always show first page
    range.push(1);

    // Calculate range around current page
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    // Always show last page if there are multiple pages
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Add dots where there are gaps
    let last;
    for (let i of range) {
      if (last) {
        if (i - last === 2) {
          rangeWithDots.push(last + 1);
        } else if (i - last !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      last = i;
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  // Calculate stats
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only one page
  }

  const buttonClass = `
    flex items-center justify-center font-medium transition-all duration-200
    ${isCompact 
      ? 'w-8 h-8 text-xs' 
      : isLarge 
        ? 'w-12 h-12 text-base' 
        : 'w-10 h-10 text-sm'
    }
  `;

  const pageButtonClass = `
    ${buttonClass}
    border border-gray-300 
    hover:bg-gray-50 hover:border-gray-400
    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1
  `;

  const activePageButtonClass = `
    ${buttonClass}
    bg-indigo-600 text-white border border-indigo-600
    hover:bg-indigo-700
    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1
  `;

  const navButtonClass = `
    ${buttonClass}
    border border-gray-300 text-gray-500
    hover:bg-gray-50 hover:border-gray-400 hover:text-gray-700
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-300 disabled:hover:text-gray-500
    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1
  `;

  return (
    <div className={`flex flex-col ${isCompact ? 'space-y-2' : 'space-y-4'}`}>
      {/* Stats */}
      {showStats && totalItems > 0 && (
        <div className={`text-center ${isCompact ? 'text-xs' : 'text-sm'} text-gray-600`}>
          Showing <span className="font-medium">{startItem}</span> to{' '}
          <span className="font-medium">{endItem}</span> of{' '}
          <span className="font-medium">{totalItems}</span> results
        </div>
      )}

      {/* Pagination Controls */}
      <nav className="flex items-center justify-center" aria-label="Pagination">
        <div className={`flex items-center ${isCompact ? 'space-x-1' : 'space-x-2'}`}>
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`${navButtonClass} ${isCompact ? 'rounded' : 'rounded-l-lg'}`}
            aria-label="Previous page"
          >
            <ChevronLeft className={`${isCompact ? 'h-3 w-3' : 'h-4 w-4'}`} />
            {!isCompact && <span className="ml-1">Previous</span>}
          </button>

          {/* Page Numbers */}
          <div className={`flex items-center ${isCompact ? 'space-x-1' : 'space-x-0'}`}>
            {visiblePages.map((page, index) => {
              if (page === '...') {
                return (
                  <span
                    key={`dots-${index}`}
                    className={`flex items-center justify-center ${
                      isCompact ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'
                    } text-gray-400`}
                  >
                    <MoreHorizontal className={`${isCompact ? 'h-3 w-3' : 'h-4 w-4'}`} />
                  </span>
                );
              }

              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`
                    ${isActive ? activePageButtonClass : pageButtonClass}
                    ${isCompact ? 'rounded' : index === 0 ? 'rounded-l' : index === visiblePages.length - 1 ? 'rounded-r' : ''}
                    ${!isCompact && 'border-l-0 first:border-l'}
                  `}
                  aria-label={`Page ${page}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`${navButtonClass} ${isCompact ? 'rounded' : 'rounded-r-lg border-l-0'}`}
            aria-label="Next page"
          >
            {!isCompact && <span className="mr-1">Next</span>}
            <ChevronRight className={`${isCompact ? 'h-3 w-3' : 'h-4 w-4'}`} />
          </button>
        </div>
      </nav>

      {/* Quick Jump (for large pagination) */}
      {!isCompact && totalPages > 10 && (
        <div className="flex items-center justify-center space-x-2 text-sm">
          <span className="text-gray-600">Jump to page:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) {
                onPageChange(page);
              }
            }}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <span className="text-gray-600">of {totalPages}</span>
        </div>
      )}
    </div>
  );
};

// Alternative compact pagination for mobile
export const CompactPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </button>

      <span className="text-sm text-gray-700">
        Page <span className="font-medium">{currentPage}</span> of{' '}
        <span className="font-medium">{totalPages}</span>
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </button>
    </div>
  );
};

export default Pagination;