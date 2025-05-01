Yes
Now work on the submit/create application so it will be able to append the file where it's supposed to me. Make it work and have now issues. Also make it dynamic so it does not repeat itself or so it does not cause any future issues.


Now this is for the creating of the application 

const submitCreateApplication = async () => {
    const completedSections = applicationSections
      .filter((section) => thisFormError[section.id]?.isValid)
      .map((section) => section.id);

    const progress = {
      lastCompletedSection:
        completedSections[completedSections?.length - 1] || null,
      lastCompletedSectionIndex: completedSections?.length - 1,
      completedSections,
      percentage: (completedSections.length / totalApplicationSections) * 100,
      isCompleted: completedSections.length === totalApplicationSections,
    };

    const dataToSave = {
      externalId: uuidv4(),
      applicantId: loggedInApplicantId,
      reviewedByAdminId: null,
      approvedByAdminId: null,
      scholarshipId: scholarshipData?.id,
      isApproved: false,
      isPendingApproval: false,
      isDisapproved: false,
      isProcessed: false,
      isQualified: false,
      isPendingReview: false,
      isDisqualified: false,
      isReviewed: false,
      reviewComment: null,
      applicationScore: null,
      reviewedAcademicScore: null,
      applicationStatus: "Awaiting Review",
      reviewStatus: "Awaiting Review",
      approvalStatus: "Awaiting Approval",
      approvalComment: null,
      reviewedAt: null,
      approvedAt: null,
      appliedAt: HELPER?.getISODate(new Date()),
      updatedAt: HELPER?.getISODate(new Date()),
      progress,
      responseSections: applicationSections.map((section) => ({
        id: uuidv4(),
        sectionId: section.id,
        sectionTitle: section.sectionTitle,
        responses: section.sectionQuestions
          .map((question) => applicationFormData[question?.id])
          .filter(Boolean),
      })),
    };

    setLoading(true); // Start loading

    try {
      const existingApplication = await getExistingApplication(
        loggedInApplicantId,
        scholarshipId
      );

      let response;

      if (
        existingApplication &&
        !Array.isArray(existingApplication) &&
        existingApplication.id
      ) {
        response = await putRequest(
          APPLICATIONS_API_REF,
          existingApplication.id,
          dataToSave,
          DATABASE_TABLE_NAMES?.APPLICATIONS_TABLE_NAME
        );
      } else if (
        !existingApplication ||
        (Array.isArray(existingApplication) && existingApplication.length === 0)
      ) {
        response = await postRequest(APPLICATIONS_API_REF, dataToSave);
      }

      if (response) {
        setShowFlashMessage({
          isActive: true,
          message: "Application saved successfully!",
          type: "success",
        });

        if (isOnLastSection) {
          setApplicationFormData([]);
          setThisFormError([]);
          setSearchParams({ section: 0 });
          setFinalSubmit(true);
        }
      } else {
        setFinalSubmit(false);
        setShowFlashMessage({
          isActive: true,
          message: "Failed to save scholarship application. Please try again.",
          type: "danger",
        });
      }
    } catch (error) {
      setFinalSubmit(false);
      setShowFlashMessage({
        isActive: true,
        message: `Error saving application. Please try again.`,
        type: "danger",
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };