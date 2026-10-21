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
import type { OrderItem } from './types/Order';

type OrderProps = {
  items: OrderItem[];
  onQuantityChange: (itemId: number, quantity: number) => void;
  onRemoveItem?: (itemId: number) => void;
  maxHeight?: number;
  readOnly?: boolean;
};

export function Order({
  items,
  onQuantityChange,
  onRemoveItem,
  maxHeight,
  readOnly = false,
}: OrderProps) {
  const total = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  return (
    <>
      <List sx={maxHeight ? { maxHeight, overflow: 'auto', mb: 1 } : { mb: 1 }}>
        {items.map(orderItem => (
          <ListItem
            key={orderItem.itemId}
            sx={{ pl: 0 }}
            secondaryAction={
              onRemoveItem && !readOnly ? (
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => onRemoveItem(orderItem.itemId)}
                >
                  <DeleteIcon />
                </IconButton>
              ) : undefined
            }
          >
            {orderItem.item.imageSrc && <ListItemAvatar>
              <Avatar src={orderItem.item.imageSrc} />
            </ListItemAvatar>}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ width: '100%' }}
            >
              <ListItemText
                primary={orderItem.item.name}
                secondary={
                  <Typography variant="body1" fontWeight="bold" component="span">
                    {orderItem.unitPrice} грн.
                  </Typography>
                }
              />
              <NumberField
                value={orderItem.quantity}
                onChange={quantity =>
                  onQuantityChange(orderItem.itemId, quantity)
                }
                max={orderItem.item.amount}
                disabled={readOnly}
              />
            </Stack>
          </ListItem>
        ))}
      </List>
      <Typography variant="h6" fontWeight="bold">
        Всього: {total} грн.
      </Typography>
    </>
  );
}
