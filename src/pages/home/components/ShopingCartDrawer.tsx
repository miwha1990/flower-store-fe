import { Box, Drawer, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router';
import { Order } from '@/shared/Order';

export function ShoppingCartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose(): void;
}) {
  const navigate = useNavigate();

  return (
    <Drawer open={open} onClose={onClose} anchor="right">
      <Box sx={{ flexGrow: 1, minWidth: 300, p: 2 }}>
        <Typography variant="h5">Кошик</Typography>
        <Order />
        <Button
          onClick={() => {
            onClose();
            navigate('/checkout');
          }}
          sx={{ mt: 1 }}
          fullWidth
          variant="contained"
        >
          Замовити
        </Button>
      </Box>
    </Drawer>
  );
}
