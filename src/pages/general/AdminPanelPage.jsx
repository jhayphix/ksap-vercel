import HeaderBanner from "@components/headers/HeaderBanner";
import AdminScholarshipDetailCard from "@components/cards/AdminScholarshipDetailCard";
import { ScholarshipContext } from "@contexts/ScholarshipContextProvider";
import { useContext, useEffect } from "react";
import PageTransition from "@layouts/PageTransition";
import { ConfigContext } from "@contexts/ConfigContextProvider";

const AdminPanelPage = () => {
  const { adminPanelPageEffect } = useContext(ConfigContext);
  const { loadScholarships, scholarshipStatus } =
    useContext(ScholarshipContext);

  useEffect(() => {
    loadScholarships();
  }, [loadScholarships]);

  const scholarshipsData = scholarshipStatus?.scholarships;

  const bgColors = [
    "#007bff",
    "#fd7e14",
    "#28a745",
    "#6f42c1",
    "#17a2b8",
    "#ffc107",
    "#dc3545",
  ];
  const assignedColors = {}; // Store assigned colors for each scholarship

  let colorIndex = 0;

  return (
    <PageTransition effect={adminPanelPageEffect}>
      <HeaderBanner title="Admin Panel" />

      <div className="my-4">
        <div className="row row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1">
          {scholarshipsData?.map((scholarship) => {
            if (!assignedColors[scholarship.id]) {
              assignedColors[scholarship.id] = bgColors[colorIndex];
              colorIndex = (colorIndex + 1) % bgColors.length;
            }
            return (
              <div className="col mb-4" key={scholarship.id}>
                <AdminScholarshipDetailCard
                  scholarship={scholarship}
                  // key={scholarship.id}
                  className=""
                  bgColor={assignedColors[scholarship.id]}
                />
              </div>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminPanelPage;
