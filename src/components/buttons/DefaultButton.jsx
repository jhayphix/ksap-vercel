const DefaultButton = ({
  btnName = "Button",
  style = { border: "1px solid var(--success_color)" },
  className = "text_success bg_success_light",
}) => {
  return (
    <div
      className={`${className} py-2 px-3 rounded cursor_pointer hover_opacity_5`}
      style={style}
      role="button"
    >
      {btnName}
    </div>
  );
};

export default DefaultButton;
