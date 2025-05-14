import { useAppStore } from '@/app/App';
import { calculateTotal } from '@/shared/utils';
import { Paper, Typography, Stack } from '@mui/material';
import GooglePayButton from '@google-pay/button-react';
// import { ApplePayButton } from './components/ApplePayButton';
import { ApplePayButton } from 'react-apple-pay-button';
import Grid from '@mui/material/Grid2';

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
  const orders = [...appStore.bucketItems.entries()];
  const total = calculateTotal(orders);
  return (
    <Grid container spacing={2} justifyContent={'center'}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Stack sx={{ mb: 1 }} direction="row" justifyContent="space-between">
            <Typography variant="h6">Ваше замовлення:</Typography>
            <Typography variant="h6">грн. {total}</Typography>
          </Stack>
          <Stack sx={{ mb: 1 }} direction="row" justifyContent="space-between">
            <Typography variant="h6">Доставка:</Typography>
            <Typography variant="h6">грн. 200</Typography>
          </Stack>
          <Stack sx={{ mb: 2 }} direction="row" justifyContent="space-between">
            <Typography variant="h5">Всього до сплати:</Typography>
            <Typography variant="h5">
              <b>грн. {total + 200}</b>
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
