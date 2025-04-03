import BsLoadingSpinner from "@components/spinners/BsLoadingSpinner";
import LoadingSpinner1 from "@components/spinners/LoadingSpinner1";

import "@components/spinners/spinner.css";

const DefaultSpinner = ({ type }) => {
  switch (String(type)) {
    case "1":
      return <LoadingSpinner1 />;

    case "bootstrap":
      return <BsLoadingSpinner />;

    default:
      return <LoadingSpinner1 />;
  }
};

export default DefaultSpinner;
