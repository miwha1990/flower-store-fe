import {
  Typography,
  IconButton,
  Stack,
  MenuItem,
  Button,
  useColorScheme,
  useTheme,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { removeCookie } from 'react-use-cookie';
import { useNavigate, Link } from 'react-router';
import { UserContext } from '@/app/useUser';
import { useContext } from 'react';

const LoggedState = ({
  name,
  onLogout,
  type,
  color,
}: {
  name: string;
  onLogout(): void;
  type: string;
  color: string;
}) => (
  <Stack sx={{ color }} direction="row" spacing={2} alignItems={'center'}>
    {type === 'owner' && (
      <Link to="/dashboard">
        <Button variant="contained">Адмінка</Button>
      </Link>
    )}
    <Typography variant="h6">Привіт, {name}!</Typography>
    <IconButton onClick={onLogout} color="inherit">
      <LogoutIcon />
    </IconButton>
  </Stack>
);

const RenderMenuItem = ({
  children,
  isMobile,
}: {
  children: React.ReactNode;
  isMobile?: boolean;
}) => (isMobile ? <MenuItem>{children}</MenuItem> : children);

export default function AppBarLoginState({ isMobile }: { isMobile?: boolean }) {
  const { user, setUser } = useContext(UserContext);
  const { mode } = useColorScheme();
  const theme = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    removeCookie('API_TOKEN');
  };
  const color = mode === 'light' ? theme.palette.text.primary : 'white';

  return user ? (
    <RenderMenuItem isMobile={isMobile}>
      <LoggedState
        onLogout={handleLogout}
        type={user.type}
        name={user.name}
        color={color}
      />
    </RenderMenuItem>
  ) : (
    <>
      <RenderMenuItem isMobile={isMobile}>
        <Button
          onClick={() => navigate('register')}
          variant="contained"
          fullWidth={isMobile}
        >
          Sign up
        </Button>
      </RenderMenuItem>
      <RenderMenuItem isMobile={isMobile}>
        <Button
          onClick={() => navigate('login')}
          variant="outlined"
          fullWidth={isMobile}
        >
          Sign in
        </Button>
      </RenderMenuItem>
    </>
  );
}
