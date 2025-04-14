import MoveSectionModal from "@components/dynamicForm/MoveSectionModal";
import DropdownWrapper from "@components/dropdown/DropdownWrapper";

const DynamicFormSection = ({
  section,
  sectionIndex,
  applicationSections,
  moveSection,
  showRemoveSectionModal,
  updateField,
  addSection,
  duplicateSection,
  addQuestion,
}) => {
  return (
    <div>
      <MoveSectionModal
        applicationSections={applicationSections}
        moveSection={moveSection}
      />
      <div
        id="dynamicFormSectionNameContainer"
        className="bg_primary_3 rounded-top "
        style={{ borderBottom: "7px solid var(--secondary_color)" }}
      >
        <h4
          className="m-0 p-2 px-3 rounded-top bg_secondary d-inline-block"
          style={{ fontSize: "1rem" }}
        >
          Section {sectionIndex + 1} of {applicationSections?.length}
        </h4>
      </div>

      {/* Section */}
      <div
        id="dynamicFormSectionContainer"
        className="bg_light rounded px-3 pb-4 pt-3"
      >
        {/* Section Button */}
        <div className="text-end">
          <DropdownWrapper id="dynamicFormSectionDropdown128943">
            <div
              type="button"
              className="dropdown-item fw-semibold"
              onClick={() => addQuestion(sectionIndex, 1)}
            >
              Add Question
            </div>
            <div
              type="button"
              className=" dropdown-item fw-semibold"
              data-bs-toggle="modal"
              data-bs-target="#formQuestionModalId"
            >
              Reorder Questions
            </div>
            <div
              type="button"
              className="dropdown-item fw-semibold"
              onClick={() => addSection(sectionIndex + 1)}
            >
              Add Section
            </div>
            <div
              type="button"
              className="dropdown-item fw-semibold"
              onClick={() => duplicateSection(sectionIndex)}
            >
              Duplicate Section
            </div>
            <div
              type="button"
              className="dropdown-item fw-semibold"
              data-bs-toggle="modal"
              data-bs-target="#formSectionModalId"
            >
              Move Section
            </div>

            <hr className="my-3" />
            <div
              type="button"
              className="dropdown-item mt-2 text_danger fw-semibold"
              onClick={() =>
                showRemoveSectionModal(sectionIndex, section?.sectionTitle)
              }
            >
              Delete Section
            </div>
          </DropdownWrapper>
        </div>
        <div className="mb-3">
          <label className="form-label"> Section Name</label>
          <input
            type="text"
            style={{ fontSize: "1.4rem" }}
            className="m-0 form-control fw-semibold"
            placeholder="Section Name"
            value={section?.sectionTitle || ""}
            onChange={(e) =>
              updateField(sectionIndex, null, "sectionTitle", e.target.value)
            }
          />
        </div>
        <div>
          <label className="form-label mt-2">Section Description</label>
          <input
            type="text"
            className="form-control text_gray_2"
            style={{ fontWeight: 400, fontSize: "1.15rem" }}
            placeholder="Section Description"
            value={section.sectionDescription || ""}
            onChange={(e) =>
              updateField(
                sectionIndex,
                null,
                "sectionDescription",
                e.target.value
              )
            }
          />
        </div>
      </div>
    </div>
  );
};

export default DynamicFormSection;
