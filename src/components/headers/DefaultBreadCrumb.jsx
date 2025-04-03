// React modules
import { Link } from "react-router-dom";

// Context

// Components

// Assets

//
const DefaultBreadCrumb = ({ project_category, project_name }) => {
  /*
  |----------------------------------------
  | Return
  |----------------------------------------
  */
  return (
    <>
      <nav
        style={{ "--bs-breadcrumb-divider": "none" }}
        aria-label="breadcrumb"
        className="mt-lg-2 mt-1"
      >
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/dashboard">Projects</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Form Validation
          </li>
        </ol>
      </nav>
    </>
  );
};

export default DefaultBreadCrumb;
