import { useAppStore } from '@/app/App';
import { Flower } from '@/shared/types/Flower';
import {
  Box,
  Modal,
  Typography,
  Stack,
  TextField,
  Button,
  useMediaQuery,
} from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';

type FlowerDetailsProps = {
  open: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
  flower?: Flower;
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'max(80%, 300px)',
  bgcolor: 'background.paper',
  p: 4,
  gap: 4,
  boxShadow: 24,
};

export function FlowerDetails({ open, onClose, flower }: FlowerDetailsProps) {
  const isMobile = useMediaQuery('(max-width:420px)');
  const [amount, setAmount] = useState(1);
  const addItemToCard = useAppStore((state) => state.addBucketItem);

  const handleAddItemToCard = () => {
    if (flower) {
      addItemToCard({ item: flower, amount });
      setAmount(1);
      onClose(false);
    }
  };

  if (!flower) return null;
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Stack flexDirection={isMobile ? 'column' : 'row'} sx={style}>
        <Box sx={{ flex: 1 }}>
          <img
            src={flower.imageSrc}
            style={{ width: '100%' }}
            alt={`${flower.name} image`}
          />
        </Box>
        <Stack sx={{ flex: 1 }}>
          <Stack sx={{ flex: 1 }}>
            <Typography variant="h2" id="parent-modal-title">
              {flower.name}
            </Typography>
            <Stack flexDirection={'row'} justifyContent={'space-between'}>
              <Typography variant="h6">Колір:</Typography>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: 5,
                  backgroundColor: flower.color,
                  borderWidth: 1,
                  borderColor: '#dddddd',
                  borderStyle: 'solid',
                }}
              />
            </Stack>
            <Stack
              direction="row"
              spacing={2}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Typography variant="h6">Ціна за шт.:</Typography>
              <Typography variant="h6" color="text.secondary">
                {flower.price} грн.
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={2}
              alignItems={'center'}
              justifyContent={'space-between'}
            >
              <Typography variant="h6">Кількість:</Typography>
              <Typography variant="h6" color="text.secondary">
                {flower.amount || 0} шт.
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={2}
              flex={1}
              width={'100%'}
              alignItems={'end'}
              justifyContent={'space-between'}
              alignSelf={'end'}
            >
              <TextField
                sx={{ flex: 1, '& input': { p: '10px' } }}
                value={amount}
                type="number"
                slotProps={{ htmlInput: { min: 1, max: flower.amount } }}
                onChange={(e) => {
                  const value = +(e.target as HTMLInputElement).value;
                  if (value < 1) {
                    return setAmount(1);
                  }
                  if (value > flower.amount) {
                    return setAmount(flower.amount);
                  }
                  setAmount(value);
                }}
              />
              <Button
                size="large"
                variant="contained"
                onClick={handleAddItemToCard}
              >
                Додати
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Modal>
  );
}
