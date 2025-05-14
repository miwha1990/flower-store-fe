import { Flower } from '@/shared/types/Flower';
import { alpha } from '@mui/material/styles';

import {
  Paper,
  CardMedia,
  CardContent,
  Typography,
  Stack,
  Box,
  useTheme,
  useMediaQuery,
  CardActionArea,
} from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import css from './FlowerCard.module.css';

export default function FlowerCard({
  flower,
  onClick,
}: {
  flower: Flower;
  onClick: Dispatch<SetStateAction<Flower | undefined>>;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:420px)');
  const isSmallMobile = useMediaQuery('(max-width:375px)');
  return (
    <Paper
      elevation={3}
      sx={{
        width: isSmallMobile ? 160 : isMobile ? 180 : 200,
        backdropFilter: 'blur(4px)',
        backgroundColor: alpha(theme.palette.background.default, 0.6),
        transition: 'all 0.2s',
        '&:hover': { transform: 'scale(1.02)' },
      }}
    >
      <CardActionArea onClick={() => onClick(flower)}>
        <CardMedia
          component="img"
          alt={flower.name}
          height="200"
          image={flower.imageSrc}
        />
        <CardContent>
          <Stack direction="row"  alignItems={'center'} justifyContent="space-between">
            <Typography className={css.flowerName} gutterBottom variant={isSmallMobile ? 'h6' : "h5"} component="div">
              {flower.name}
            </Typography>
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
            <Typography variant={isSmallMobile ? "body1" : "h6"} color="text.secondary">
              {flower.price} грн.
            </Typography>
            <Typography variant={isSmallMobile ? "body1" : "h6"} color="text.secondary">
              {flower.amount || 0} шт.
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Paper>
  );
}
