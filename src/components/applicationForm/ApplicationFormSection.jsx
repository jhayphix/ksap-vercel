const ApplicationFormSection = ({ section = {}, className }) => {
  return (
    <div
      className={`${className} px-3 py-3 rounded-top bg_light`}
      style={{ borderTop: "10px solid var(--secondary_color)" }}
    >
      <h4 className="h4 m-0 mb-3">{section?.sectionTitle}</h4>
      <p className="mb-2">{section?.sectionDescription}</p>
      <hr />
      <p className="fw-semibold text_danger">* Indicates required question</p>
    </div>
  );
};

export default ApplicationFormSection;
