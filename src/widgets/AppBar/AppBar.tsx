import * as React from 'react';
import { styled, alpha, useColorScheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PhoneIcon from '@mui/icons-material/Phone';
import ColorModeIconDropdown from '@/features/ColorModeIconDropdown/ColorModeIconDropdown';
import AppBarLoginState from '@/features/AppBarLoginState';
import LogoDark from '@/assets/dark-logo.png';
import LogoLight from '@/assets/light-logo.png';
import { Badge, useScrollTrigger } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import cn from 'classnames';
import Css from './AppBar.module.css';
import { ShoppingCartDrawer } from '@/pages/home/components/ShopingCartDrawer';
import { useAppStore } from '@/app/App';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(4px)',
  border: '1px solid',
  borderColor: theme.palette.divider,
  backgroundColor: alpha(theme.palette.background.default, 0.6),
  boxShadow: theme.shadows[1],
  padding: '8px 12px',
}));

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const [openSideDrawer, setOpenSideDrawer] = React.useState(false);
  const { mode } = useColorScheme();
  const trigger = useScrollTrigger();
  const appStore = useAppStore();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      className={cn(Css.appBarCommon, { [Css.hideBar]: trigger })}
      sx={{
        color: (theme) => theme.palette.text.primary,
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          <Link
            href="/"
            sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}
          >
            <img
              src={mode === 'dark' ? LogoDark : LogoLight}
              width="120"
              alt="logo"
            />
          </Link>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Typography variant="h6">+38 (099) 12312312</Typography>
            <IconButton
              sx={{ mr: 1 }}
              disabled={!appStore.bucketItems.size}
              onClick={() => setOpenSideDrawer(true)}
            >
              <Badge badgeContent={appStore.bucketItems.size} color="warning">
                <ShoppingCartIcon color="action" />
              </Badge>
            </IconButton>
            <AppBarLoginState />
            <ColorModeIconDropdown />
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <Link href="tel:+3809912312312">
              <IconButton>
                <Badge badgeContent={appStore.bucketItems.size} color="warning">
                  <PhoneIcon color="action" />
                </Badge>
              </IconButton>
            </Link>
            <ColorModeIconDropdown size="medium" />
            <IconButton
              disabled={!appStore.bucketItems.size}
              onClick={() => setOpenSideDrawer(true)}
            >
              <Badge badgeContent={appStore.bucketItems.size} color="warning">
                <ShoppingCartIcon color="action" />
              </Badge>
            </IconButton>
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{
                sx: {
                  top: 'var(--template-frame-height, 0px)',
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>
                <Divider sx={{ my: 3 }} />
                <AppBarLoginState isMobile />
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
      <ShoppingCartDrawer
        open={openSideDrawer}
        onClose={() => setOpenSideDrawer(false)}
      />
    </AppBar>
  );
}
