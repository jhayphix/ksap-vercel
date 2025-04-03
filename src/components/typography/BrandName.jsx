import { useContext } from "react";
import { Link } from "react-router-dom";
import { NavigationContext } from "@contexts/NavigationContextProvider";
import { FaAward } from "react-icons/fa";

const BrandName = ({ showName = true }) => {
  const { homeRoute } = useContext(NavigationContext);
  return (
    <Link
      to={homeRoute?.path}
      id="brand_name"
      className="cursor_pointer d-flex align-items-center"
    >
      {" "}
      <FaAward size={24} className="bs_text_warning me-1" />{" "}
      <span style={{ fontSize: "0.82rem" }}>
        {showName && "KNUST SCHOLARSHIP PORTAL"}
      </span>
    </Link>
  );
};

export default BrandName;
