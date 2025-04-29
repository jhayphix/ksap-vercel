import { useContext } from "react";
import { FaAward } from "react-icons/fa";
import { Link } from "react-router-dom";

import { NavigationContext } from "@contexts/NavigationContextProvider";
import { AuthContext } from "@contexts/AuthContextProvider";

import DeadlineTimeRemainBadge from "@components/tags/DeadlineTimeRemainBadge";
import ApplyButton from "@components/buttons/ApplyButton";
import ScholarshipActionBtn from "@components/buttons/ScholarshipActionBtn";

const ScholarshipCard = ({
  scholarshipId,
  name = "Scholarship Name",
  deadline = "",
  requirements = ["Requirement"],
}) => {
  const { viewScholarshipRoute } = useContext(NavigationContext);
  const { authStatus } = useContext(AuthContext);

  const scholarshipName = name;
  // Return
  return (
    <div className="px-sm-3 pb-5 px-0" style={{ Height: "auto" }}>
      <div className="bg_primary_2 cursor_default px-3 py-3 rounded h-100 w-100">
        <div className="d-flex justify-content-between align-items-center">
          <div
            className="bg_secondary_3 p-2 rounded centering"
            style={{
              width: "3.5rem",
              // border: "1px solid var(--secondary_color_2)",
            }}
          >
            <FaAward size={35} className="bs_text_warning" />
          </div>
          {authStatus?.isUserSuperAdmin ? (
            <ScholarshipActionBtn
              scholarshipId={scholarshipId}
              scholarshipName={scholarshipName}
            />
          ) : null}
        </div>

        <p
          className="py-3 text_secondary"
          style={{
            fontSize: "0.9rem",
            textTransform: "uppercase",
            fontWeight: "700",
            minHeight: "4.5rem",
          }}
        >
          {name}
        </p>
        <ul
          className="rounded ps-3 border-top border-bottom has_scrollbar"
          style={{ height: "11rem" }}
        >
          {requirements?.map((requirement, index) => (
            <li
              key={index}
              className="mb-2"
              style={{ listStyleType: "disc", fontSize: "0.8rem" }}
            >
              {requirement}
            </li>
          ))}
        </ul>
        <div className="centering py-3">
          <DeadlineTimeRemainBadge deadline={deadline} />
        </div>
        <div className="centering">
          {authStatus?.isUserAdmin ? (
            <Link
              to={viewScholarshipRoute?.getPath(scholarshipId)}
              className="btn_secondary_outline_2 rounded py-2 px-3"
            >
              View Scholarship
            </Link>
          ) : (
            <ApplyButton
              deadline={deadline}
              path={viewScholarshipRoute?.getPath(scholarshipId)}
              scholarshipId={scholarshipId}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ScholarshipCard;
