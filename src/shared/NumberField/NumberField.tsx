import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import css from './NumberField.module.css';
import { useState, ChangeEvent, useEffect } from 'react';

type NumberFieldProps = {
  defaultValue?: number;
  onChange?(v: number): void;
  max?: number;
};
export function NumberField({ defaultValue, onChange, max }: NumberFieldProps) {
  const [value, setValue] = useState(defaultValue || 0);
  const down = () => {
    if(value > 1) {
      setValue((prev) => --prev);
    }
  }
  const up = () => {
    if((max && value < max) || !max) {
      setValue((prev) => ++prev);
    }
  }

  useEffect(() => {
    onChange?.(value)
  }, [value]);

  return (
    <div className={css.textFieldWrapper}>
      <IconButton className={css.buttonRight} onClick={up}>
        <AddIcon fontSize="small" />
      </IconButton>
      <input
        className={css.numberField}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const isNumber = e.currentTarget.value.search(/[0-9]/) !== -1;
          if (isNumber) {
            setValue(+e.currentTarget.value);
          }
        }}
        inputMode="numeric"
        type="text"
        value={value}
        pattern="[0-9]*"
      />
      <IconButton className={css.buttonRight} onClick={down}>
        <RemoveIcon fontSize="small" />
      </IconButton>
    </div>
  );
}
