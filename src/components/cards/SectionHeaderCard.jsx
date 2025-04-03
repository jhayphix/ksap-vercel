const SectionHeaderCard = ({ title = "Section Header", subTitle = "" }) => {
  return (
    <div className="rounded-top bg_primary_3">
      <p
        className="m-0 px-3 py-2 rounded-top bg_secondary d-inline-block"
        style={{ fontWeight: "500" }}
      >
        {title}
        {subTitle?.length > 0 ? (
          <span
            className="text_light d-block"
            style={{ fontSize: "0.9rem", opacity: "0.7" }}
          >
            {subTitle}
          </span>
        ) : null}
      </p>
    </div>
  );
};

export default SectionHeaderCard;
