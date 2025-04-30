import MoveQuestionModal from "@components/dynamicForm/MoveQuestionModal";
import DropdownWrapper from "@components/dropdown/DropdownWrapper";
import DynamicFileConfig from "./DynamicFileConfig";

const DynamicFormQuestion = ({
  sectionIndex,
  section,
  question,
  questionIndex,
  updateField,
  addQuestion,
  duplicateQuestion,
  moveQuestion,
  showRemoveQuestionModal,
  fieldTypes,
  fieldTypesMap,
  handleAddOption,
  handleRemoveOption,
  optionFieldTypes = [],
}) => {
  const questionType = question?.type;
  const questionLabel = question?.label;
  const questionDescription = question?.description;
  const questionRequired = question?.required;
  const questionValidation = question?.validation;
  const questionOptions = question?.options;
  const questionRegex = question?.regex;

  return (
    <div>
      <MoveQuestionModal
        moveQuestion={moveQuestion}
        section={section}
        sectionIndex={sectionIndex}
      />
      <div className="mt-2 row d-flex justify-content-end align-items-center">
        <div className="text-end">
          <DropdownWrapper id="dynamicFormQuestionDropdown">
            <div
              type="button"
              className="dropdown-item fw-semibold"
              onClick={() => addQuestion(sectionIndex, questionIndex + 2)}
            >
              Add Question
            </div>
            <div
              type="button"
              className="dropdown-item fw-semibold"
              onClick={() => duplicateQuestion(sectionIndex, questionIndex)}
            >
              Duplicate Question
            </div>
            <div
              type="button"
              className="dropdown-item fw-semibold"
              data-bs-toggle="modal"
              data-bs-target="#formQuestionModalId"
            >
              Move Question
            </div>
            <hr className="my-3" />
            <div
              type="button"
              className="btn dropdown-item mt-2 text_danger fw-semibold"
              onClick={() =>
                showRemoveQuestionModal(
                  sectionIndex,
                  questionIndex,
                  questionLabel
                )
              }
            >
              Delete Question
            </div>
          </DropdownWrapper>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Question</label>
        <input
          type="text"
          className="form-control"
          style={{ fontWeight: "500" }}
          placeholder="Question"
          value={questionLabel || ""}
          onChange={(e) =>
            updateField(
              sectionIndex,
              questionIndex,
              "label",
              e.target.value,
              question
            )
          }
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Question Description</label>
        <input
          type="text"
          className="form-control"
          placeholder="Question Description"
          value={questionDescription || ""}
          onChange={(e) =>
            updateField(
              sectionIndex,
              questionIndex,
              "description",
              e.target.value,
              question
            )
          }
        />
      </div>

      <div className="d-flex align-items-center justify-content-between mt-4">
        <div className="">
          <label className="form-label">Question Type</label>
          <select
            className="form-select"
            value={questionType || "text"}
            onChange={(e) =>
              updateField(
                sectionIndex,
                questionIndex,
                "type",
                e.target.value,
                question
              )
            }
          >
            {fieldTypes?.map((type, index) => (
              <option key={index} value={type}>
                {fieldTypesMap[type]}
              </option>
            ))}
          </select>
        </div>
        <div className="form-check form-switch mx-3">
          <input
            className="form-check-input"
            id="questionIsRequiredInputId"
            type="checkbox"
            checked={questionRequired || false}
            onChange={(e) =>
              updateField(
                sectionIndex,
                questionIndex,
                "required",
                e.target.checked,
                question
              )
            }
          />
          <label
            className="form-check-label show_label ms-2 cursor_pointer"
            htmlFor="questionIsRequiredInputId"
          >
            Required
          </label>
        </div>

        <div className="form-check form-switch">
          <input
            className="form-check-input"
            id="questionValidationInputId"
            type="checkbox"
            checked={questionValidation || false}
            onChange={(e) =>
              updateField(
                sectionIndex,
                questionIndex,
                "validation",
                e.target.checked,
                question
              )
            }
          />
          <label
            className="form-check-label ms-2 show_label cursor_pointer"
            htmlFor="questionValidationInputId"
          >
            Validation
          </label>
        </div>
      </div>
      {questionValidation && (
        <div className="mt-2 row gy-3 d-flex align-items-center ">
          <div className="col-4 ">
            <label className="form-label">Comparison Operator</label>
            <select
              className="form-select"
              value={questionRegex?.comparismOperator || "none"}
              onChange={(e) =>
                updateField(
                  sectionIndex,
                  questionIndex,
                  "regex",
                  {
                    ...questionRegex,
                    comparismOperator: e.target.value,
                  },
                  question
                )
              }
            >
              <option value="" disabled>
                Comparison Operator
              </option>
              <option value="matches">Matches</option>
              <option value="contains">Contains</option>
              <option value="not_match">Doesn't Match</option>
              <option value="not_contain">Doesn't Contain</option>
            </select>
          </div>

          <div className="col-8 ">
            <label className="form-label">Regex Pattern</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter regex pattern"
              value={questionRegex?.pattern || ""}
              onChange={(e) =>
                updateField(
                  sectionIndex,
                  questionIndex,
                  "regex",
                  {
                    ...questionRegex,
                    pattern: e.target.value,
                  },
                  question
                )
              }
            />
          </div>

          <div className="col-12">
            <label className="form-label">Error Message</label>
            <input
              type="text"
              className="form-control"
              placeholder="Error message"
              value={questionRegex?.errorMessage || ""}
              onChange={(e) =>
                updateField(
                  sectionIndex,
                  questionIndex,
                  "regex",
                  {
                    ...questionRegex,
                    errorMessage: e.target.value,
                  },
                  question
                )
              }
            />
          </div>
        </div>
      )}

      {/* File config */}
      <DynamicFileConfig
        question={question}
        sectionIndex={sectionIndex}
        questionIndex={questionIndex}
        updateField={updateField}
      />

      {/* Options Input Field (Only for Checkbox, Radio, and Select) */}
      {optionFieldTypes?.includes(questionType) && (
        <div className="mt-3">
          <label className="form-label">Options</label>
          <input
            type="text"
            className="form-control"
            placeholder="Type an option and press Enter"
            onKeyDown={(event) =>
              handleAddOption(sectionIndex, questionIndex, event)
            }
          />

          {/* Display Added Options */}
          <ul className="mt-4 has_scrollbar px-2" style={{ height: "10rem" }}>
            <h6 className="mb-3"> Question Options</h6>
            {questionOptions?.map((option, optionIndex) => (
              <li
                key={optionIndex}
                className="d-flex justify-content-between mb-2 border-bottom border-muted"
              >
                {option}
                <button
                  type="button"
                  className="btn  text_danger fw-bold"
                  onClick={() =>
                    handleRemoveOption(sectionIndex, questionIndex, optionIndex)
                  }
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DynamicFormQuestion;
