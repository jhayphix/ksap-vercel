import { MdErrorOutline } from "react-icons/md";

const FormFieldWrapper = ({
  children,
  className,
  label,
  description,
  isRequired = false,
  hasError = null,
  errorMessage,
}) => {
  const thereIsError = hasError === true;
  // const thereIsNoError = hasError === false;

  return (
    <div
      id="uniqueCustomForm"
      className={`${className} h-100 bg_light px-3 py-3 rounded border border-1 
        ${thereIsError ? "border-danger" : ""}`}
    >
      <label style={{ fontSize: "1rem" }}>
        {label}
        {isRequired ? <span className="text_danger ms-2">{"*"}</span> : null}
      </label>
      <p
        className="text-muted my-2"
        style={{ fontWeight: "400", fontSize: "0.91rem" }}
      >
        {description}
      </p>
      {children}

      {thereIsError ? (
        <div
          className={` ${thereIsError ? "text_danger mt-3" : ""}`}
          style={{ fontSize: "0.9rem" }}
        >
          <MdErrorOutline size={25} className="me-2" />
          {errorMessage}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default FormFieldWrapper;
