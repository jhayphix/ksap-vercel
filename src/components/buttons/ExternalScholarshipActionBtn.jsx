import { Link } from "react-router-dom";
import { NavigationContext } from "@contexts/NavigationContextProvider";
import { useContext } from "react";
import { FaEdit, FaEye } from "react-icons/fa";
import DropdownWrapper from "@components/dropdown/DropdownWrapper";
import { MdDelete } from "react-icons/md";

import { ExternalScholarshipContext } from "@contexts/ExternalScholarshipContextProvider";

const ExternalScholarshipActionBtn = ({ scholarshipId, scholarshipName }) => {
  const { updateExternalScholarshipRoute, viewExternalScholarshipRoute } =
    useContext(NavigationContext);
  const { showDeleteExternalScholarshipModal } = useContext(
    ExternalScholarshipContext
  );

  const handleDeleteScholarship = () => {
    if (scholarshipId) {
      showDeleteExternalScholarshipModal(scholarshipId, scholarshipName);
    }
  };

  return (
    <DropdownWrapper
      id="viewEditScholarshipDropdown"
      className="rounded bg_secondary_3"
    >
      <Link
        data-bs-toggle="tooltip"
        data-bs-placement="right"
        title={viewExternalScholarshipRoute?.title}
        to={viewExternalScholarshipRoute?.getPath(scholarshipId)}
        className="dropdown-item cursor_pointer text_secondary me-4"
      >
        <FaEye size={20} className="me-2" /> Preview
      </Link>
      <Link
        data-bs-toggle="tooltip"
        data-bs-placement="right"
        title={updateExternalScholarshipRoute?.title}
        to={updateExternalScholarshipRoute?.getPath(scholarshipId)}
        className="dropdown-item cursor_pointer text_secondary"
      >
        <FaEdit size={20} className="me-2" /> Edit
      </Link>
      <hr className="my-3" />
      <button
        className="btn dropdown-item text_danger text-danger"
        onClick={() => handleDeleteScholarship()}
      >
        <MdDelete size={20} className="me-2" /> Delete
      </button>
    </DropdownWrapper>
  );
};

export default ExternalScholarshipActionBtn;
