import React from "react";


const Pagination = ({ currentPage = 10, setCurrentPage, totalPages = 100, totalElement = 0, pageSize = 10, visiblePage }) => {
    let lastPage;
    let startPage = 1;

    if (totalPages <= 10) {
        startPage = 1;
        lastPage = totalPages;
    } else {
        if (currentPage <= 6) {
            startPage = 1;
            lastPage = 10;
        } else if (currentPage + 4 >= totalPages) {
            startPage = totalPages - 9;
            lastPage = totalPages;
        } else {
            startPage = currentPage - 5;
            lastPage = Number(currentPage) + 4;
        }
    }

    // create an array of pages to ng-repeat in the pager control
    const pages = [...Array(lastPage + 1 - startPage).keys()].map(
        i => startPage + i
    );

    const updateCurrentPage = e => {
        e.preventDefault();
        const page = e.target.value;
        if (page !== currentPage) {
            setCurrentPage(parseInt(page));
        }
    };

    return (
        <div
            className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
                <span className="flex items-center col-span-3">
                </span>
            <span className="col-span-2"/>
            <span className="flex col-span-4 mt-2 sm:mt-auto sm:justify-end">
                  <nav aria-label="Table navigation">
                    <ul className="inline-flex items-center">
                      <li>
                        <button
                            className="px-3 py-1 rounded-md rounded-l-lg focus:outline-none focus:shadow-outline-purple"
                            onClick={() => {
                                if(currentPage <= 1) return;
                                setCurrentPage(currentPage - 1);
                            }}
                            aria-label="Previous">
                          <svg aria-hidden="true" className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                            <path
                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                clipRule="evenodd" fillRule="evenodd"/>
                          </svg>
                        </button>
                      </li>
                        {pages.map((page, index) => {
                            return (
                                <li key={`${index}-page`}>
                                    <button
                                        className={
                                            currentPage === page
                                                ? "px-3 py-1 text-white transition-colors duration-150 bg-blue-600 border border-r-0 border-purple-600 rounded-md focus:outline-none focus:shadow-outline-purple"
                                                : "px-3 py-1 rounded-md focus:outline-none focus:shadow-outline-purple"
                                        }
                                        value={page}
                                        onClick={updateCurrentPage}
                                    >
                                        {page}
                                    </button>
                                </li>
                            );
                        })}
                      <li>
                        <button
                            className="px-3 py-1 rounded-md rounded-r-lg focus:outline-none focus:shadow-outline-purple"
                            onClick={() => {
                                if(currentPage === totalPages) return;
                                setCurrentPage(currentPage + 1);
                            }}
                            aria-label="Next">
                          <svg className="w-4 h-4 fill-current" aria-hidden="true" viewBox="0 0 20 20">
                            <path
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clipRule="evenodd" fillRule="evenodd"/>
                          </svg>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </span>
        </div>
    );
};

export default Pagination;
