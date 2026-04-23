const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const goToPrev = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const goToNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
            {/* Prev Button */}
            <button
                onClick={goToPrev}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md border 
                ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-100"}`}
            >Prev
            </button>
            {/* Page Numbers */}
            {
                Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => onPageChange(index + 1)}
                        className={`px-3 py-1 rounded-md border transition 
                            ${currentPage === index + 1 ? "bg-blue-600 text-white border-blue-600 shadow": "bg-white text-gray-700 hover:bg-blue-100"}`}
                        >{index + 1}
                    </button>
                ))
            }
            <button
                onClick={goToNext}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md border 
                ${ currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 hover:bg-gray-100" }`}
                >Next
            </button>
        </div>
    )
}

export default Pagination