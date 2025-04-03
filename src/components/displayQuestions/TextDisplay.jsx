const TextDisplay = ({ response = {}, className, hasEffect = false }) => {
  const borderEffect =
    hasEffect === true
      ? "bg_light_2 p-2 rounded-end border-start border-dark border-3"
      : "";
  return (
    <div className={`${className}`}>
      <p className="text mb-1 text-muted" style={{ fontWeight: "600" }}>
        {response?.label}
      </p>
      <p className={`text ${borderEffect}`} style={{ fontWeight: "700" }}>
        {response?.response}
      </p>
    </div>
  );
};

export default TextDisplay;
