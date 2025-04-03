import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import { useContext } from "react";
import { NavigationContext } from "@contexts/NavigationContextProvider";

const NotFoundPage = () => {
  const { homeRoute } = useContext(NavigationContext);

  return (
    <Container className="vh-100 d-flex flex-column justify-content-center align-items-center text-center">
      <Row>
        <Col>
          <h1 className="display-1 fw-bold text-danger">404</h1>
          <h2 className="fw-semibold">Oops! Page Not Found</h2>
          <p className="text-muted">
            The page you are looking for might have been removed or is
            temporarily unavailable.
          </p>
          <div className="my-4">
            <Image
              src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png"
              alt="Not Found"
              className="img-fluid"
              width="250"
            />
          </div>
          <Link to={homeRoute?.path}>
            <Button variant="primary" className="px-4 py-2">
              Go Home
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;
