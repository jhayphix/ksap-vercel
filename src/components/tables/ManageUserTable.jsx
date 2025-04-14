import { useState, useEffect, useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { FaWrench } from "react-icons/fa";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

import { ConfigContext } from "@contexts/ConfigContextProvider";

import TablePagination from "@components/tables/tableTools/TablePagination";
import DefaultStatusTag from "@components/tags/DefaultStatusTag";

const ManageUserTable = ({
  rawData,
  route = { getPath: (id) => `/${id}` },
  defColumns,
  className,
  canDownload,
  tableName,
}) => {
  const { HELPER, setShowFlashMessage } = useContext(ConfigContext);

  const [showCustomizeColumn, setShowCustomizeColumn] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filters, setFilters] = useState({});
  const [visibleColumns, setVisibleColumns] = useState({});
  const [tableHasData, setTableHasData] = useState(false);

  // Example table data
  const exampleData = useMemo(
    () => [
      {
        "Eg Column 1": "Data from column 1",
        name: "This is an example",
        "Eg Column 3": "Data from column 3",
        country: "USA",
      },
    ],
    []
  ); // Memoized static data

  const tableData = useMemo(
    () => rawData ?? exampleData,
    [rawData, exampleData]
  );

  // Add and remove column
  const allColumns = Object.keys(tableData?.[0] || {}).filter(
    (key) => key?.toLowerCase() !== "id"
  );

  // Set Default columns to show
  useEffect(() => {
    if (tableData?.length > 0) {
      setTableHasData(true);
      setShowFlashMessage({
        isActive: false,
      });

      const defaultColumns = defColumns;

      setVisibleColumns(
        Object.keys(tableData[0] || {}).reduce(
          (acc, col) => ({
            ...acc,
            [col]: defaultColumns.includes(col.toLowerCase()), // Show only default columns
          }),
          {}
        )
      );
    } else {
      setTableHasData(false);
      setShowFlashMessage({
        isActive: true,
        message: "No User Found",
        type: "error",
      });
    }

    //eslint-disable-next-line
  }, [tableData]);

  const handleColumnToggle = (column) => {
    setVisibleColumns((prev) => {
      const updatedColumns = { ...prev, [column]: !prev[column] };
      return updatedColumns;
    });
  };
  const handleSelectAllColumns = () => {
    const allSelected = Object.values(visibleColumns).every((val) => val);

    setVisibleColumns(
      allColumns.reduce(
        (acc, col) => ({
          ...acc,
          [col]: !allSelected, // Toggle all on or off
        }),
        {}
      )
    );
  };

  // End add and remove column

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  // Filter
  const handleFilterChange = (column, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [column]: value }));
  };

  let filteredData = tableData
    ?.filter((row) =>
      Object.values(row)?.some((value) =>
        value?.toString()?.toLowerCase()?.includes(search?.toLowerCase())
      )
    )
    .filter((row) =>
      Object.entries(filters)?.every(
        ([column, value]) => !value || row[column] === value
      )
    );
  // End filter

  // Sort
  const handleSort = (column) => {
    setSortOrder(sortColumn === column && sortOrder === "asc" ? "desc" : "asc");
    setSortColumn(column);
  };
  if (sortColumn) {
    filteredData?.sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];
      return sortOrder === "asc"
        ? valA > valB
          ? 1
          : -1
        : valA < valB
        ? 1
        : -1;
    });
  }
  // End sort

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const paginationData = {
    currentPage,
    totalPages,
    rowsPerPage,
    setRowsPerPage,
    setCurrentPage,
    indexOfFirstRow,
    indexOfLastRow,
  };

  return (
    <div className={`${className} `}>
      <div className="row align-items-center g-3">
        {/* Search Input */}
        <div className="col-12">
          <div id="uniqueCustomForm" className="row">
            <div className="col-12 col-md-6 col-lg-6 ">
              <label className="fw-semibold">Search Applications</label>
              <input
                type="text"
                placeholder="🔍 Search Applications"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-control input mb-3 shadow_sm"
              />
            </div>
          </div>
        </div>

        {/* Customize Columns */}
        <div className="col-12 mb-4">
          <p
            className="fw-semibold mb-2 cursor_pointer d-inline-block user_select_none hover_highlight"
            style={{ fontSize: "1rem" }}
            onClick={() => setShowCustomizeColumn((prevState) => !prevState)}
          >
            <FaWrench />
            <span className="mx-2">Customize Columns</span>{" "}
            {showCustomizeColumn ? <MdVisibilityOff /> : <MdVisibility />}
          </p>

          {/* Customize Columns List */}
          <div
            className={`d-flex flex-wrap gap-3 border bg_light shadow_sm rounded p-2 transition_height ${
              showCustomizeColumn ? "d-block" : "d-none"
            }`}
          >
            {/* "All" checkbox */}
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={Object.values(visibleColumns).every((val) => val)} // Check if all are selected
                onChange={() => handleSelectAllColumns()}
                id="col-all"
              />
              <label
                className="text_capitalize text-muted hover_highlight cursor_pointer"
                htmlFor="col-all"
              >
                All
              </label>
            </div>

            {/* Individual Column Checkboxes */}
            {allColumns
              .slice()
              .sort()
              .map((column) => (
                <div key={column} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={visibleColumns?.[column] ?? true}
                    onChange={() => handleColumnToggle(column)}
                    id={`col-${column}`}
                  />
                  <label
                    className="text_capitalize text-muted hover_highlight cursor_pointer"
                    htmlFor={`col-${column}`}
                  >
                    {column}
                  </label>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div
        className="table-responsive has_scrollbar bg-light"
        style={{ overflowX: "auto", whiteSpace: "nowrap" }}
      >
        {!tableHasData ? (
          <div className="text_warning text-center fw-semibold py-3">
            No Application found
          </div>
        ) : (
          <>
            <table className="table table-success table-striped table-hover table-bordered">
              <thead
                style={{ backgroundColor: "var(--success_light_color)" }}
                className="user_select_none"
              >
                <tr>
                  {allColumns
                    ?.filter((key) => visibleColumns?.[key] ?? true)
                    ?.map((key) => (
                      <th
                        key={key}
                        style={{ position: "relative", minWidth: "150px" }}
                      >
                        <div
                          onClick={() => handleSort(key)}
                          className="cursor_pointer fw-medium text_capitalize text_dark_2"
                        >
                          {key}{" "}
                          {sortColumn === key ? (
                            sortOrder === "asc" ? (
                              "▲"
                            ) : (
                              "▼"
                            )
                          ) : (
                            <span key={key}></span>
                          )}
                        </div>
                        <select
                          className="form-select"
                          onChange={(e) =>
                            handleFilterChange(key, e.target.value)
                          }
                        >
                          <option value="">All</option>
                          {[...new Set(tableData?.map((row) => row[key]))].map(
                            (value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            )
                          )}
                        </select>
                      </th>
                    ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="12" className="text-center">
                      <div
                        className="spinner-border text-success"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentRows.map((row, index) => {
                    const { id, ...otherData } = row;
                    return (
                      <tr key={index}>
                        {Object.entries(otherData)
                          ?.filter(
                            ([key]) =>
                              (visibleColumns?.[key] ?? true) &&
                              key?.toLowerCase() !== "id"
                          )
                          ?.map(([key, value], i) => (
                            <td key={i} style={{ minWidth: "150px" }}>
                              {key.toLowerCase() === "name" ? (
                                <Link
                                  to={route?.getPath(id)}
                                  className="hover_underline hover_highlight"
                                >
                                  {value}
                                </Link>
                              ) : [
                                  "applicationstatus",
                                  "application status",
                                  "current application status",
                                ].includes(key?.toLowerCase()) ? (
                                <DefaultStatusTag
                                  color={
                                    HELPER?.getStatusWithColor(value)?.color
                                  }
                                  text={
                                    HELPER?.getStatusWithColor(value)?.status
                                  }
                                />
                              ) : (
                                value
                              )}
                            </td>
                          ))}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </>
        )}
      </div>

      <TablePagination
        paginationData={paginationData}
        filteredData={filteredData}
        canDownload={canDownload}
        tableName={tableName}
      />
    </div>
  );
};
export default ManageUserTable;
