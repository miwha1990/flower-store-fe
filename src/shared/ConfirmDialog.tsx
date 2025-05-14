import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';

export function ConfirmDialog({
  onClose,
  open,
}: {
  onClose(value?: boolean): void;
  open: boolean;
}) {
  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(true);
  };
  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435, maxWidth: 241 } }}
      open={open}
    >
      <DialogTitle>Confirm delete item?</DialogTitle>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button autoFocus onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}
