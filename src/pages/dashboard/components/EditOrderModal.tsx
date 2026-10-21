import { OrdersService } from '@/entities/orders/OrdersService';
import { Delivery } from '@/pages/checkout/components/Delivery';
import { UserDetails } from '@/pages/checkout/components/UserDetails';
import { Order } from '@/shared/Order';
import type { Order as OrderType, OrderItem } from '@/shared/types/Order';
import { OrderStatus } from '@/shared/types/Order';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState, type FormEvent } from 'react';

type EditOrderModalProps = {
  open: boolean;
  order?: OrderType;
  onClose: () => void;
};

type OrderDetails = {
  email: string;
  name: string;
  phone: string;
  recipientPhone: string;
  recipient: 'same' | 'different';
  description: string;
  address: string;
};

const emptyDetails: OrderDetails = {
  email: '',
  name: '',
  phone: '',
  recipientPhone: '',
  recipient: 'same',
  description: '',
  address: '',
};

const parseDetails = (details: string): OrderDetails => {
  const parsed: unknown = JSON.parse(details);
  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Order details are not in the expected format.');
  }

  const source = parsed as Record<string, unknown>;
  const getString = (key: string) =>
    typeof source[key] === 'string' ? source[key] : '';

  return {
    email: getString('email'),
    name: getString('name'),
    phone: getString('phone'),
    recipientPhone: getString('recipientPhone'),
    recipient:
      getString('recipient') === 'different' ? 'different' : 'same',
    description: getString('description'),
    address: getString('address'),
  };
};

export function EditOrderModal({
  open,
  order,
  onClose,
}: EditOrderModalProps) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.PENDING);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [details, setDetails] = useState<OrderDetails>(emptyDetails);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const editOrder = useMutation({
    mutationFn: ({
      id,
      nextStatus,
    }: {
      id: number;
      nextStatus: OrderStatus;
    }) => OrdersService.editOrder(id, nextStatus),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      onClose();
    },
  });

  useEffect(() => {
    setStatus(order?.status ?? OrderStatus.PENDING);
    setItems(order?.items ?? []);
    setDetailsError(null);
    if (!order) {
      setDetails(emptyDetails);
      return;
    }

    try {
      setDetails(parseDetails(order.details));
    } catch (error: unknown) {
      setDetails(emptyDetails);
      setDetailsError(
        error instanceof Error
          ? error.message
          : 'Could not read the saved order details.'
      );
    }
  }, [order, open]);

  const handleClose = () => {
    editOrder.reset();
    onClose();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (order?.id === undefined) {
      return;
    }

    editOrder.mutate({
      id: order.id,
      nextStatus: status,
    });
  };

  const disabled = editOrder.isPending;

  return (
    <Dialog
      open={open}
      onClose={disabled ? undefined : handleClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>Edit order {order?.id}</DialogTitle>
        <DialogContent dividers>
          {detailsError && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {detailsError} Update the fields below before saving.
            </Alert>
          )}
          {editOrder.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {editOrder.error instanceof Error
                ? editOrder.error.message
                : 'Could not update the order.'}
            </Alert>
          )}
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                fullWidth
                required
                label="Status"
                value={status}
                onChange={event =>
                  setStatus(event.target.value as OrderStatus)
                }
                disabled={disabled}
                sx={{ mb: 2 }}
              >
                {Object.values(OrderStatus).map(orderStatus => (
                  <MenuItem key={orderStatus} value={orderStatus}>
                    {orderStatus}
                  </MenuItem>
                ))}
              </TextField>
              <Order
                items={items}
                maxHeight={300}
                readOnly
                onQuantityChange={() => {}}
              />
              <Delivery
                address={details.address}
                onAddressChange={() => {}}
                disabled
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <UserDetails
                value={details}
                onChange={() => {}}
                disabled
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={disabled}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!order?.id || disabled || items.length === 0}
          >
            {disabled ? 'Saving…' : 'Save order'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
