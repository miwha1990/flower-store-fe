import { GoogleSearchInput } from '@/widgets/GoogleSearchInput/GoogleSearchInput';
import {
  FormControlLabel,
  Link,
  Stack,
  Switch,
  Typography,
} from '@mui/material';

const PICKUP_ADDRESS = 'Самовивіз';

type DeliveryProps = {
  address: string;
  onAddressChange: (address: string) => void;
  disabled?: boolean;
};

export function Delivery({
  address,
  onAddressChange,
  disabled = false,
}: DeliveryProps) {
  const isPickup = address === PICKUP_ADDRESS;

  return (
    <Stack flexDirection="column" sx={{ mt: 2 }}>
      {isPickup && (
        <input type="hidden" name="delivery_address" value={address} />
      )}
      <FormControlLabel
        control={
          <Switch
            checked={isPickup}
            disabled={disabled}
            onChange={(_event, value) =>
              onAddressChange(value ? PICKUP_ADDRESS : '')
            }
          />
        }
        label="Самовивіз"
        sx={{ mb: 2, alignSelf: 'flex-start' }}
      />
      {!isPickup ? (
        <GoogleSearchInput
          name="delivery_address"
          value={address}
          disabled={disabled}
          onInputValueChange={onAddressChange}
          onPlaceSelect={place => {
            onAddressChange(place?.formattedAddress ?? '');
          }}
          label="Адреса доставки"
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
