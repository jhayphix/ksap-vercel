const MoveSectionModal = ({ applicationSections = [], moveSection }) => {
  return (
    <div>
      {/* <!-- Modal Body -->
      <!-- if you want to close by clicking outside the modal, delete the last endpoint:data-bs-backdrop and data-bs-keyboard --> */}
      <div
        className="modal fade"
        id="formSectionModalId"
        tabIndex="-1"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        role="dialog"
        aria-labelledby="modalTitleId"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-scrollable modal-dialog-top modal-md"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5
                className="modal-title"
                id="modalTitleId"
                style={{ fontSize: "0.92rem" }}
              >
                Reorder Sections
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body p-0">
              {applicationSections?.map((section, sectionIndex) => {
                return (
                  <div key={sectionIndex} className="">
                    <div className=" px-3 py-3 d-flex align-items-center justify-content-between">
                      <div className="">
                        <h6
                          className="mb-1"
                          style={{ fontSize: "1rem", fontWeight: "700" }}
                        >
                          {section?.sectionTitle}
                        </h6>
                        <p style={{ fontSize: "0.8rem" }}>
                          Section {sectionIndex + 1} of{" "}
                          {applicationSections?.length}
                        </p>
                      </div>
                      <div className="">
                        <button
                          type="button"
                          className="btn  btn-secondary me-3"
                          onClick={() => moveSection(sectionIndex, -1)}
                          disabled={sectionIndex === 0}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          className="btn  btn-secondary"
                          onClick={() => moveSection(sectionIndex, 1)}
                          disabled={
                            sectionIndex === applicationSections.length - 1
                          }
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                    <hr className="m-0 p-0" />
                  </div>
                );
              })}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Okay
              </button>
              {/* <button type="button" className="btn btn-primary">
                Save
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoveSectionModal;
