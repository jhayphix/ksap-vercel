import { useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import { ConfigContext } from "@contexts/ConfigContextProvider";
import DynamicFormSection from "@components/dynamicForm/DynamicFormSection";
import DynamicFormQuestion from "@components/dynamicForm/DynamicFormQuestion";

const fieldTypes = [
  "text",
  "textarea",

  "select",
  "checkbox",
  "radio",

  "number",
  "date",
  "time",
  "datetime-local",
  "file",
  // "email",
  // "password",
];

const fieldTypesMap = {
  text: "Short Answer",
  textarea: "Paragraph",
  number: "Number",
  date: "Date",
  time: "Time",
  "datetime-local": "Date and Time",
  select: "Dropdown",
  checkbox: "Checkboxes",
  radio: "Multiple Choice",
  file: "File upload",
  // email: "Email",
  // password: "Password",
};
const optionFieldTypes = ["checkbox", "radio", "select"]; // Fields that need options

const DynamicFormBuilder = ({ className, setFields, applicationSections }) => {
  // ::::::::::::::::::::: CONTEXTS

  const { setShowModal, setShowFlashMessage } = useContext(ConfigContext);

  useEffect(() => {
    setFields(applicationSections);

    // eslint-disable-next-line
  }, [applicationSections]);

  // ::::::::::::::::::::: CRUD SECTION

  const addSection = (sectionIndex = null) => {
    if (sectionIndex !== null) {
      // Shift existing sections if sectionIndex is provided
      const updatedFields = applicationSections?.map((field) =>
        field.sectionOrder >= sectionIndex
          ? { ...field, sectionOrder: field?.sectionOrder + 1 }
          : field
      );

      // Insert the new section at the specified index
      const newSection = {
        id: uuidv4(), // Fix : Change id
        sectionTitle: "Untitled Section",
        sectionDescription: "",
        sectionOrder: sectionIndex,
        sectionQuestions: [],
      };

      setFields(
        [...updatedFields, newSection].sort(
          (a, b) => a.sectionOrder - b.sectionOrder
        )
      );
    } else {
      // Default behavior: Append to the end

      setFields([
        ...(applicationSections || []), // Ensure it's an array
        {
          id: uuidv4(),
          sectionTitle: "Untitled Section",
          sectionDescription: "",
          sectionOrder: (applicationSections?.length || 0) + 1, // Handle undefined case
          sectionQuestions: [],
        },
      ]);
    }
  };

  const duplicateSection = (sectionIndex) => {
    const sectionToCopy = applicationSections[sectionIndex];
    const newSection = {
      ...JSON.parse(JSON.stringify(sectionToCopy)),
      id: uuidv4(),
      sectionOrder: sectionToCopy.sectionOrder + 1,
      sectionQuestions: sectionToCopy.sectionQuestions.map((q) => ({
        ...q,
        id: uuidv4(), // Generate new ID for each question
      })),
    };

    const updatedSections = [...applicationSections];

    // Increment sectionOrder of the following sections
    for (let i = sectionIndex + 1; i < updatedSections.length; i++) {
      updatedSections[i].sectionOrder += 1;
    }

    updatedSections.splice(sectionIndex + 1, 0, newSection);
    setFields(updatedSections);
  };

  const removeSection = (sectionIndex) => {
    setShowModal({ isActive: false });
    const newSections = [...applicationSections];
    newSections.splice(sectionIndex, 1);
    setFields(newSections);
    setShowFlashMessage({
      isActive: true,
      message: "Section removed successfully!",
      type: "success",
    });
  };

  const showRemoveSectionModal = (sectionIndex, sectionTitle) => {
    setShowModal({
      isActive: true,
      title: "Remove Section",
      message: `This will delete this Section ${
        sectionIndex + 1
      } "${sectionTitle}"`,
      action: () => {
        removeSection(sectionIndex);
      },
    });
  };

  // Move section up/down
  const moveSection = (index, direction) => {
    const newSections = [...applicationSections];
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < newSections?.length) {
      [newSections[index], newSections[newIndex]] = [
        newSections[newIndex],
        newSections[index],
      ];
      setFields(newSections);
    }
  };

  // ::::::::::::::::::::: MOVE QUESTION

  const updateField = (sectionIndex, questionIndex, key, value, question) => {
    const newSections = [...applicationSections];

    if (key === "type" && !optionFieldTypes?.includes(value)) {
      question.options = []; // Reset options when changing to non-option applicationSections
    }

    if (questionIndex === null) {
      newSections[sectionIndex][key] = value;
    } else if (newSections[sectionIndex]?.sectionQuestions?.[questionIndex]) {
      newSections[sectionIndex].sectionQuestions[questionIndex][key] = value;
    }

    setFields(newSections);
  };

  // ::::::::::::::::::::: CRUD QUESTIONS

  const addQuestion = (sectionIndex, questionIndex = null) => {
    const newSections = [...applicationSections];
    const sectionQuestions = newSections[sectionIndex].sectionQuestions;

    // Assign a fixed ID based on total questions length
    // const newQuestionId = `question${sectionQuestions.length + 1}`;

    if (questionIndex !== null) {
      // Shift existing questions' order forward
      const updatedQuestions = sectionQuestions.map((q) =>
        q.order >= questionIndex ? { ...q, order: q.order + 1 } : q
      );

      // Insert new question at the specified order
      const newQuestion = {
        // id: newQuestionId, // Fix : ID remains fixed
        id: uuidv4(), // Fix : Change id
        order: questionIndex, // Order is based on parameter
        label: "Untitled Question",
        description: "",
        type: "text",
        required: false,
        validation: false,
        regex: { pattern: "", errorMessage: "", comparismOperator: "none" },
        fileUploadConfig: {},
        options: [],
      };

        // If the question type is 'file', initialize fileUploadConfig
  if (newQuestion.type === "file") {
    newQuestion.fileUploadConfig = {
      restrictFileTypes: false,
      allowedFileTypes: [],
      maxFileSize: ""
    };
  }

      // Sort the updated list
      newSections[sectionIndex].sectionQuestions = [
        ...updatedQuestions,
        newQuestion,
      ].sort((a, b) => a.order - b.order);
    } else {
      // Default behavior: Append to the end
      newSections[sectionIndex].sectionQuestions.push({
        // id: newQuestionId,
        id: uuidv4(), // Fix : Change id
        order: sectionQuestions.length + 1, // Default order is length + 1
        label: "Untitled Question",
        description: "",
        type: "text",
        required: false,
        validation: false,
        regex: { pattern: "", errorMessage: "", comparismOperator: "none" },
        fileUploadConfig: {},
        options: [],
      });
    }

    setFields(newSections);
  };

  const duplicateQuestion = (sectionIndex, questionIndex) => {
    const newSections = [...applicationSections];
    const originalQuestion =
      newSections[sectionIndex].sectionQuestions[questionIndex];
    const duplicatedQuestion = {
      ...JSON.parse(JSON.stringify(originalQuestion)),
      id: uuidv4(),
      order: originalQuestion.order + 1,
    };

    // Increment order of subsequent questions
    newSections[sectionIndex].sectionQuestions = newSections[
      sectionIndex
    ].sectionQuestions.map((q, i) => {
      if (i > questionIndex) return { ...q, order: q.order + 1 };
      return q;
    });

    newSections[sectionIndex].sectionQuestions.splice(
      questionIndex + 1,
      0,
      duplicatedQuestion
    );
    setFields(newSections);
  };

  const removeQuestion = (sectionIndex, questionIndex) => {
    setShowModal({ isActive: false });
    const newSections = [...applicationSections];
    newSections[sectionIndex]?.sectionQuestions?.splice(questionIndex, 1);
    setFields(newSections);
    setShowFlashMessage({
      isActive: true,
      message: "Question removed successfully!",
      type: "success",
    });
  };

  const showRemoveQuestionModal = (
    sectionIndex,
    questionIndex,
    questionName
  ) => {
    setShowModal({
      isActive: true,
      title: "Remove Question",
      message: `This will delete this Question "${questionName}"`,
      action: () => {
        removeQuestion(sectionIndex, questionIndex);
      },
    });
  };

  // ::::::::::::::::::::: CRUD OPTIONS

  const handleAddOption = (sectionIndex, questionIndex, event) => {
    if (event.key === "Enter" && event.target.value.trim()) {
      event.preventDefault();
      const newSections = [...applicationSections];
      newSections[sectionIndex].sectionQuestions[questionIndex].options.push(
        event.target.value.trim()
      );
      setFields(newSections);
      event.target.value = ""; // Clear input
    }
  };

  const handleRemoveOption = (sectionIndex, questionIndex, optionIndex) => {
    const newSections = [...applicationSections];
    newSections[sectionIndex].sectionQuestions[questionIndex].options.splice(
      optionIndex,
      1
    );
    setFields(newSections);
  };

  const moveQuestion = (sectionIndex, questionIndex, direction) => {
    const newSections = [...applicationSections];
    const newIndex = questionIndex + direction;
    if (
      newIndex >= 0 &&
      newIndex < newSections[sectionIndex].sectionQuestions.length
    ) {
      const questions = newSections[sectionIndex].sectionQuestions;
      [questions[questionIndex], questions[newIndex]] = [
        questions[newIndex],
        questions[questionIndex],
      ];
      setFields(newSections);
    }
  };

  // ::::::::::::::::::::: RETURN

  return (
    <div id="dynamicFormBuilder" className={`${className} has_dropdown_light`}>
      {applicationSections?.map((section, sectionIndex) => (
        <div key={sectionIndex} className="mb-5 pb-3 rounded">
          <DynamicFormSection
            section={section}
            sectionIndex={sectionIndex}
            applicationSections={applicationSections}
            addSection={addSection}
            duplicateSection={duplicateSection}
            moveSection={moveSection}
            showRemoveSectionModal={showRemoveSectionModal}
            updateField={updateField}
            addQuestion={addQuestion}
          />
          {/* Questions */}
          {section?.sectionQuestions?.map((question, questionIndex) => (
            <div
              id="dynamicFormQuestionContainer"
              key={questionIndex}
              className="rounded p-3 mt-3 bg_light"
            >
              <DynamicFormQuestion
                sectionIndex={sectionIndex}
                section={section}
                question={question}
                questionIndex={questionIndex}
                updateField={updateField}
                addQuestion={addQuestion}
                duplicateQuestion={duplicateQuestion}
                moveQuestion={moveQuestion}
                removeQuestion={removeQuestion}
                showRemoveQuestionModal={showRemoveQuestionModal}
                handleAddOption={handleAddOption}
                handleRemoveOption={handleRemoveOption}
                optionFieldTypes={optionFieldTypes}
                fieldTypes={fieldTypes}
                fieldTypesMap={fieldTypesMap}
              />
            </div>
          ))}

          <button
            type="button"
            className="btn btn_secondary_3  mt-3"
            onClick={() => addQuestion(sectionIndex)}
          >
            + Add Question
          </button>
        </div>
      ))}

      <div className="d-flex justify-content-between aligh-items-center">
        <button
          type="button"
          className="btn btn_secondary_2 mt-3"
          onClick={() => addSection()}
        >
          + Add Section
        </button>
      </div>
    </div>
  );
};

export default DynamicFormBuilder;
