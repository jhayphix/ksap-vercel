import { useContext } from "react";
import { Link } from "react-router-dom";

import { ConfigContext } from "@contexts/ConfigContextProvider";
import { NavigationContext } from "@contexts/NavigationContextProvider";

import DefaultStatusTag from "@components/tags/DefaultStatusTag";
import { MdArrowForward } from "react-icons/md";

const AdminScholarshipDetailCard = ({ bgColor, className, scholarship }) => {
  const { HELPER } = useContext(ConfigContext);
  const { scholarshipApplicantsRoute } = useContext(NavigationContext);

  return (
    <div
      className={`${className} rounded p-2 text-light user_select_none`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="d-flex align-items-center justify-content-between pb-2">
        <p style={{ fontSize: "0.7rem", opacity: "0.9" }}>
          {scholarship?.academicYear}
        </p>
        <DefaultStatusTag
          text={HELPER?.getDDMMYYYY(scholarship?.deadline)}
          color="danger"
        />
      </div>
      <hr className="m-0" />
      <div
        className="py-1 d-flex flex-column justify-content-between d-inline-block has_scrollbar"
        style={{ height: "8rem" }}
      >
        <h5>{scholarship?.name}</h5>
        <div className="d-flex justify-content-end align-items-center mt-2 fw-semibold">
          <p
            className="bg_success_light text-muted d-inline-block px-3 rounded"
            style={{ fontSize: "1.2rem" }}
          >
            {HELPER?.formatToKOrM(scholarship?.numberOfApplications, true, 3)}
          </p>
        </div>
      </div>
      <hr className="m-0" />
      <div className="d-flex align-items-center justify-content-between pt-2">
        <DefaultStatusTag
          text={
            HELPER?.isDeadlineDue(scholarship?.deadline) ? "Closed" : "Open"
          }
          color={
            HELPER?.isDeadlineDue(scholarship?.deadline) ? "danger" : "success"
          }
        />
        <Link
          to={scholarshipApplicantsRoute?.getPath(scholarship?.id)}
          className="text-light hover_underline"
          style={{ opacity: "0.9" }}
        >
          More Info
          <MdArrowForward />
        </Link>
      </div>
    </div>
  );
};

export default AdminScholarshipDetailCard;
