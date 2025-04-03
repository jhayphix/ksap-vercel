const DefaultStatusTag = ({
  style,
  text = "Tag",
  className,
  color = "success",
}) => {
  return (
    <span
      className={`${className} px-2 py-0 d-inline-block rounded bg_${color}_light text_${color}`}
      style={{
        ...style,
        fontSize: "0.78rem",
        fontWeight: "500",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
};

export default DefaultStatusTag;
