// React modules

// Contexts
import NavigationContextProvider from "@contexts/NavigationContextProvider";
import ConfigContextProvider from "@contexts/ConfigContextProvider";
import UserContextProvider from "@contexts/UserContextProvider";
import AuthContextProvider from "@contexts/AuthContextProvider";
import ScholarshipContextProvider from "@contexts/ScholarshipContextProvider";
import ExternalScholarshipContextProvider from "@contexts/ExternalScholarshipContextProvider";
import ApplicationContextProvider from "@contexts/ApplicationContextProvider";
import TableDataContextProvider from "@contexts/TableDataContextProvider";

// Components

// Assets

const AppContextProvider = ({ children }) => {
  return (
    <>
      <NavigationContextProvider>
        <ConfigContextProvider>
          <AuthContextProvider>
            <UserContextProvider>
              <ScholarshipContextProvider>
                <ExternalScholarshipContextProvider>
                  <ApplicationContextProvider>
                    <TableDataContextProvider>
                      {children}
                    </TableDataContextProvider>
                  </ApplicationContextProvider>
                </ExternalScholarshipContextProvider>
              </ScholarshipContextProvider>
            </UserContextProvider>
          </AuthContextProvider>
        </ConfigContextProvider>
      </NavigationContextProvider>
    </>
  );
};

export default AppContextProvider;
