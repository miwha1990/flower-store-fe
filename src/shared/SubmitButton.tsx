import { Button, CircularProgress } from '@mui/material';
import { useFormStatus } from 'react-dom';

export const SubmitButton = ({ text = 'Submit', width, disabled }: { text?: string, width?: string, disabled?: boolean }) => {
  const { pending } = useFormStatus();

  return (
    <Button
      size="large"
      variant="contained"
      color="primary"
      fullWidth={!width}
      type="submit"
      disabled={pending || disabled}
    >
      {pending ? <CircularProgress /> : text}
    </Button>
  );
};
