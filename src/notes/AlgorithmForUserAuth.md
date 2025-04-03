# 🟢 Applicant Login Flow

## 🔑 Login Applicant

- ✅ **Set up applicant login**
- ✅ **Set authentication details:**
  - `isUserLoggedIn` → `true`
  - `authUserInfo` → **[User Authentication Data]**

## 📂 Fetch Applicant Database

- 🔍 **Check if user exists:**
  - ✅ If **found**:
    - `isUserApplicant` → `true`
    - `isUserRegistered` → `true`
    - `loggedInUserId` → **[Applicant ID]**
  - ❌ If **not found**:
    - `isUserRegistered` → `false`
    - 🔀 **Redirect to:** `RegisterApplicantPage`

## 📝 Post-Registration Steps

- ✅ **After successful registration:**
  - `isUserApplicant` → `true`
  - `isUserRegistered` → `true`
  - `loggedInUserId` → **[Applicant ID]**
  - `authInfo` → **[Applicant Google Info]**
  - 🔀 **Redirect to:** `Applicant Dashboard`

# 🟠 Admin Login Flow

## 🔑 Login Admin

- ✅ **Set up admin login**
- ✅ **Set authentication details:**
  - `isUserLoggedIn` → `true`
  - `authUserInfo` → **[Admin Authentication Data]**

## 📂 Fetch Admin Database

- 🔍 **Check if admin exists:**
  - ✅ If **found**:
    - `isUserAdmin` → `true`
    - `loggedInUserId` → **[Admin ID]**
    - `isUserSuperAdmin` → **[Set from Admin Data]**
    - `isUserApprovalManager` → **[Set from Admin Data]**
    - `isUserReviewManager` → **[Set from Admin Data]**
  - ❌ If **not found**:
    - 🚫 **Log user out**
    - 🔀 **Redirect to:** `AuthSelectionPage`
    - ⚠️ **Flash Message:**
      > "You are not an admin. Please choose the correct authentication option and try again."
