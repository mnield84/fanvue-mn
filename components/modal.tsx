import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

interface CustomModalProps {
  openInitially: boolean;
  onClose: () => void;
  selectedImg: string;
}

const CustomModal: React.FC<CustomModalProps> = ({
  openInitially,
  onClose,
  selectedImg,
}) => {
  const [open, setOpen] = useState(openInitially);

  useEffect(() => {
    setOpen(openInitially);
  }, [openInitially]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return ReactDOM.createPortal(
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "80%", md: "50%" },
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
          <img
            src={selectedImg}
            alt="Full size"
            style={{ width: "100%", height: "auto" }}
          />
        </Box>
      </Box>
    </Modal>,
    document.body
  );
};

export default CustomModal;
