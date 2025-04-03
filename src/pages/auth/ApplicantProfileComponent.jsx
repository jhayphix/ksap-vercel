import { ConfigContext } from "@contexts/ConfigContextProvider";
import { useContext } from "react";

import ApplicantProfileHeader from "@components/cards/ApplicantProfileHeader";
import SectionHeaderCard from "@components/cards/SectionHeaderCard";
import exportDefaultData from "@data/default/exportDefaultData";
import TextDisplay from "@components/displayQuestions/TextDisplay";
import PageTransition from "@layouts/PageTransition";

const ApplicantProfileComponent = ({ applicantData }) => {
  const { HELPER } = useContext(ConfigContext);
  const applicantFormSections = exportDefaultData?.applicantFormSections;

  return (
    <div className="row centering g-0">
      <div className="col-lg-9 col-md-10 col-12">
        <PageTransition effect={"right"}>
          <ApplicantProfileHeader applicantData={applicantData} />
        </PageTransition>

        <PageTransition effect={"left"}>
          {applicantFormSections?.map((section, sectionIndex) => (
            <div effect={"right"} key={sectionIndex} className="my-5">
              {/* Section Title */}
              <SectionHeaderCard title={section?.sectionName} />

              {/* Section Fields */}
              <div className="row row-cols-lg-3 row-cols-md-2 row-cols-1 g-0 bg_primary_2 p-3 d-flex align-items-center">
                {section?.sectionFields?.map((field, fieldIndex) => {
                  let fieldValue =
                    applicantData?.[field?.key] ||
                    applicantData?.[section?.groupedKey]?.[field?.key] ||
                    "N/A";

                  // Ensure fieldValue is a string
                  const fieldValueStr = String(fieldValue);

                  // Check if the fieldValue is a valid date-time string (not just a number)
                  const isDateTime =
                    isNaN(fieldValue) && // Ensure it's not a plain number
                    !isNaN(Date.parse(fieldValueStr)); // Ensure it can be parsed as a date

                  // Check if the time part is exactly 00:00:00.000Z (only a date)
                  const isDateOnly =
                    isDateTime &&
                    (fieldValueStr.endsWith("T00:00:00.000Z") ||
                      fieldValueStr.endsWith(" 00:00:00"));

                  fieldValue = isDateOnly
                    ? HELPER?.getDDMMYYYY(fieldValueStr)
                    : isDateTime
                    ? HELPER?.formatDateTime(fieldValueStr)
                    : fieldValue;

                  const label = field?.label;

                  return (
                    <div className="col mb-4" key={fieldIndex}>
                      <TextDisplay
                        key={fieldIndex}
                        response={{ label: label, response: fieldValue }}
                        hasEffect={true}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </PageTransition>
      </div>
    </div>
  );
};

export default ApplicantProfileComponent;
