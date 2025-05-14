import { startTransition, useActionState } from 'react';
import { useNavigate } from 'react-router';
import { Stack, TextField, Typography, useColorScheme } from '@mui/material';
import { SubmitButton } from '@/shared/SubmitButton';
import { StyledBox } from '@/shared/StyledBox';
import { AuthService } from '@/entities/auth/AuthService';
import { useErrorNotification } from '@/shared/hooks/useErrorNotification';

export default function Register() {
  const { mode } = useColorScheme();
  const [state, submitAction] = useActionState(AuthService.register, {
    data: null,
    error: null,
  });

  const navigate = useNavigate();
  useErrorNotification(
    state.error?.message || state.error || state.data,
    state.data ? 'success' : 'error'
  );

  function handleSubmit(event: any): void {
    event.preventDefault();
    const formData = new FormData(event.target);
    startTransition(() => submitAction(formData));
  }

  if (state.data) {
    setTimeout(() => navigate('/login'), 1000);
  }

  return (
    <StyledBox
      sx={{
        mt: 2,
        bgcolor:
          mode === 'light' ? 'rgb(255 255 255 / 0.6)' : 'rgb(0 0 0 / 0.6)',
      }}
    >
      <form onSubmit={handleSubmit}>
        <Stack direction="column" spacing={4} width="100%">
          <Typography variant="h4">Sing in</Typography>
          <TextField
            type="email"
            id="email"
            name="email"
            label="Email"
            fullWidth
            margin="normal"
            required
          />
          <TextField
            id="name"
            name="name"
            label="Name"
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Create Password"
            id="password"
            name="password"
            fullWidth
            slotProps={{
              htmlInput: {
                minLength: 5,
                maxLength: 10,
              },
            }}
            margin="normal"
            required
          />
          <TextField
            type="text"
            label="Repeat Password"
            id="password2"
            name="password2"
            fullWidth
            slotProps={{
              htmlInput: {
                minLength: 5,
                maxLength: 10,
              },
            }}
            margin="normal"
            required
          />
          <SubmitButton />
        </Stack>
      </form>
    </StyledBox>
  );
}
