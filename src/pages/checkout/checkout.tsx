import { Order } from '@/shared/Order';
import { Paper } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { UserDetails } from './components/UserDetails';
import { Delivery } from './components/Delivery';
import { SubmitButton } from '@/shared/SubmitButton';
import { useNavigate } from 'react-router';

export function Checkout() {
  const navigate = useNavigate();
  return (
    <Paper elevation={2} sx={{ p: 4 }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate({pathname: '/payment', search: '?orderId=123' });
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }} sx={{ p: 3 }}>
            <Order maxHeight={300} />
            <Delivery />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <UserDetails />
            <br />
            <SubmitButton text="Замовити" />
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
