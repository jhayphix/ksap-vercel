import { useContext } from "react";
import { Card, Button } from "react-bootstrap";
import { BsBoxArrowUpRight } from "react-icons/bs";

import { ConfigContext } from "@contexts/ConfigContextProvider";
import { AuthContext } from "@contexts/AuthContextProvider";

import DeadlineTimeRemainBadge from "@components/tags/DeadlineTimeRemainBadge";
import DefaultBadge from "@components/tags/DefaultBadge";
import ExternalScholarshipActionBtn from "@components/buttons/ExternalScholarshipActionBtn";

const ExternalScholarshipCard = ({
  id,
  name,
  deadline,
  url,
  sponsor,
  imagePath,
}) => {
  const { HELPER } = useContext(ConfigContext);
  const { authStatus } = useContext(AuthContext);

  const scholarshipId = id;

  return (
    <Card className="h-100 shadow-sm external-scholarship-card border-0">
      <Card.Img
        variant="top"
        src={imagePath}
        alt={`${sponsor} image`}
        style={{
          height: "160px",
          width: "100%",
          objectFit: "cover",
          borderTopLeftRadius: "0.5rem",
          borderTopRightRadius: "0.5rem",
        }}
      />

      <Card.Body className="d-flex flex-column justify-content-between p-3 bg_primary_2">
        <div>
          <Card.Title className="fw-bold text-dark mb-2">{name}</Card.Title>
          <Card.Subtitle
            className="text-muted mb-2"
            style={{ fontSize: "0.95rem" }}
          >
            Sponsored by {sponsor}
          </Card.Subtitle>
          <DefaultBadge
            className="mb-3 bg_secondary_2"
            text={`Deadline: ${HELPER?.formatDateTime(deadline)}`}
            color="warning"
          />

          <div className="">
            <DeadlineTimeRemainBadge deadline={deadline} />
          </div>
        </div>

        <div className="d-flex justify-content-between mt-3">
          {authStatus?.isUserSuperAdmin ? (
            <ExternalScholarshipActionBtn scholarshipId={scholarshipId} />
          ) : (
            <div></div>
          )}
          <Button
            // variant="outline-primary"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 btn_secondary_outline_2"
          >
            <BsBoxArrowUpRight className="me-2" />
            Take Action
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ExternalScholarshipCard;
