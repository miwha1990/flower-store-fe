import { useAppStore } from '@/app/App';
import { calculateTotal } from '@/shared/utils';
import GooglePayButton from '@google-pay/button-react';
import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
// import { ApplePayButton } from './components/ApplePayButton';
import { OrdersService } from '@/entities/orders/OrdersService';
import { Order } from '@/shared/types/Order';
import Grid from '@mui/material/Grid2';
import { useQuery } from '@tanstack/react-query';
import { ApplePayButton } from 'react-apple-pay-button';
import { useSearchParams } from 'react-router';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 2,
  }).format(price);

const isAvailable = (): boolean => {
  const ApplePay = ApplePaySession;
  return Boolean(ApplePay) && ApplePay.canMakePayments();
};
const paymentRequest = {
  apiVersion: 2,
  apiVersionMinor: 0,
  allowedPaymentMethods: [
    {
      type: 'CARD',
      parameters: {
        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
        allowedCardNetworks: ['MASTERCARD', 'VISA'],
      },
      tokenizationSpecification: {
        type: 'PAYMENT_GATEWAY',
        parameters: {
          gateway: 'example',
        },
      },
    },
  ],
  merchantInfo: {
    merchantId: '12345678901234567890',
    merchantName: 'Demo Merchant',
  },
  transactionInfo: {
    totalPriceStatus: 'FINAL',
    totalPriceLabel: 'Total',
    totalPrice: '100.00',
    currencyCode: 'USD',
    countryCode: 'US',
  },
};
export function Payment() {
  const appStore = useAppStore();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const orders = [...appStore.bucketItems.entries()];
  const total = calculateTotal(orders);

  const { data } = useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: () => {
      if (!orderId) {
        throw new Error('An order ID is required to load the order.');
      }
      return OrdersService.getOrder(orderId);
    },
    enabled: Boolean(orderId),
  });
  const orderTotal = data
    ? data.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    : total;

  return (
    <Grid container spacing={2} justifyContent={'center'}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Ваше замовлення:
          </Typography>
          <List disablePadding sx={{ mb: 2 }}>
            {data?.items.map(item => (
              <ListItem
                key={item.itemId}
                divider
                disableGutters
                sx={{ py: 1.5 }}
              >
                <ListItemText
                  primary={item.item.name}
                  secondary={`${item.quantity} × ${formatPrice(item.unitPrice)}`}
                  primaryTypographyProps={{ fontWeight: 600 }}
                />
                <Typography variant="body2" fontWeight={600}>
                  {formatPrice(item.unitPrice * item.quantity)}
                </Typography>
              </ListItem>
            ))}
          </List>
          <Stack sx={{ mb: 1 }} direction="row" justifyContent="space-between">
            <Typography variant="h6">Сума замовлення:</Typography>
            <Typography variant="h6">{formatPrice(orderTotal)}</Typography>
          </Stack>
          <Stack sx={{ mb: 1 }} direction="row" justifyContent="space-between">
            <Typography variant="h6">Доставка:</Typography>
            <Typography variant="h6">{formatPrice(200)}</Typography>
          </Stack>
          <Stack sx={{ mb: 2 }} direction="row" justifyContent="space-between">
            <Typography variant="h5">Всього до сплати:</Typography>
            <Typography variant="h5">
              <b>{formatPrice(orderTotal + 200)}</b>
            </Typography>
          </Stack>
          <lp-provider lp-data="your_data" lp-signature="your_signature">
            <lp-apple-pay mode="black"></lp-apple-pay>
          </lp-provider>
          <lp-provider lp-data="your_data" lp-signature="your_signature">
            <lp-privat24-pay mode="black"></lp-privat24-pay>
          </lp-provider>
          <GooglePayButton
            buttonColor="black"
            environment="TEST"
            paymentRequest={paymentRequest}
            onLoadPaymentData={(data) => {
              console.log('load payment data', data);
            }}
            style={{ width: 300, height: 40 }}
          />
          <ApplePayButton onClick={() => console.log('f')} theme="light">
            {'Subscribe with'}
          </ApplePayButton>
        </Paper>
      </Grid>
    </Grid>
  );
}
