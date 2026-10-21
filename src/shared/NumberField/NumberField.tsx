import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import css from './NumberField.module.css';
import { ChangeEvent } from 'react';

type NumberFieldProps = {
  value: number;
  onChange?(v: number): void;
  max?: number;
  disabled?: boolean;
};
export function NumberField({
  value,
  onChange,
  max,
  disabled = false,
}: NumberFieldProps) {
  const down = () => {
    if(value > 1) {
      onChange?.(value - 1);
    }
  }
  const up = () => {
    if (max === undefined || value < max) {
      onChange?.(value + 1);
    }
  }

  return (
    <div className={css.textFieldWrapper}>
      <IconButton className={css.buttonRight} onClick={up} disabled={disabled}>
        <AddIcon fontSize="small" />
      </IconButton>
      <input
        className={css.numberField}
        disabled={disabled}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const nextValue = Number(e.currentTarget.value);
          if (
            Number.isInteger(nextValue) &&
            nextValue >= 1 &&
            (max === undefined || nextValue <= max)
          ) {
            onChange?.(nextValue);
          }
        }}
        inputMode="numeric"
        type="text"
        value={value}
        pattern="[0-9]*"
      />
      <IconButton className={css.buttonRight} onClick={down} disabled={disabled}>
        <RemoveIcon fontSize="small" />
      </IconButton>
    </div>
  );
}
