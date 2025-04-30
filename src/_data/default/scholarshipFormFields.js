import HELPER from "@src/helper/HELPER";

export const scholarshipFormSections = [
  // Section 1: Basic Scholarship Details
  {
    id: 1,
    sectionName: "Basic Scholarship Details",
    sectionFields: [
      {
        sectionId: 1,
        type: "text",
        key: "name",
        label: "Scholarship Name",
        isRequired: true,
        hasOptions: false,
        disabled: false,
        placeholder: "Enter scholarship name",
        regexKey: "name",
      },
      {
        sectionId: 1,
        type: "text",
        key: "shortName",
        label: "Scholarship Abbreviated Name",
        isRequired: false,
        hasOptions: false,
        disabled: false,
        placeholder: "Enter scholarship short name",
        regexKey: "name",
      },
      {
        sectionId: 1,
        type: "text",
        key: "fundingType",
        label: "Type of Funding",
        isRequired: true,
        hasOptions: false,
        disabled: false,
        placeholder: "Eg. Scholarship, Bursary",
        regexKey: "generalText",
      },
      {
        sectionId: 1,
        type: "select",
        key: "academicYear",
        label: "Academic Year",
        isRequired: true,
        hasOptions: true,
        disabled: false,
        options: HELPER?.generateAcademicYears(),
        placeholder: "Select Scholarship's Academic Year",
        regexKey: "select",
      },
    ],
  },

  // Section 2: Application & Eligibility
  {
    id: 2,
    sectionName: "Eligibility & Application",
    sectionFields: [
      {
        sectionId: 2,
        type: "datetime-local",
        key: "deadline",
        label: "Scholarship Deadline",
        isRequired: true,
        hasOptions: false,
        disabled: false,
        placeholder: "Set Deadline for Scholarship (MM/DD/YYYY)",
        regexKey: "generalText",
      },
      {
        sectionId: 2,
        type: "checkbox",
        key: "eligibilityEducationalLevel",
        label: "Eligibility - Educational Level",
        isRequired: true,
        hasOptions: true,
        options: ["Undergraduate", "Masters", "PHD"],
        disabled: false,
        placeholder: "Tick the eligibility educational level",
        regexKey: "list",
      },
      {
        sectionId: 2,
        type: "checkbox",
        key: "eligibilityYearsOfStudy",
        label: "Eligibility - Year of Study",
        isRequired: true,
        hasOptions: true,
        options: ["1", "2", "3", "4", "5", "6"],
        disabled: false,
        placeholder: "Tick the eligibility years of study",
        regexKey: "list",
      },
    ],
  },

  // Section 3: Additional Information
  {
    id: 3,
    sectionName: "Additional Information",
    sectionFields: [
      {
        sectionId: 3,
        type: "textarea",
        key: "description",
        label: "Scholarship Description",
        isRequired: true,
        hasOptions: false,
        disabled: false,
        placeholder:
          "Using WYSIWYG 'https://wysiwyghtml.com/', enter scholarship description",
        regexKey: "generalText",
      },
      {
        sectionId: 3,
        type: "textareaList",
        key: "requirements",
        label: "Requirements",
        isRequired: true,
        hasOptions: false,
        disabled: false,
        placeholder: "Type and Press Enter to add a new requirement",
        regexKey: "list",
      },
    ],
  },
];
  
