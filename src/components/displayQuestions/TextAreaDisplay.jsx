const TextAreaDisplay = ({ response = {}, className }) => {
  return (
    <div className={`${className}`}>
      <p className="text mb-2 text-muted" style={{ fontWeight: "600" }}>
        {response?.label}
      </p>
      <p
        className="text bg_light_2 p-2 rounded-end border-start border-dark border-3"
        style={{ fontWeight: "600" }}
      >
        {response?.response}
      </p>
    </div>
  );
};

export default TextAreaDisplay;
