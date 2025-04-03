import BrandName from "@components/typography/BrandName";
import NavList from "@layouts/NavList";

const MinimalSideNavbar = ({
  className,
  showMinimalNavbar,
  topNavbarHeight,
}) => {
  return (
    <div className={`${className} bg_primary`} style={{ height: "100%" }}>
      <div
        className="d-flex align-items-center justify-content-center bg_secondary text_light"
        style={{ height: topNavbarHeight }}
      >
        <BrandName showName={false} />
      </div>
      <NavList showMinimalNavbar={showMinimalNavbar} />
    </div>
  );
};

export default MinimalSideNavbar;
