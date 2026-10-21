import { Box, Drawer, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router';
import { useAppStore } from '@/app/App';
import { Order } from '@/shared/Order';

export function ShoppingCartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose(): void;
}) {
  const navigate = useNavigate();
  const bucketItems = useAppStore(state => state.bucketItems);
  const removeBucketItem = useAppStore(state => state.removeBucketItem);
  const changeBucketItem = useAppStore(state => state.changeBucketItem);
  const items = [...bucketItems.entries()].map(([item, quantity]) => ({
    itemId: Number(item.itemId),
    quantity,
    item,
    unitPrice: item.price,
  }));

  return (
    <Drawer open={open} onClose={onClose} anchor="right">
      <Box sx={{ flexGrow: 1, minWidth: 300, p: 2 }}>
        <Typography variant="h5">Кошик</Typography>
        <Order
          items={items}
          onQuantityChange={(itemId, quantity) => {
            const entry = [...bucketItems.entries()].find(
              ([item]) => item.itemId === itemId
            );
            if (entry) {
              changeBucketItem({ item: entry[0], amount: quantity });
            }
          }}
          onRemoveItem={itemId => {
            const item = [...bucketItems.keys()].find(
              flower => flower.itemId === itemId
            );
            if (item) removeBucketItem(item);
          }}
        />
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
