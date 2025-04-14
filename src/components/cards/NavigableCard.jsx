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
  gradient = 1,
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
      className={`${cardStyle} text-center py-2 px-3 shadow_md cursor_pointer user_select_none`}
      onClick={() => handleClick()}
      style={{ height: "100%" }}
    >
      <CardBody>
        <div className={` mb-2`}>{icon}</div>
        <h4 className={` mb-2`}>{title}</h4>
        <p className={` mb-2`}>{body}</p>
      </CardBody>
    </Card>
  );
};

export default NavigableCard;
