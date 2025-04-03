export const findAdminById = (admins = [], adminId) => {
  if (!Array.isArray(admins) || !adminId) return null;

  const matchedAdmin =
    admins?.find(
      (admin) => admin?.id?.toLowerCase() === adminId?.toLowerCase()
    ) || null;

  if (matchedAdmin) {
    const fullName =
      matchedAdmin?.lastName +
      " " +
      matchedAdmin?.firstName +
      " " +
      matchedAdmin?.otherNames;
    const updateMatchAdmin = { fullName, ...matchedAdmin };

    return updateMatchAdmin;
  }
};
