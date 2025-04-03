import SpinnerWrapper from "@components/spinners/SpinnerWrapper";

const BsLoadingSpinner = () => {
  return (
    <SpinnerWrapper>
      <div className="spinner-border text_secondary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </SpinnerWrapper>
  );
};

export default BsLoadingSpinner;
