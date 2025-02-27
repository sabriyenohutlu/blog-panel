import React, { useState } from "react";

const BasicModal = () => {
  const [open, setOpen] = useState(false);

  const toggleModal = () => {
    setOpen(!open);
  };

  return (
    <div className="mb-5">
      {/* Button */}
      <div className="flex items-center justify-center">
        <button type="button" className="btn btn-info" onClick={toggleModal}>
          Launch modal
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex items-center justify-center min-h-screen px-4"
            onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside the modal
          >
            <div className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8">
              <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                <h5 className="font-bold text-lg">Modal Title</h5>
                <button
                  type="button"
                  className="text-white-dark hover:text-dark"
                  onClick={toggleModal}
                >
                  <svg> ... </svg>
                </button>
              </div>
              <div className="p-5">
                <div className="dark:text-white-dark/70 text-base font-medium text-[#1f2937]">
                  <p>
                    Mauris mi tellus, pharetra vel mattis sed, tempus ultrices
                    eros. Phasellus egestas sit amet velit sed luctus. Orci
                    varius natoque penatibus et magnis dis parturient montes,
                    nascetur ridiculus mus. Suspendisse potenti. Vivamus
                    ultrices sed urna ac pulvinar. Ut sit amet ullamcorper mi.
                  </p>
                </div>
                <div className="flex justify-end items-center mt-8">
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={toggleModal}
                  >
                    Discard
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary ltr:ml-4 rtl:mr-4"
                    onClick={toggleModal}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicModal;
