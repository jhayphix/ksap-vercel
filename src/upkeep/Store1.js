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

    const applicationTableData = filteredData?.map((application) => ({
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
      "approved by": getAdminReturn(adminsData, application?.approvedByAdminId)
        ?.fullName,
      "review status": application?.reviewStatus,
      "reviewed by": getAdminReturn(adminsData, application?.reviewedByAdminId)
        ?.fullName,
      "application score": application?.applicationScore,
      "reviewed academic score": application?.reviewedAcademicScore,

      "review comment": application?.reviewComment,
      "approval comment": application?.approvalComment,

      "reviewed at": getFormatDateTime(application?.reviewedAt),
      "approved at": getFormatDateTime(application?.approvedAt),
      "updated at": getFormatDateTime(application?.updatedAt),

      "date of birth": HELPER?.getDDMMYYYY(application?.applicant?.dateOfBirth),
      "duration of programme": application?.applicant?.durationOfProgramme,
      "mode of admission": application?.applicant?.modeOfAdmission,
      email: application?.applicant?.email,
      nationality: application?.applicant?.nationality,
      "Student's Telecel Number": application?.applicant?.telecelNumber,
      "phone number": application?.applicant?.phoneNumber,
      faculty: application?.applicant?.faculty,
      department: application?.applicant?.department,
      role: application?.applicant?.role,

      "user registed at": getFormatDateTime(application?.applicant?.createdAt),
      "user updated at": getFormatDateTime(application?.applicant?.updatedAt),
      "Account status": application?.applicant?.accountStatus,
      "Account Deactivated At": getFormatDateTime(
        application?.applicant?.deactivatedAt
      ),
      "Account Deactivated By": getAdminReturn(
        adminsData,
        application?.applicant?.deactivatedByAdminId
      )?.fullName,
    }));

    return applicationTableData;
  },
  [getAdminReturn, getFormatDateTime]
); // ✅ Memoized
