// import { useState } from "react";
import { Card, CardBody } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NavigableCard = ({
  cardStyle = "",
  title = "Card Title",
  body = "Card Description",
  hasPath = false,
  path,
  icon,
  gradient = "1",
  onClick = () => {},
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    onClick();
    if (hasPath) {
      navigate(path);
    }
  };

  return (
    <Card
      className={`${cardStyle} custom_gradient_${gradient} text-center py-2 px-3 shadow_md cursor_pointer user_select_none`}
      onClick={() => handleClick()}
      style={{ height: "100%" }}
    >
      <CardBody>
        <div className={`text-light mb-2`}>{icon}</div>
        <h4 className={`text-light mb-2`}>{title}</h4>
        <p className={`text_light_2 mb-2`}>{body}</p>
      </CardBody>
    </Card>
  );
};

export default NavigableCard;
