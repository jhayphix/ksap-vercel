const FormContainerWrapper = ({ children, className }) => {
  return (
    <div className={`${className} bg_primary_2 rounded p-2`}>{children}</div>
  );
};

export default FormContainerWrapper;
