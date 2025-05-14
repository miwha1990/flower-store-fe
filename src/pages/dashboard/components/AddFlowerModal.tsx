import { FlowersService } from '@/entities/flowers/FlowersService';
import { useErrorNotification } from '@/shared/hooks/useErrorNotification';
import { SubmitButton } from '@/shared/SubmitButton';
import { Flower } from '@/shared/types/Flower';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Stack,
  useMediaQuery,
  useTheme,
  Input,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useQuery } from '@tanstack/react-query';
import {
  useState,
  useActionState,
  startTransition,
  useEffect,
  SetStateAction,
  Dispatch,
  FormEvent,
} from 'react';

export function AddFlowerModal({
  open,
  setOpen,
  selectedFlower,
  setSelectedFlower,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedFlower: Dispatch<SetStateAction<Flower | undefined>>;
  selectedFlower?: Flower;
}) {
  const { refetch } = useQuery<Flower[]>({
      queryKey: ['flowers'],
      queryFn: FlowersService.getFlowers,
    });

  const [previewImg, setPreviewImg] = useState<string>('');

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const handleClose = () => {
    setOpen(false);
    setSelectedFlower(undefined);
    setPreviewImg('')
  };

  const [state, submitAction] = useActionState(
    selectedFlower?.id
      ? FlowersService.editFlower(selectedFlower.id)
      : FlowersService.addFlower,
    {
      data: null,
      error: null,
    }
  );
  useErrorNotification(
    state.data
      ? `Flower ${selectedFlower ? 'updated' : 'added'}`
      : state.error?.message || state.error,
    state.data ? 'success' : 'error'
  );

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    startTransition(() => submitAction(formData));
  }

  useEffect(() => {
    if (state.data?.id) {
      refetch();
    }
  }, [state.data?.id]);

  return (
    <Dialog fullScreen={fullScreen} open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{selectedFlower ? 'Edit' : 'Add'} Flower</DialogTitle>
        <DialogContent sx={{ minWidth: 300, pt: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Stack rowGap={'20px'}>
                  <TextField
                    label="Name"
                    required
                    name="name"
                    fullWidth
                    defaultValue={selectedFlower?.name}
                  />
                  <TextField
                    label="Color"
                    required
                    name="color"
                    type="color"
                    fullWidth
                    defaultValue={selectedFlower?.color}
                  />
                  <TextField
                    slotProps={{ input: { type: 'number' } }}
                    label="Price"
                    required
                    name="price"
                    fullWidth
                    defaultValue={selectedFlower?.price}
                  />
                  <TextField
                    slotProps={{ input: { type: 'number' } }}
                    label="Amount"
                    required
                    name="amount"
                    fullWidth
                    defaultValue={selectedFlower?.amount}
                  />
                </Stack>
              </Grid>
              <Grid size={6}>
                <Box>
                  <Input
                    slotProps={{ input: { accept: 'image/*', type: 'file' } }}
                    name="file"
                    onChange={(event) => {
                      const file = (event.currentTarget as HTMLInputElement)
                        ?.files?.[0];
                      setPreviewImg(file ? URL.createObjectURL(file) : '');
                    }}
                  />
                  {(!!previewImg ||
                    selectedFlower?.imageSrc) && (
                      <img
                        style={{ width: '100%' }}
                        src={previewImg || selectedFlower?.imageSrc}
                        alt="new flower image"
                      />
                    )}
                </Box>
              </Grid>
            </Grid>
          </Box>

          {state?.error && <Typography color="error">{state.error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <SubmitButton width="auto" />
        </DialogActions>
      </form>
    </Dialog>
  );
}
