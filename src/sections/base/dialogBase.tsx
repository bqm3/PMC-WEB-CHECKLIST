import React from "react";
import { Dialog, DialogContent, CircularProgress, Typography } from "@mui/material";

interface DialogBaseProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

const DialogBase: React.FC<DialogBaseProps> = ({ open, onClose, message }) => (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        sx: { borderRadius: 3, p: 2, minWidth: 300 },
      }}
    >
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          p: 4,
        }}
      >
        <CircularProgress color="info" size={50} />
        <Typography variant="h6" fontWeight="bold">
          {message}
        </Typography>
      </DialogContent>
    </Dialog>
  );

export default DialogBase;
