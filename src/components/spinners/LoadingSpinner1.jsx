import SpinnerWrapper from "@components/spinners/SpinnerWrapper";

const LoadingSpinner1 = () => {
  return (
    <SpinnerWrapper>
      <div id="loadingSpinnerContainer" className="">
        <div className="loadingSpinnerBar">
          {[...Array(12)]?.map((_, index) => (
            <div key={index} className="" />
          ))}
        </div>
      </div>
    </SpinnerWrapper>
  );
};

export default LoadingSpinner1;
