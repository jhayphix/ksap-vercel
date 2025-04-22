// React modules
import { createContext, useContext, useCallback } from "react";

import HELPER from "@src/helper/HELPER";
import { UserContext } from "@contexts/UserContextProvider";

// ::::::::::::::::::::: DEFINE CONTEXTS
export const TableDataContext = createContext({
  getAdminsTableData: [],
});

// ::::::::::::::::::::: PROVIDER

const TableDataContextProvider = ({ children }) => {
  const { getAdminReturn } = useContext(UserContext);

  const getFormatDateTime = useCallback((dateTime) => {
    return dateTime ? HELPER?.formatDateTime(dateTime) : "N/A";
  }, []);
  const getFormatDateMMDDYYY = useCallback((dateTime) => {
    return dateTime ? HELPER?.formatDateMMDDYYY(dateTime) : "N/A";
  }, []);

  //   Get Admins table data
  const adminsTableDefaultColumns = [
    "name",
    "gender",
    "date of birth",
    "phone number",
    "email",
    "assigned role",
  ];

  const getAdminsTableData = useCallback(
    (adminsData = []) => {
      return adminsData?.map((admin) => ({
        id: admin?.id,
        Name: admin?.fullName,
        "Assigned Role": admin?.assignedRole,
        Gender: admin?.gender,
        "Date of Birth": getFormatDateMMDDYYY(admin?.dateOfBirth),
        "Phone Number": admin?.phoneNumber,

        email: admin?.email,
        location: admin?.location,
        Nationality: admin?.nationality,

        Role: admin?.role,
        "Account Status": admin?.accountStatus,
        "Account Deactivated At": getFormatDateTime(admin?.deactivatedAt),

        "Registed By": getAdminReturn(adminsData, admin?.createdByAdminId)
          ?.fullName,
        "Registed At": getFormatDateTime(admin?.createdAt),
        "Updated By": getAdminReturn(adminsData, admin?.updatedByAdminId)
          ?.fullName,
        "Updated At": getFormatDateTime(admin?.updatedAt),
      }));
    },
    [getAdminReturn, getFormatDateTime, getFormatDateMMDDYYY]
  );

  //   Get Admins table data
  const applicantsTableDefaultColumns = [
    "name",
    "gender",
    "date of birth",
    "phone number",
    "email",
    "reference number",
    "year of study",
    "programme of study",
    "duration of programme",
  ];

  const getApplicantsTableData = useCallback(
    (applicantsData = [], adminsData = []) => {
      return applicantsData?.map((applicant) => ({
        id: applicant?.id,
        Name: applicant?.fullName,
        "Reference Number": applicant?.referenceNumber,
        "Year of study": "Year " + applicant?.yearOfStudy,
        "Index Number": applicant?.indexNumber,
        Gender: applicant?.gender,

        "Programme of Study": applicant?.programmeOfStudy,
        "Duration of Programme": applicant?.durationOfProgramme,

        "Date of Birth": getFormatDateMMDDYYY(applicant?.dateOfBirth),
        "Phone Number": applicant?.phoneNumber,
        "Student's Telecel Number": applicant?.telecelNumber,
        age: applicant?.age,

        email: applicant?.email,
        Nationality: applicant?.nationality,

        faculty: applicant?.faculty,
        department: applicant?.department,
        college: applicant?.college,

        "Level of Education": applicant?.educationalLevel,
        "Mode of Admission": applicant?.modeOfAdmission,

        "Guardian Name": applicant?.guardianName,
        "Guardian Phone Number": applicant?.guardianPhone,
        "Guardian Location": applicant?.guardianLocation,
        "Relationship with Guardian": applicant?.guardianRelationship,
        "Guardian Occupation": applicant?.guardianOccupation,

        Role: applicant?.role,
        "Account Status": applicant?.accountStatus,
        "Account Deactivated At": getFormatDateTime(applicant?.deactivatedAt),
        "Account Deactivated By": applicant?.deactivatedByAdminId
          ? getAdminReturn(adminsData, applicant?.deactivatedByAdminId)
              ?.fullName
          : "N/A",

        "Registed At": getFormatDateTime(applicant?.createdAt),
        "Updated At": getFormatDateTime(applicant?.updatedAt),
      }));
    },
    [getAdminReturn, getFormatDateTime, getFormatDateMMDDYYY]
  );

  //   Get Applications Table Data
  const applicationTableDefaultColumns = [
    "name",
    "reference number",
    "programe",
    "year of study",
    "applied at",
    "application status",
    "current application status",
  ];

  const getApplicationsTableData = useCallback(
    (
      scholarshipApplicationsData,
      adminsData = [],
      statusKey = "all",
      statusValue = true
    ) => {
      let filteredData;
      if (statusKey === "all") {
        filteredData = scholarshipApplicationsData;
      } else {
        filteredData = scholarshipApplicationsData?.filter(
          (application) => application[statusKey] === statusValue
        );
      }

      console.log("filteredData: ", filteredData);

      const applicationTableData = filteredData?.map((application) => {
        // Flatten the responses into a single object with a "QQ" indicator in the label
        const responses = application?.responseSections?.reduce(
          (acc, section) => {
            section.responses?.forEach((response) => {
              // Adding "QQ" to the label (you could change "QQ" to any other appropriate term)
              const labelWithIndicator = `QQ ${response.label}`;

              // Add the formatted label and response to the accumulator
              acc[labelWithIndicator] = Array.isArray(response.response)
                ? response.response.join(", ")
                : response.response;
            });
            return acc;
          },
          {}
        );

        // Combine the applicant and application data with the responses
        return {
          id: application?.id,
          name:
            application?.applicant?.lastName +
            " " +
            application?.applicant?.firstName +
            " " +
            application?.applicant?.otherNames,
          "reference number": application?.applicant?.referenceNumber,
          "educational level": application?.applicant?.educationalLevel,
          gender: application?.applicant?.gender,
          "year of study": application?.applicant?.yearOfStudy,

          "current application status": application?.applicationStatus,
          "programme of study": application?.applicant?.programmeOfStudy,
          "applied at": getFormatDateTime(application?.appliedAt),

          // Others
          college: application?.applicant?.college,
          age: application?.applicant?.age,
          "index number": application?.applicant?.indexNumber,

          // Others from application
          "approval status": application?.approvalStatus,
          "approved by": getAdminReturn(
            adminsData,
            application?.approvedByAdminId
          )?.fullName,
          "review status": application?.reviewStatus,
          "reviewed by": getAdminReturn(
            adminsData,
            application?.reviewedByAdminId
          )?.fullName,
          "application score": application?.applicationScore,
          "reviewed academic score": application?.reviewedAcademicScore,

          "review comment": application?.reviewComment,
          "approval comment": application?.approvalComment,

          "reviewed at": getFormatDateTime(application?.reviewedAt),
          "approved at": getFormatDateTime(application?.approvedAt),
          "updated at": getFormatDateTime(application?.updatedAt),

          "date of birth": HELPER?.getDDMMYYYY(
            application?.applicant?.dateOfBirth
          ),
          "duration of programme": application?.applicant?.durationOfProgramme,
          "mode of admission": application?.applicant?.modeOfAdmission,
          email: application?.applicant?.email,
          nationality: application?.applicant?.nationality,
          "Student's Telecel Number": application?.applicant?.telecelNumber,
          "phone number": application?.applicant?.phoneNumber,
          faculty: application?.applicant?.faculty,
          department: application?.applicant?.department,
          role: application?.applicant?.role,

          "user registed at": getFormatDateTime(
            application?.applicant?.createdAt
          ),
          "user updated at": getFormatDateTime(
            application?.applicant?.updatedAt
          ),
          "Account status": application?.applicant?.accountStatus,
          "Account Deactivated At": getFormatDateTime(
            application?.applicant?.deactivatedAt
          ),
          "Account Deactivated By": getAdminReturn(
            adminsData,
            application?.applicant?.deactivatedByAdminId
          )?.fullName,

          // Add the responses as key-value pairs (label: response)
          ...responses, // This adds all responses as individual columns in the table data
        };
      });

      return applicationTableData;
    },
    [getAdminReturn, getFormatDateTime]
  ); // ✅ Memoized

  const context = {
    getAdminsTableData,
    adminsTableDefaultColumns,

    getApplicantsTableData,
    applicantsTableDefaultColumns,

    getApplicationsTableData,
    applicationTableDefaultColumns,
  };
  return (
    <TableDataContext.Provider value={context}>
      {children}
    </TableDataContext.Provider>
  );
};

export default TableDataContextProvider;
