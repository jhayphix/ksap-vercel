import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const DefaultNavTab = ({
  tabMappings = { "Default Tab": "default" }, // Example format
  queryParamKey = "tab",
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabSearchParam =
    searchParams.get(queryParamKey) || Object.values(tabMappings)[0];
  const [activeTab, setActiveTab] = useState(tabSearchParam);

  useEffect(() => {
    setSearchParams({ [queryParamKey]: tabSearchParam?.toLowerCase() });
    setActiveTab(tabSearchParam);
  }, [tabSearchParam, setSearchParams, queryParamKey]);

  const handleTabClick = (tabKey) => {
    setActiveTab(tabKey);
    setSearchParams({ [queryParamKey]: tabKey?.toLowerCase() });
  };

  return (
    <ul id="navTabId" className="nav nav-tabs user_select_none">
      {Object.entries(tabMappings)?.map(
        ([displayName, queryParamKey], index) => (
          <li className="nav-item" key={index}>
            <p
              className={`nav-link cursor_pointer ${
                activeTab?.toLowerCase() === queryParamKey?.toLowerCase()
                  ? "active"
                  : "passive"
              }`}
              onClick={() => handleTabClick(queryParamKey)}
            >
              {displayName}
            </p>
          </li>
        )
      )}
    </ul>
  );
};

export default DefaultNavTab;
