import { AuthContext } from "@contexts/AuthContextProvider";
import { useContext, useEffect } from "react";

const DemoNavLinks = () => {
  const { setAuthStatus, authStatus } = useContext(AuthContext);

  const demoAdminId = "btpeW9CAVR27b587y9ZJ";

  const demoApplicantId = "h6BwMdMXu5PhkVQUIBD6";

  useEffect(() => {
    if (!authStatus?.isUserLoggedIn) {
      setAuthStatus((prev) => ({
        ...prev,
        isUserAdmin: false,
        isUserApplicant: false,
      }));
    }
  }, [authStatus?.isUserLoggedIn, setAuthStatus]);
  useEffect(() => {
    if (authStatus?.isUserAdmin) {
      setAuthStatus((prev) => ({
        ...prev,
        loggedInUserId: demoAdminId,
      }));
    } else if (authStatus?.isUserApplicant) {
      setAuthStatus((prev) => ({
        ...prev,
        loggedInUserId: demoApplicantId,
      }));
    } else {
      setAuthStatus((prev) => ({
        ...prev,
        loggedInUserId: null,
      }));
    }
  }, [authStatus?.isUserAdmin, authStatus?.isUserApplicant, setAuthStatus]);

  const loginAsAdmin = (e) => {
    const state = e.target.checked;
    setAuthStatus((prev) => ({
      ...prev,
      isUserAdmin: state,
      isUserApplicant: !state,
      isUserLoggedIn: true,
    }));
  };
  const loginAsApplicant = (e) => {
    const state = e.target.checked;
    setAuthStatus((prev) => ({
      ...prev,
      isUserAdmin: !state,
      isUserApplicant: state,
      isUserLoggedIn: true,
    }));
  };

  const loginHandler = (e) => {
    const state = e.target.checked;
    if (state === true) {
      setAuthStatus((prev) => ({
        ...prev,
        isUserLoggedIn: state,
        isUserApplicant: true,
        isUserAdmin: false,
      }));
    } else {
      setAuthStatus((prev) => ({
        ...prev,
        isUserLoggedIn: false,
        isUserApplicant: false,
        isUserAdmin: false,
      }));
    }
  };
  return (
    <div>
      <div className="ms-2">
        Active User Id:{" "}
        <span className="fw-bold text_light_2">
          {authStatus?.loggedInUserId}
        </span>
      </div>
      <div
        className={`ps-3 d-flex align-items-center faded_8 gap-2 nav_link_hover py-2 ${
          authStatus?.isUserLoggedIn && "bg_secondary_3"
        }`}
      >
        <input
          name="loginView"
          id="loginView"
          type="checkbox"
          onChange={(e) => loginHandler(e)}
          checked={authStatus?.isUserLoggedIn}
          className="form-check-input border border-secondary cursor_pointer "
        />

        <label
          htmlFor="loginView"
          className="fw-bold cursor_pointer ms-2"
          style={{ fontSize: "0.92rem" }}
        >
          {authStatus?.isUserLoggedIn
            ? "You're Logged In"
            : "You're Logged Out"}
        </label>
      </div>
      <div
        className={`ps-3 d-flex align-items-center faded_8 gap-2 nav_link_hover py-2 ${
          authStatus?.isUserAdmin && "bg_secondary_3"
        }`}
      >
        <input
          name="admin_view"
          id="admin_view"
          type="checkbox"
          onChange={(e) => loginAsAdmin(e)}
          checked={authStatus?.isUserAdmin}
          className="form-check-input border border-secondary cursor_pointer "
        />

        <label
          htmlFor="admin_view"
          className="fw-bold cursor_pointer ms-2"
          style={{ fontSize: "0.92rem" }}
        >
          {authStatus?.isUserAdmin ? "Admin Active" : "Admin Offline"}
        </label>
      </div>
      <div
        className={`ps-3 d-flex align-items-center faded_8 gap-2 nav_link_hover py-2 ${
          authStatus?.isUserApplicant && "bg_secondary_3"
        }`}
      >
        <input
          name="admin_view"
          id="admin_view"
          type="checkbox"
          onChange={(e) => loginAsApplicant(e)}
          checked={authStatus?.isUserApplicant}
          className="form-check-input border border-secondary cursor_pointer "
        />

        <label
          htmlFor="admin_view"
          className="fw-bold cursor_pointer ms-2"
          style={{ fontSize: "0.92rem" }}
        >
          {authStatus?.isUserApplicant
            ? "Applicant Active"
            : "Applicant Offline"}
        </label>
      </div>
    </div>
  );
};

export default DemoNavLinks;
