import { useAppStore } from '@/app/App';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { NumberField } from './NumberField/NumberField';
import { Flower } from './types/Flower';
import { calculateTotal } from './utils';

export function Order({ maxHeight }: { maxHeight?: number }) {
  const appStore = useAppStore();
  const orders = [...appStore.bucketItems.entries()];
  console.log(orders, 'orders');
  return (
    <>
      <List sx={maxHeight ? { maxHeight, overflow: 'auto', mb: 1 } : { mb: 1 }}>
        {orders.map(([flower, amount]: [Flower, number]) => (
          <ListItem
            key={flower.id}
            sx={{ pl: 0 }}
            secondaryAction={
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => appStore.removeBucketItem(flower)}
              >
                <DeleteIcon />
              </IconButton>
            }
          >
            <ListItemAvatar>
              <Avatar src={flower.imageSrc} />
            </ListItemAvatar>
            <Stack
              direction={'row'}
              justifyContent={'space-between'}
              alignItems={'center'}
              sx={{ width: '100%' }}
            >
              <ListItemText
                primary={flower.name}
                secondary={
                  <Typography variant="body1" fontWeight="bold" component="span">
                    {flower.price} грн.
                  </Typography>
                }
              />
              <NumberField
                onChange={(value) =>
                  appStore.changeBucketItem({
                    item: flower,
                    amount: value,
                  })
                }
                max={flower.amount}
                defaultValue={amount}
              />
            </Stack>
          </ListItem>
        ))}
      </List>
      <Typography variant="h6" fontWeight={'bold'}>
        Всього: {calculateTotal(orders)} грн.
      </Typography>
    </>
  );
}
