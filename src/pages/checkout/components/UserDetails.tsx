import {
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from '@mui/material';
import { MuiTelInput } from 'mui-tel-input';

export type UserDetailsValue = {
  email: string;
  name: string;
  phone: string;
  recipientPhone: string;
  recipient: 'same' | 'different';
  description: string;
};

type UserDetailsProps = {
  value: UserDetailsValue;
  onChange: (value: UserDetailsValue) => void;
  emailReadOnly?: boolean;
  nameReadOnly?: boolean;
  disabled?: boolean;
};

export function UserDetails({
  value,
  onChange,
  emailReadOnly = false,
  nameReadOnly = false,
  disabled = false,
}: UserDetailsProps) {
  const updateValue = (changes: Partial<UserDetailsValue>) => {
    onChange({ ...value, ...changes });
  };

  return (
    <Stack gap={2}>
      <TextField
        type="email"
        required
        id="email_field"
        name="email"
        label="Email"
        value={value.email}
        onChange={event => updateValue({ email: event.target.value })}
        disabled={disabled}
        slotProps={{ htmlInput: { readOnly: emailReadOnly } }}
      />
      <TextField
        required
        id="name_field"
        name="name"
        label="І`мя замовника"
        value={value.name}
        onChange={event => updateValue({ name: event.target.value })}
        disabled={disabled}
        slotProps={{ htmlInput: { readOnly: nameReadOnly } }}
      />
      <MuiTelInput
        required
        defaultCountry="UA"
        name="phone_client"
        id="phone_field"
        label="Телефон замовника"
        value={value.phone}
        onChange={phone => updateValue({ phone })}
        disabled={disabled}
      />
      <RadioGroup
        name="recipient"
        value={value.recipient}
        onChange={(_event, recipient) =>
          updateValue({
            recipient: recipient === 'different' ? 'different' : 'same',
          })
        }
        aria-disabled={disabled}
      >
        <FormControlLabel
          value="same"
          control={<Radio />}
          disabled={disabled}
          label="Я - держувач"
        />
        <FormControlLabel
          value="different"
          control={<Radio />}
          disabled={disabled}
          label="Одержувач - інша людина"
        />
      </RadioGroup>
      {value.recipient === 'different' && (
        <MuiTelInput
          required
          defaultCountry="UA"
          name="phone_recipient"
          id="phone_field_2"
          label="Телефон одержувача"
          value={value.recipientPhone}
          onChange={recipientPhone => updateValue({ recipientPhone })}
          disabled={disabled}
        />
      )}
      <TextField
        multiline
        rows={3}
        name="description"
        id="description"
        label="Коментар або текст на записці"
        value={value.description}
        onChange={event => updateValue({ description: event.target.value })}
        disabled={disabled}
        slotProps={{ htmlInput: { maxLength: 40 } }}
      />
    </Stack>
  );
}
