import { Card, Button, Badge } from "react-bootstrap";

const ExternalScholarshipCard = ({
  name,
  deadline,
  url,
  sponsor,
  coverImageUrl,
  location,
}) => {
  return (
    <Card className="h-100 shadow-sm external-scholarship-card">
      {coverImageUrl && (
        <Card.Img
          variant="top"
          src={coverImageUrl}
          alt={`${sponsor} logo`}
          style={{ maxHeight: "120px", objectFit: "contain", padding: "1rem" }}
        />
      )}

      <Card.Body>
        <Card.Title className="text-truncate">{name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{sponsor}</Card.Subtitle>
        {location && (
          <Badge bg="info" className="mb-2">
            {location}
          </Badge>
        )}
        <p className="text-danger small mb-2">
          Deadline: {new Date(deadline).toDateString()}
        </p>
        <Button
          variant="primary"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Apply Now
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ExternalScholarshipCard;
