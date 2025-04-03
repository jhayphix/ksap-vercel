const HeaderBanner = ({ title = "Title", subTitle = "", className }) => {
  return (
    <div className={`${className} row centering`}>
      <div className="col-lg-7 col-md-10 col-sm-10 col-11 bg_secondary_2 text-center p-3 text_light fw-bold rounded">
        <p className="h5">{title}</p>
        {subTitle?.length > 0 ? (
          <p className="text faded_7">{subTitle}</p>
        ) : null}
      </div>
    </div>
  );
};

export default HeaderBanner;
