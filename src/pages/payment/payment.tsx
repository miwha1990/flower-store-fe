import GooglePayButton from '@google-pay/button-react';
import {
  Alert,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { OrdersService } from '@/entities/orders/OrdersService';
import type { Order } from '@/shared/types/Order';
import Grid from '@mui/material/Grid2';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { ApplePayButton } from './components/ApplePayButton';

const DELIVERY_FEE = 200;

const formatPrice = (price: number) =>
  new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 2,
  }).format(price);

export function Payment() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [paymentMessage, setPaymentMessage] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const { data, error, isLoading } = useQuery<Order>({
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
    : 0;
  const totalDue = orderTotal + DELIVERY_FEE;
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
            gatewayMerchantId: 'exampleGatewayMerchantId',
          },
        },
      },
    ],
    merchantInfo: {
      merchantId: '12345678901234567890',
      merchantName: 'Flower Store (Test)',
    },
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPriceLabel: 'Flower Store order',
      totalPrice: totalDue.toFixed(2),
      currencyCode: 'UAH',
      countryCode: 'UA',
    },
  } satisfies google.payments.api.PaymentDataRequest;

  const showPaymentError = (message: string) => {
    setPaymentMessage(null);
    setPaymentError(message);
  };

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
            <Typography variant="h6">{formatPrice(DELIVERY_FEE)}</Typography>
          </Stack>
          <Stack sx={{ mb: 2 }} direction="row" justifyContent="space-between">
            <Typography variant="h5">Всього до сплати:</Typography>
            <Typography variant="h5">
              <b>{formatPrice(totalDue)}</b>
            </Typography>
          </Stack>
          {isLoading && <Typography>Завантажуємо замовлення…</Typography>}
          {error && (
            <Alert severity="error">
              Не вдалося завантажити замовлення для оплати.
            </Alert>
          )}
          {paymentError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {paymentError}
            </Alert>
          )}
          {paymentMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {paymentMessage}
            </Alert>
          )}
          {data && orderId && (
            <Stack spacing={2} alignItems="center">
              <GooglePayButton
                buttonColor="black"
                buttonType="pay"
                environment="TEST"
                paymentRequest={paymentRequest}
                onPaymentAuthorized={async () => {
                  setPaymentError(null);
                  setPaymentMessage(
                    'Google Pay TEST payment authorized. No charge was processed.'
                  );
                  return { transactionState: 'SUCCESS' };
                }}
                onCancel={() => {
                  setPaymentMessage(null);
                  setPaymentError(null);
                }}
                onError={(paymentError) =>
                  showPaymentError(
                    paymentError instanceof Error
                      ? paymentError.message
                      : paymentError.statusMessage
                  )
                }
                style={{ width: 300, height: 48 }}
              />
              <ApplePayButton
                amount={totalDue}
                orderId={orderId}
                onError={showPaymentError}
                onPaymentAuthorized={() => {
                  setPaymentError(null);
                  setPaymentMessage(
                    'Apple Pay test payment authorized by the sandbox.'
                  );
                }}
              />
              <Typography variant="caption" color="text.secondary">
                Тестовий режим: реальне списання коштів не виконується.
              </Typography>
            </Stack>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}
