import { useFormStatus } from 'react-dom';
import { Button, CircularProgress } from '@mui/material';

export const SubmitButton = ({ text = 'Submit', width }: { text?: string, width?: string }) => {
  const { pending } = useFormStatus();
  return (
    <Button
      size="large"
      variant="contained"
      color="primary"
      fullWidth={!width}
      type="submit"
      disabled={pending}
    >
      {pending ? <CircularProgress /> : text}
    </Button>
  );
};
