import { UserContext } from '@/app/useUser';
import { AuthService } from '@/entities/auth/AuthService';
import { useErrorNotification } from '@/shared/hooks/useErrorNotification';
import { StyledBox } from '@/shared/StyledBox';
import { SubmitButton } from '@/shared/SubmitButton';
import { Stack, TextField, Typography, useColorScheme } from '@mui/material';
import { useActionState, useContext, useEffect } from 'react';
import { Navigate } from 'react-router';

export default function Login() {
  const { mode } = useColorScheme();
  const [state, submitAction] = useActionState(AuthService.login, {
    data: null,
    error: null,
  });
  useErrorNotification(state.error?.message);
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    if (state.data) {
      setUser(state.data);
    }
  }, [state.data])

  if (state.data) {
    return state.data.type === 'ADMIN' ? (
      <Navigate to={'/dashboard'} replace />
    ) : (
      <Navigate to={'/'} replace />
    );
  }


  return (
    <StyledBox
      sx={{
        bgcolor:
          mode === 'light' ? 'rgb(255 255 255 / 0.6)' : 'rgb(0 0 0 / 0.6)',
      }}
    >
      <form action={submitAction}>
        <Stack direction="column" spacing={4} width="100%">
          <Typography variant="h4">Log in</Typography>
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
            label="Password"
            type="password"
            id="password"
            name="password"
            fullWidth
            margin="normal"
            required
          />
          <SubmitButton />
        </Stack>
      </form>
    </StyledBox>
  );
}
