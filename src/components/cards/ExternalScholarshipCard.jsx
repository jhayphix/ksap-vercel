import { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";

const ExternalScholarshipCard = ({ name, deadline, url, sponsor, logoUrl }) => {
  const defaultImage = "https://via.placeholder.com/300x120?text=No+Logo";
  const [loadedImage, setLoadedImage] = useState(defaultImage);

  // Preload logo image
  useEffect(() => {
    if (logoUrl) {
      const img = new Image();
      img.src = logoUrl;
      img.onload = () => setLoadedImage(logoUrl);
      img.onerror = () => setLoadedImage(defaultImage);
    } else {
      setLoadedImage(defaultImage);
    }
  }, [logoUrl]);

  return (
    <Card className="h-100 shadow-sm external-scholarship-card">
      <Card.Img
        variant="top"
        src={loadedImage}
        alt={`${sponsor} logo`}
        style={{ maxHeight: "120px", objectFit: "contain", padding: "1rem" }}
      />

      <Card.Body>
        <Card.Title className="text-truncate">{name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{sponsor}</Card.Subtitle>
        <p className="text-danger small mb-2">
          Deadline: {new Date(deadline).toDateString()}
        </p>
        <Button
          className="btn btn_secondary_2"
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
