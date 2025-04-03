import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="mt-5 text-muted bg_primary py-3 ps-3 w-100 user_select_none">
      {currentYear === 2025
        ? `Copyright © 2025. All rights reserve`
        : ` Copyright © 2025 - ${currentYear} . All rights reserve`}
    </div>
  );
};

export default Footer;
