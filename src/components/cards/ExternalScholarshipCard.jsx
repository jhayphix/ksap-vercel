import { useContext } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import DeadlineTimeTag from "@components/tags/DeadlineTimeTag";
import { ConfigContext } from "@contexts/ConfigContextProvider";

const ExternalScholarshipCard = ({
  name,
  deadline,
  url,
  sponsor,
  imagePath,
}) => {
  const { HELPER } = useContext(ConfigContext);

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

      <Card.Body className="d-flex flex-column justify-content-between p-3">
        <div>
          <Card.Title className="fw-bold text-dark mb-2">{name}</Card.Title>
          <Card.Subtitle
            className="text-muted mb-2"
            style={{ fontSize: "0.95rem" }}
          >
            Sponsored by {sponsor}
          </Card.Subtitle>
          <Badge
            bg="secondary"
            className="mb-3"
            style={{ fontSize: "0.75rem" }}
          >
            Deadline: {HELPER?.formatDateTime(deadline)}
          </Badge>
          <div className="">
            <DeadlineTimeTag deadline={deadline} />
          </div>
        </div>

        <div className="d-flex justify-content-end mt-auto">
          <Button
            // variant="outline-primary"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 px-3 py-2 btn_secondary_outline_2"
          >
            Take Action
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ExternalScholarshipCard;
