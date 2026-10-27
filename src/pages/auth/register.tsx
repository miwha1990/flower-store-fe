import { AuthService } from '@/entities/auth/AuthService';
import { useErrorNotification } from '@/shared/hooks/useErrorNotification';
import { StyledBox } from '@/shared/StyledBox';
import { SubmitButton } from '@/shared/SubmitButton';
import { Stack, TextField, Typography, useColorScheme } from '@mui/material';
import { MuiTelInput } from 'mui-tel-input';
import { startTransition, useActionState, useState } from 'react';
import { useNavigate } from 'react-router';

export default function Register() {
  const { mode } = useColorScheme();
  const [state, submitAction] = useActionState(AuthService.register, {
    data: null,
    error: null,
  });

  const [phone, setPhone] = useState('');


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
        mt: 5,
        bgcolor:
          mode === 'light' ? 'rgb(255 255 255 / 0.6)' : 'rgb(0 0 0 / 0.6)',
      }}
    >
      <form onSubmit={handleSubmit}>
        <Stack direction="column" spacing={3} width="100%">
          <Typography variant="h4">Sing in</Typography>
          <TextField
            type="email"
            id="email"
            name="email"
            label="Email"
            autoComplete="email"
            fullWidth
            margin="normal"
            required
          />
          <TextField
            id="name"
            name="name"
            label="Им`я"
            fullWidth
            margin="normal"
            required
          />
          <MuiTelInput
            required
            defaultCountry="UA"
            value={phone}
            onChange={(v) => {
              if (v.toString().length < 17) {
                setPhone(v);
              }
            }}
            name="phone"
            id="phone"
            label="Телефон"
          />
          <TextField
            type="password"
            label="Create Password"
            id="password"
            name="password"
            autoComplete="new-password"
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
            type="password"
            label="Repeat Password"
            id="password2"
            name="password2"
            autoComplete="new-password"
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
