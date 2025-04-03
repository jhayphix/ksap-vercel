import TextDisplay from "@components/displayQuestions/TextDisplay";
import TextAreaDisplay from "@components/displayQuestions/TextAreaDisplay";
import FileDisplay from "@components/displayQuestions/FileDisplay";
import SectionHeaderCard from "@components/cards/SectionHeaderCard";

const ApplicationSectionCard = ({ applicationSection }) => {
  const applicationResponses = applicationSection?.responses;
  return (
    <div className="mb-5 bg_light rounded">
      <SectionHeaderCard title={applicationSection?.sectionTitle} />
      <div className="p-3 row g-0">
        {applicationResponses?.length ? (
          applicationResponses?.map((response, index) => {
            if (response?.type === "textarea") {
              return (
                <div key={index} className="mb-3 col-12">
                  <TextAreaDisplay response={response} />
                </div>
              );
            } else if (response?.type === "file") {
              return (
                <div key={index} className="mb-3 col-6">
                  <FileDisplay />
                </div>
              );
            } else {
              return (
                <div key={index} className="mb-3 col-6">
                  <TextDisplay response={response} />
                </div>
              );
            }
          })
        ) : (
          <div className="text_danger fw-semibold fst-italic">
            No response found for this section!
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationSectionCard;
