import React from "react";
import ReactPaginate from "react-paginate";

const CustomPagination = ({
  pageCount,
  onPageChange,
  currentPage,
  nextLabel,
  previousLabel,
}) => {
  return (
    <>
      {pageCount > 1 && (
        <div className="flex justify-center mt-6">
          <ReactPaginate
            nextLabel={nextLabel}
            previousLabel={previousLabel}
            onPageChange={onPageChange}
            pageRangeDisplayed={3}
            marginPagesDisplayed={2}
            pageCount={pageCount}
            containerClassName="flex p-2 border rounded shadow-lg"
            activeClassName="text-blue-700 font-bold"
            pageLinkClassName="py-2 px-4 "
            previousLinkClassName="py-2 px-4  mr-2"
            nextLinkClassName="py-2 px-4  ml-2"
            disabledClassName="cursor-not-allowed"
            breakClassName="mr-2"
            forcePage={currentPage}
          />
        </div>
      )}
    </>
  );
};

export default CustomPagination;
