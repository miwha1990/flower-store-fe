import { Outlet } from "react-router";
import Box from '@mui/material/Box';
import AppAppBar from "@/widgets/AppBar/AppBar";
import bgImage from '@/assets/bg.jpg';

export function AuthLayout() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        background: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'text.primary',
        borderRadius: 1,
        p: 3,
        minHeight: '56px',
      }}
    >
      <AppAppBar />
      <Outlet/>
    </Box>
  );
}