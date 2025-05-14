import DarkModeIcon from '@mui/icons-material/DarkModeRounded';
import LightModeIcon from '@mui/icons-material/LightModeRounded';
import Box from '@mui/material/Box';
import IconButton, { IconButtonOwnProps } from '@mui/material/IconButton';
import { useColorScheme } from '@mui/material/styles';
import { useEffect } from 'react';

export default function ColorModeIconDropdown(props: IconButtonOwnProps) {
  const { mode, setMode } = useColorScheme();
  const handleClick = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const body = document.querySelector('body');
    if (body) {
      if (mode === 'dark') {
        body.classList.add('darkMode');
      } else {
        body.classList.remove('darkMode');
      }
    }
  }, [mode]);
  
  if (!mode) {
    return (
      <Box
        data-screenshot="toggle-mode"
        sx={(theme) => ({
          verticalAlign: 'bottom',
          display: 'inline-flex',
          width: '2.25rem',
          height: '2.25rem',
          borderRadius: theme.shape.borderRadius,
          border: '1px solid',
          borderColor: theme.palette.divider,
        })}
      />
    );
  }
  const resolvedMode = mode as 'light' | 'dark';
  const icon = {
    light: <LightModeIcon />,
    dark: <DarkModeIcon />,
  }[resolvedMode];

  return (
    <IconButton
      data-screenshot="toggle-mode"
      onClick={handleClick}
      disableRipple
      size="small"
      aria-haspopup="true"
      {...props}
    >
      {icon}
    </IconButton>
  );
}
