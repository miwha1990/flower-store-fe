import { GoogleSearchInput } from '@/widgets/GoogleSearchInput/GoogleSearchInput';
import { Stack, FormControlLabel, Switch, Typography, Link } from '@mui/material';
import { useState } from 'react';

export function Delivery() {
  const [self, setSelf] = useState(false);
  return (
    <Stack flexDirection="column" sx={{mt: 2}}>
      <FormControlLabel
        control={<Switch checked={self} onChange={(_e, v) => setSelf(v)} />}
        label="Самовивіз"
      />
      {!self ? (
        <GoogleSearchInput
          onPlaceSelect={(v) => console.log(v)}
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
