import MoveQuestionModal from "@components/dynamicForm/MoveQuestionModal";
import DropdownWrapper from "@components/dropdown/DropdownWrapper";

const DynamicFormQuestion = ({
  sectionIndex,
  section,
  question,
  questionIndex,
  updateField,
  addQuestion,
  moveQuestion,
  showRemoveQuestionModal,
  fieldTypes,
  fieldTypesMap,
  handleAddOption,
  handleRemoveOption,
  optionFieldTypes = [],
}) => {
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
                  question?.label
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
          value={question?.label || ""}
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
          value={question?.description || ""}
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

      <div className="d-flex align-items-center mt-4">
        <div className="">
          <label className="form-label">Question Type</label>
          <select
            className="form-select"
            value={question?.type || "text"}
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
        <div className="d-flex align-items-center mx-5">
          <input
            type="checkbox"
            checked={question?.required || false}
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
          <label className="show_label ms-2">Required</label>
        </div>

        <div className="d-flex align-items-center">
          <input
            type="checkbox"
            checked={question?.validation || false}
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
          <label className="ms-2 show_label">Validation</label>
        </div>
      </div>
      {question?.validation && (
        <div className="mt-2 row gy-3 d-flex align-items-center ">
          <div className="col-4 ">
            <label className="form-label">Comparison Operator</label>
            <select
              className="form-select"
              value={question?.regex?.comparismOperator || "none"}
              onChange={(e) =>
                updateField(
                  sectionIndex,
                  questionIndex,
                  "regex",
                  {
                    ...question?.regex,
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
              value={question?.regex?.pattern || ""}
              onChange={(e) =>
                updateField(
                  sectionIndex,
                  questionIndex,
                  "regex",
                  {
                    ...question?.regex,
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
              value={question?.regex?.errorMessage || ""}
              onChange={(e) =>
                updateField(
                  sectionIndex,
                  questionIndex,
                  "regex",
                  {
                    ...question?.regex,
                    errorMessage: e.target.value,
                  },
                  question
                )
              }
            />
          </div>
        </div>
      )}
      {/* Options Input Field (Only for Checkbox, Radio, and Select) */}
      {optionFieldTypes?.includes(question?.type) && (
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
            {question?.options?.map((option, optionIndex) => (
              <li
                key={optionIndex}
                className="d-flex justify-content-between mb-2 border-bottom border-muted"
              >
                {option}
                <button
                  type="button"
                  className="btn btn-sm text_danger fw-bold"
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
