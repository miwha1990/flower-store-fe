import AppAppBar from "@/widgets/AppBar/AppBar";
import { Box, Container } from "@mui/material";
import { Outlet } from "react-router";

export function CommonLayout() {
    return (
      <Box>
        <AppAppBar />
        <Container maxWidth="lg" sx={{ pt: '120px' }}>
          <Outlet />
        </Container>
      </Box>
    );
  };