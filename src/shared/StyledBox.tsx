import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const StyledBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  top: '50%',
  left: '50%',
  border: '1px solid',
  borderColor: theme.palette.divider,
  transform: 'translate(-50%, -50%)',
  width: 'min(480px, 90%)',
  backdropFilter: 'blur(10px)',
  boxShadow: theme.shadows[1],
  padding: '2rem',
}));
