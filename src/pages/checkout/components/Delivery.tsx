import { useAppStore } from '@/app/App';
import { GoogleSearchInput } from '@/widgets/GoogleSearchInput/GoogleSearchInput';
import {
  FormControlLabel,
  Link,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

export function Delivery() {
  const [self, setSelf] = useState(false);
  const updateDeliveryAddress = useAppStore(
    (state) => state.updateDeliveryAddress
  );
  const deliveryAddress = useAppStore((state) => state.deliveryAddress);

  useEffect(() => {
    if (self) {
      updateDeliveryAddress('Самовивіз');
    }
  }, [self, updateDeliveryAddress]);
  return (
    <Stack flexDirection="column" sx={{ mt: 2 }}>
      <FormControlLabel
        control={
          <Switch checked={self} onChange={(_e, value) => setSelf(value)} />
        }
        label="Самовивіз"
        sx={{ mb: 2, alignSelf: 'flex-start' }}
      />
      {!self ? (
        <GoogleSearchInput
          name="delivery_address"
          onPlaceSelect={(place) => {
            updateDeliveryAddress(place?.formattedAddress ?? '');
          }}
          label="Адреса доставки"
          defaultValue={
            deliveryAddress === 'Самовивіз' ? '' : deliveryAddress || ''
          }
        />
      ) : (
        <Typography variant="body1">
          Самовивіз по адресі{' '}
          <Link
            target="_blank"
            href="https://maps.app.goo.gl/dHaxXHat6VuGDbf6A"
          >
            вулиця Кирилівська, 98
          </Link>
        </Typography>
      )}
    </Stack>
  );
}
