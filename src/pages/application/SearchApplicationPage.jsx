// React Modules
import { useContext, useEffect, useState, useRef } from "react";

// Layout cand contexts
import PageTransition from "@layouts/PageTransition";
import { ConfigContext } from "@contexts/ConfigContextProvider";

import { ScholarshipContext } from "@contexts/ScholarshipContextProvider";
import { UserContext } from "@contexts/UserContextProvider";

// Components
import HeaderBanner from "@components/headers/HeaderBanner";
import MultiSearchTable from "@components/tables/MultiSearchTable";

// Assets

const SearchApplicationPage = () => {
  const { SearchApplicationPageEffect } = useContext(ConfigContext);
  const { getScholarship, scholarshipStatus, loadScholarships } =
    useContext(ScholarshipContext);
  const { loadAdmins, adminStatus } = useContext(UserContext);

  const [activeScholarship, setActiveScholarship] = useState({});

  // Load admins
  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);
  const adminsData = adminStatus?.adminsFlattened;

  // Load scholarships
  useEffect(() => {
    loadScholarships();
  }, [loadScholarships]);
  const scholarshipsData = scholarshipStatus?.scholarships;

  const scholarshipsList = scholarshipsData?.map((scholarship) => ({
    id: scholarship?.id,
    label: scholarship?.name,
  }));

  const hasSetDefault = useRef(false);
  useEffect(() => {
    if (!hasSetDefault.current && scholarshipsList?.length > 0) {
      setActiveScholarship(scholarshipsList[0]);
      hasSetDefault.current = true;
    }
  }, [scholarshipsList]);
  const scholarshipId = activeScholarship?.id;

  // Get a scholarship
  useEffect(() => {
    if (scholarshipId) {
      getScholarship(scholarshipId);
    }
  }, [getScholarship, scholarshipId]);
  const scholarshipData = scholarshipStatus?.scholarship || {};

  const scholarshipApplicationsData = scholarshipData?.applications;

  return (
    <PageTransition effect={SearchApplicationPageEffect}>
      <section>
        <HeaderBanner title={`Search & Filter Application`} className="mb-4" />

        <div className="row mb-4">
          <div className="col-lg-6 col-md-6 col-12">
            <label className="fw-semibold" style={{ fontSize: "1rem" }}>
              Scholarship Name
            </label>
            <select
              className="form-select"
              value={activeScholarship?.id}
              onChange={(e) => {
                const selectedScholarship = scholarshipsList?.find(
                  (scholarship) => scholarship?.id === e.target.value
                );
                setActiveScholarship(
                  selectedScholarship || { id: "", label: "All" }
                );
              }}
            >
              {scholarshipsList?.map((scholarship, index) => (
                <option value={scholarship.id} key={index}>
                  {scholarship.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <MultiSearchTable
          rawData={scholarshipApplicationsData}
          adminsData={adminsData}
          className="mb-4"
          canDownload={true}
          tableName={activeScholarship?.label}
        />
      </section>
    </PageTransition>
  );
};

export default SearchApplicationPage;
