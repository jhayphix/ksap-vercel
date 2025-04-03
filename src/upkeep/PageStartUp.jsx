// React Modules
import { useContext } from "react";

// Layout cand contexts
import PageTransition from "@layouts/PageTransition";
import { ConfigContext } from "@contexts/ConfigContextProvider";

// Components
import HeaderBanner from "@components/headers/HeaderBanner";
import BackButton from "@components/buttons/BackButton";

// Assets

const MyApplicationsPage = () => {
  // Page Base Variables
  // Contexts
  const { myApplicationsPageEffect } = useContext(ConfigContext);

  return (
    <PageTransition effect={myApplicationsPageEffect}>
      <section>
        <BackButton className="mb-3" />
        <HeaderBanner title={`My Applications`} className="mb-3" />
      </section>
    </PageTransition>
  );
};

export default MyApplicationsPage;
