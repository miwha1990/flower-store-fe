import { FlowersService } from '@/entities/flowers/FlowersService';
import { useErrorNotification } from '@/shared/hooks/useErrorNotification';
import { SubmitButton } from '@/shared/SubmitButton';
import { Category, Flower } from '@/shared/types/Flower';
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useQuery } from '@tanstack/react-query';
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from 'react';

const colors = ['white', 'pink', 'darksalmon', 'purple', 'darkred', 'red', 'orange', 'yellow', 'blue'];
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

  const { data: categoriesData } = useQuery<Category[]>({
    queryKey: ['flowers/categories'],
    queryFn: FlowersService.getFlowersCategories,
  });

  const [previewImg, setPreviewImg] = useState<string>('');

  useEffect(() => {
    if (!previewImg) return;
    return () => URL.revokeObjectURL(previewImg);
  }, [previewImg]);

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
        <DialogContent sx={{ minWidth: 300, pt: 2, mb: 2 }}>
          <Box sx={{ flexGrow: 1, mt: 2 }}>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Stack rowGap={'20px'}>
                  <TextField
                    label="Name"
                    required
                    size="small"
                    name="name"
                    fullWidth
                    defaultValue={selectedFlower?.name}
                  />
                  <Autocomplete
                    id="category"
                    size="small"
                    freeSolo
                    options={(categoriesData || []).map(option => option.name)}
                    fullWidth
                    renderInput={(params) =>
                      <TextField {...params} required defaultValue={selectedFlower?.category} label="Category" name="category" />}
                  />
                  <FormControl fullWidth>
                    <InputLabel sx={{ top: -5 }} id="color-select-label">Color</InputLabel>
                    <Select
                      labelId="color-select-label"
                      id="color-select"
                      name="color"
                      defaultValue={selectedFlower?.color}
                      renderValue={(selected) => (
                        <Box sx={{ height: 25, backgroundColor: selected }} />
                      )}
                      label="Color"
                      size="small"
                    >
                      {colors.map((color) => (
                        <MenuItem key={color} value={color} sx={{ height: 30, backgroundColor: color, '&.Mui-selected': { backgroundColor: color } }} />
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    slotProps={{ input: { type: 'number' } }}
                    label="Price"
                    required
                    name="price"
                    size="small"
                    fullWidth
                    defaultValue={selectedFlower?.price}
                  />
                  <TextField
                    slotProps={{ input: { type: 'number' } }}
                    label="Amount"
                    required
                    name="amount"
                    size="small"
                    fullWidth
                    defaultValue={selectedFlower?.amount}
                  />
                </Stack>
              </Grid>
              <Grid size={6}>
                <Box
                  component="label"
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    aspectRatio: '1 / 1',
                    overflow: 'hidden',
                    border: '2px dashed',
                    borderColor: 'divider',
                    borderRadius: 1,
                    cursor: 'pointer',
                    '&:hover .image-overlay, &:focus-within .image-overlay': {
                      opacity: 1,
                    },
                    '&:focus-within': {
                      outline: '2px solid',
                      outlineColor: 'primary.main',
                      outlineOffset: 2,
                    },
                  }}
                >
                  <input
                    accept="image/*,.webp"
                    aria-label="Select flower image"
                    name="file"
                    type="file"
                    style={{
                      position: 'absolute',
                      width: 1,
                      height: 1,
                      padding: 0,
                      margin: -1,
                      overflow: 'hidden',
                      clip: 'rect(0, 0, 0, 0)',
                      whiteSpace: 'nowrap',
                      border: 0,
                    }}
                    onChange={(event) => {
                      const file = event.currentTarget.files?.[0];
                      setPreviewImg(file ? URL.createObjectURL(file) : '');
                    }}
                  />
                  {previewImg || selectedFlower?.imageSrc ? (
                    <>
                      <Box
                        component="img"
                        src={previewImg || selectedFlower?.imageSrc}
                        alt="Flower preview"
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <Box
                        className="image-overlay"
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(0, 0, 0, 0.45)',
                          color: 'common.white',
                          opacity: 0,
                          transition: 'opacity 150ms ease-in-out',
                        }}
                      >
                        <Typography>Click to change image</Typography>
                      </Box>
                    </>
                  ) : (
                    <Typography color="text.secondary" textAlign="center" sx={{ px: 2 }}>
                      Click to add image
                    </Typography>
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
