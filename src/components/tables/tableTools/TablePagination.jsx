import {
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaDownload,
} from "react-icons/fa";
import { CSVLink } from "react-csv";

const TablePagination = ({
  filteredData = [],
  paginationData = {},
  canDownload = false,
  tableName = "table_data",
}) => {
  const {
    currentPage,
    totalPages,
    rowsPerPage,
    setRowsPerPage,
    setCurrentPage,
    indexOfFirstRow,
    indexOfLastRow,
  } = paginationData;

  const filteredDataWithoutId = filteredData?.map(
    ({ id, ...otherData }) => otherData
  );

  return (
    <div
      className="d-flex justify-content-between align-items-center has_scrollbar mt-3"
      style={{ overflowX: "auto", maxWidth: "100vw" }}
    >
      {canDownload ? (
        <CSVLink
          data={filteredDataWithoutId}
          filename={`${tableName}.csv`}
          className="btn btn_secondary_2 d-none d-md-inline-block"
        >
          <FaDownload /> Download Table
        </CSVLink>
      ) : (
        <div></div>
      )}

      <div className="d-flex justify-content-end align-items-center">
        <label className="me-2 fw-light d-none d-md-inline-block">
          Rows per page:
        </label>
        <select
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
          className="form-select me-3"
          style={{ width: "80px" }}
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <span className="me-3">
          {indexOfFirstRow + 1} -{" "}
          {Math.min(indexOfLastRow, filteredData.length)} of{" "}
          {filteredData.length}
        </span>
        <button
          className="btn btn-light mx-1"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        >
          <FaAngleDoubleLeft />
        </button>
        <button
          className="btn btn-light mx-1"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaAngleLeft />
        </button>
        <button
          className="btn btn-light mx-1"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <FaAngleRight />
        </button>
        <button
          className="btn btn-light mx-1"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          <FaAngleDoubleRight />
        </button>
      </div>
    </div>
  );
};

export default TablePagination;
