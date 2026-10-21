import { useAppStore } from '@/app/App';
import { UserContext } from '@/app/useUser';
import { OrdersService } from '@/entities/orders/OrdersService';
import { useErrorNotification } from '@/shared/hooks/useErrorNotification';
import { Order } from '@/shared/Order';
import { SubmitButton } from '@/shared/SubmitButton';
import type { OrderItem } from '@/shared/types/Order';
import { Paper } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useActionState, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Delivery } from './components/Delivery';
import {
  UserDetails,
  type UserDetailsValue,
} from './components/UserDetails';

export function Checkout() {
  const store = useAppStore();
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [deliveryAddress, setDeliveryAddress] = useState(
    store.deliveryAddress ?? ''
  );
  const [userDetails, setUserDetails] = useState<UserDetailsValue>({
    email: user?.email ?? '',
    name: user?.name ?? '',
    phone: user?.phone ?? '',
    recipientPhone: '',
    recipient: 'same',
    description: '',
  });
  const items: OrderItem[] = [...store.bucketItems.entries()].map(
    ([item, quantity]) => ({
      itemId: Number(item.itemId),
      quantity,
      item,
      unitPrice: item.price,
    })
  );
  const changeDeliveryAddress = (address: string) => {
    debugger;
    setDeliveryAddress(address);
    store.updateDeliveryAddress(address);
  };
  const changeUserDetails = (details: UserDetailsValue) => {
    setUserDetails(details);
    setUser(currentUser =>
      currentUser ? { ...currentUser, phone: details.phone } : currentUser
    );
  };
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
  }, [state.data, navigate]);

  useErrorNotification(state.error);

  return (
    <Paper elevation={2} sx={{ p: 4 }}>
      <form action={submitAction}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Order
              items={items}
              maxHeight={300}
              onQuantityChange={(itemId, quantity) => {
                const entry = [...store.bucketItems.entries()].find(
                  ([item]) => item.itemId === itemId
                );
                if (entry) {
                  store.changeBucketItem({ item: entry[0], amount: quantity });
                }
              }}
              onRemoveItem={itemId => {
                const item = [...store.bucketItems.keys()].find(
                  flower => flower.itemId === itemId
                );
                if (item) store.removeBucketItem(item);
              }}
            />
            <Delivery
              address={deliveryAddress}
              onAddressChange={changeDeliveryAddress}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <UserDetails
              value={userDetails}
              onChange={changeUserDetails}
              emailReadOnly={Boolean(user?.email)}
              nameReadOnly={Boolean(user?.name)}
            />
            <br />
            <SubmitButton
              text="Замовити"
              disabled={
                !deliveryAddress ||
                !userDetails.name ||
                !userDetails.phone ||
                !items.length
              }
            />
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
