import { useState, useEffect, useContext, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { NavigationContext } from "@contexts/NavigationContextProvider";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import TablePagination from "@components/tables/tableTools/TablePagination";
import DefaultBadge from "@components/tags/DefaultBadge";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { FaWrench } from "react-icons/fa";
import { TableDataContext } from "@contexts/TableDataContextProvider";

const statusList = [
  {
    label: "All",
    key: "all",
    searchKey: "all",
    searchKeyValue: true,
    description: "Show All Status",
  },
  {
    label: "Processed",
    key: "isProcessed",
    searchKey: "isProcessed",
    searchKeyValue: true,
    description: "Application has passed through all stages to approval stage",
  },
  {
    label: "Approved",
    key: "isApproved",
    searchKey: "isApproved",
    searchKeyValue: true,
    description: "Application Has been approved",
  },
  {
    label: "Pending Approval",
    key: "isPendingApproval",
    searchKey: "isPendingApproval",
    searchKeyValue: true,
    description: "Application is on pending for letter approval",
  },
  {
    label: "Disapproved",
    key: "isDisapproved",
    searchKey: "isDisapproved",
    searchKeyValue: true,
    description: "Application has been disapproved",
  },
  {
    label: "Qualified",
    key: "isQualified",
    searchKey: "isQualified",
    searchKeyValue: true,
    description: "Applicant's application has been qualified",
  },
  {
    label: "Pending Review",
    key: "isPendingReview",
    searchKey: "isPendingReview",
    searchKeyValue: true,
    description: "Applicantion is on pending for later review",
  },
  {
    label: "Disqualified",
    key: "isDisqualified",
    searchKey: "isDisqualified",
    searchKeyValue: true,
    description: "Application has been disqualified",
  },
  {
    label: "Reviewed",
    key: "isReviewed",
    searchKey: "isReviewed",
    searchKeyValue: true,
    description: "Application has been reviewed",
  },
  {
    label: "Not Reviewed",
    key: "isNotReviewed",
    searchKey: "isReviewed",
    searchKeyValue: false,
    description: "Application has not been reviewed",
  },
];

const MultiSearchTable = ({
  rawData,
  adminsData,
  className,
  canDownload,
  tableName,
}) => {
  const { evaluateApplicationRoute } = useContext(NavigationContext);
  const { HELPER, setShowFlashMessage } = useContext(ConfigContext);
  const { getApplicationsTableData, applicationTableDefaultColumns } =
    useContext(TableDataContext);

  const [showCustomizeColumn, setShowCustomizeColumn] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [filters, setFilters] = useState({});
  const [activeApplicationStatus, setActiveApplicationStatus] = useState({});
  const [visibleColumns, setVisibleColumns] = useState({});
  const [tableHasData, setTableHasData] = useState(false);
  const [dataFilteredByStatus, setDataFilteredByStatus] = useState([]);

  useEffect(() => {
    const dataFiltered = getApplicationsTableData(
      rawData,
      adminsData,
      activeApplicationStatus?.searchKey,
      activeApplicationStatus?.searchKeyValue
    );

    setDataFilteredByStatus(dataFiltered);
  }, [
    getApplicationsTableData,
    rawData,
    adminsData,
    activeApplicationStatus?.searchKey,
    activeApplicationStatus?.searchKeyValue,
  ]); // Dependencies ensure recomputation only when needed

  //eslint-disable-next-line
  const exampleData = useMemo(
    () => [
      {
        type: "This is an example data",
        name: "John Doe",
        age: 30,
        country: "USA",
      },
    ],
    []
  ); // Memoized static data

  const tableData = useMemo(
    () => dataFilteredByStatus || [],
    [dataFilteredByStatus]
  );

  // Add and remove column
  const allColumns = Object.keys(tableData?.[0] || {}).filter(
    (key) => key?.toLowerCase() !== "id"
  );

  useEffect(() => {
    if (tableData?.length > 0) {
      setTableHasData(true);
      setShowFlashMessage({
        isActive: false,
      });
      const defaultColumns = applicationTableDefaultColumns;
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
        message: "No Scholarship Application Found",
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

  // Filter by Status

  const hasSetDefault = useRef(false);

  useEffect(() => {
    if (!hasSetDefault.current && statusList?.length > 0) {
      setActiveApplicationStatus(statusList[0]);
      hasSetDefault.current = true;
    }
  }, []);

  // End filter by status

  // Filter
  const handleFilterChange = (column, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [column]: value }));
  };

  let filteredData = tableData
    ?.filter((row) =>
      Object.values(row).some((value) =>
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
            <div className="col-12 col-md-6 col-lg-6">
              <label className="fw-semibold">
                {activeApplicationStatus?.label} Application Status
              </label>
              <select
                className={`form-select ${
                  !tableHasData
                    ? "bg-warning text-light"
                    : activeApplicationStatus?.key?.toLowerCase() !== "all"
                    ? "bg-info text-light"
                    : ""
                }`}
                value={activeApplicationStatus?.key}
                onChange={(e) => {
                  const selectedStatus = statusList?.find(
                    (status) => status?.key === e.target.value
                  );
                  setActiveApplicationStatus(
                    selectedStatus || { key: "", label: "All" }
                  );
                }}
              >
                {statusList?.map((status, statusIndex) => (
                  <option
                    value={status?.key}
                    key={`${statusIndex}-${status?.key}`}
                    data-bs-toggle="tooltip"
                    data-bs-placement="right"
                    title={status?.description}
                  >
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Column Selection */}
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
                    ?.map((key, keyIndex) => (
                      <th
                        key={`${key}-${keyIndex}`}
                        style={{ position: "relative", minWidth: "150px" }}
                      >
                        <div
                          onClick={() => handleSort(key)}
                          className="cursor_pointer fw-medium text_capitalize text_dark_2"
                        >
                          {key}{" "}
                          {sortColumn === key
                            ? sortOrder === "asc"
                              ? "▲"
                              : "▼"
                            : null}
                        </div>
                        <select
                          className="form-select"
                          onChange={(e) =>
                            handleFilterChange(key, e.target.value)
                          }
                        >
                          <option value="">All</option>
                          {[...new Set(tableData?.map((row) => row[key]))].map(
                            (value, valueIndex) => (
                              <option key={`${valueIndex}`} value={value}>
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
                            <td key={`${i}`} style={{ minWidth: "150px" }}>
                              {key.toLowerCase() === "name" ? (
                                <Link
                                  to={evaluateApplicationRoute?.getPath(id)}
                                  className="hover_underline hover_highlight"
                                >
                                  {value}
                                </Link>
                              ) : [
                                  "applicationstatus",
                                  "application status",
                                  "current application status",
                                ].includes(key?.toLowerCase()) ? (
                                <DefaultBadge
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
export default MultiSearchTable;
