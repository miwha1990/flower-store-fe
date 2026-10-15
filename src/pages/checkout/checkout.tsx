import { useAppStore } from '@/app/App';
import { UserContext } from '@/app/useUser';
import { OrdersService } from '@/entities/orders/OrdersService';
import { useErrorNotification } from '@/shared/hooks/useErrorNotification';
import { Order } from '@/shared/Order';
import { SubmitButton } from '@/shared/SubmitButton';
import type { OrderItem } from '@/shared/types/Order';
import { Paper } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useActionState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Delivery } from './components/Delivery';
import { UserDetails } from './components/UserDetails';

export function Checkout() {
  const store = useAppStore();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const items: OrderItem[] = [...store.bucketItems.entries()].map(
    ([item, quantity]) => ({
      itemId: Number(item.itemId),
      quantity,
    })
  );
  console.log(items, 'items');
  const [state, submitAction] = useActionState(
    OrdersService.createOrder(user?.id, items),
    {
      data: null,
      error: null,
    }
  );
  useEffect(() => {
    if (state.data) {
      navigate({ pathname: '/payment', search: `?orderId=${state.data.id}` });
    }
  }, [state.data])

  useErrorNotification(state.error);

  return (
    <Paper elevation={2} sx={{ p: 4 }}>
      <form action={submitAction}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Order maxHeight={300} />
            <Delivery />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <UserDetails />
            <br />
            <SubmitButton text="Замовити" disabled={!store.deliveryAddress || !user?.name || !user?.phone} />
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
