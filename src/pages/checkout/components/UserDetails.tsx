import { UserContext } from '@/app/useUser';
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from '@mui/material';
import { MuiTelInput } from 'mui-tel-input';
import { useContext, useState } from 'react';

export function UserDetails() {
  const { user } = useContext(UserContext);
  const [sameClient, setSameClient] = useState(true);
  const [clientPhone, setClientPhone] = useState(user?.phone || '');
  const [recipPhone, setRecipPhone] = useState('');

  return (
    <Stack gap={2}>
      <TextField
        type="email"
        required
        disabled={!!user?.email}
        id="email_field"
        name="email"
        label="Email"
        defaultValue={user?.email}
      />
      <TextField
        required
        id="name_field"
        label="І`мя замовника"
        defaultValue={user?.name}
      />
      <MuiTelInput
        required
        defaultCountry="UA"
        name="phone_client"
        id="phone_field"
        label="Телефон замовника"
        value={clientPhone}
        onChange={(value) => setClientPhone(value)}
      />

      <RadioGroup
        defaultValue="same"
        onChange={(_event, value) => {
          setSameClient(value === 'same');
        }}
      >
        <FormControlLabel
          value="same"
          control={<Radio />}
          label="Я - держувач"
        />
        <FormControlLabel
          value="different"
          control={<Radio />}
          label="Одержувач - інша людина"
        />
      </RadioGroup>
      {!sameClient && (
        <MuiTelInput
          required
          defaultCountry="UA"
          name="phone_recipient"
          id="phone_field_2"
          label="Телефон одержувача"
          value={recipPhone}
          onChange={(value) => setRecipPhone(value)}
        />
      )}
      <TextField
        multiline
        rows={3}
        id="description"
        label="Коментар або текст на записці"
        slotProps={{ htmlInput: { maxLength: 40 } }}
      />
    </Stack>
  );
}
