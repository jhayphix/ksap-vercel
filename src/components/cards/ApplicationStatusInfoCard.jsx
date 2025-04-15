import { Card, Row, Col } from "react-bootstrap";
import {
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaInfoCircle,
} from "react-icons/fa";

const statusInfo = [
  {
    title: "Awaiting Review",
    description:
      "Your application is in the queue and has not been reviewed yet.",
    icon: <FaHourglassHalf className="text-warning" />,
  },
  {
    title: "Pending Review",
    description:
      "Your application was partially reviewed and will be reviewed again soon.",
    icon: <FaInfoCircle className="text-primary" />,
  },

  {
    title: "Disqualified",
    description: "Unfortunately, you did not pass the review stage.",
    icon: <FaTimesCircle className="text-danger" />,
  },
  {
    title: "Qualified",
    description:
      "You passed the review stage and are eligible for the next step.",
    icon: <FaCheckCircle className="text-success" />,
  },
  {
    title: "Awaiting Approval",
    description:
      "You have qualified, and your application is in the queue and has not been approved yet.",
    icon: <FaHourglassHalf className="text-warning" />,
  },
  {
    title: "Pending Approval",
    description: "Your application is under consideration for final approval.",
    icon: <FaInfoCircle className="text-primary" />,
  },
  {
    title: "Disapproved",
    description: "You were not selected to receive the scholarship.",
    icon: <FaTimesCircle className="text-danger" />,
  },
  {
    title: "Approved",
    description: "Congratulations! You’ve been awarded the scholarship.",
    icon: <FaCheckCircle className="text-success" />,
  },
];

const ApplicationStatusInfoCard = () => {
  return (
    <Card className="p-4 shadow-sm">
      <h4 className="mb-3 text-center fw-bold">
        Understanding Your Application Status
      </h4>
      <Row className="g-4">
        {statusInfo.map((status, idx) => (
          <Col key={idx} md={6} lg={4}>
            <Card className="h-100 p-3 border-light shadow-sm status-card">
              <div className="d-flex align-items-center mb-2">
                <div className="me-2 fs-4">{status.icon}</div>
                <h6 className="mb-0 fw-semibold">{status.title}</h6>
              </div>
              <p className="mb-0 text-muted">{status.description}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default ApplicationStatusInfoCard;
