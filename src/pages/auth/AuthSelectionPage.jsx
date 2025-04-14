// React Modules
import { useContext } from "react";
import { MdAdminPanelSettings } from "react-icons/md"; // Admin icon
import { FaUserCheck } from "react-icons/fa"; // Applicant icon

// Layout cand contexts
import PageTransition from "@layouts/PageTransition";
import { ConfigContext } from "@contexts/ConfigContextProvider";
import { AuthContext } from "@contexts/AuthContextProvider";

// Components
import NavigableCard from "@components/cards/NavigableCard";
import HeaderBanner from "@components/headers/HeaderBanner";
import BackButton from "@components/buttons/BackButton";

// Assets

const AuthSelectionPage = () => {
  const { authSelectionPageEffect } = useContext(ConfigContext);
  const {
    authenticateWithGoogle,
    setIsLoggingInAsAdmin,
    setIsLoggingInAsApplicant,
  } = useContext(AuthContext);

  const iconSize = 50;
  const cardObj = [
    {
      key: "adminLogin",
      title: "Admin Login",
      body: "Access the admin dashboard and manage applications",
      hasPath: false, // if false it wont naviate
      path: "/",
      cardStyle: "bg_secondary hover_bg_secondary_3",
      transitionEffect: "left",
      icon: <MdAdminPanelSettings size={iconSize} />,
      onClick: async () => {
        setIsLoggingInAsAdmin(true);
        await authenticateWithGoogle();
      },
    },
    {
      key: "applicantLogin",
      title: "Applicant Login",
      body: "Apply and track your application progress.",
      hasPath: false,
      path: "/",
      cardStyle: "bg_secondary_2 hover_bg_secondary_3",
      transitionEffect: "right",
      icon: <FaUserCheck size={iconSize} />,
      onClick: async () => {
        setIsLoggingInAsApplicant(true);
        await authenticateWithGoogle();
      },
    },
  ];

  return (
    <PageTransition effect={authSelectionPageEffect}>
      <section>
        <BackButton className="mb-3" />
        <HeaderBanner
          title={`Login Portal`}
          subTitle={
            "Select a Login Option to continue. A Google account is required."
          }
          className="mb-5"
        />
      </section>

      <div className="row gx-4 mb-5 d-flex align-items-stretch justify-content-center ">
        {cardObj?.map(
          (
            {
              title,
              body,
              path,
              cardStyle,
              transitionEffect,
              hasPath,
              icon,
              onClick,
            },
            cardIndex
          ) => (
            <PageTransition
              effect={transitionEffect}
              key={cardIndex}
              className="col-md-5 col-sm-9 col-11 mb-md-0 mb-4"
            >
              <NavigableCard
                title={title}
                body={body}
                path={path}
                hasPath={hasPath}
                cardStyle={`${cardStyle}`}
                icon={icon}
                gradient={cardIndex + 1}
                onClick={onClick}
              />
            </PageTransition>
          )
        )}
      </div>
    </PageTransition>
  );
};

export default AuthSelectionPage;
