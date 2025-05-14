import { useQuery } from '@tanstack/react-query';
import { Flower } from '@/shared/types/Flower';
import FlowerCard from '@/widgets/FlowerCard/FlowerCard';
import { Box, Stack } from '@mui/material';
import { FlowersService } from '@/entities/flowers/FlowersService';
import { FlowerDetails } from './components/FlowerDetails';
import { useState } from 'react';

export default function Home() {
  const [selectedFlower, setSelectedFlower] = useState<Flower | undefined>();
  const { data } = useQuery<Flower[]>({
    queryKey: ['flowers'],
    queryFn: FlowersService.getFlowers,
    select: (data) => data.filter((fl) => !!fl.amount),
  });

  return (
    <Box>
      <Stack mt={1} direction={'row'} width={'100%'} flexWrap="wrap" gap="20px">
        {data?.map((flower) => <FlowerCard key={flower.id} flower={flower} onClick={setSelectedFlower} />)}
      </Stack>
      <FlowerDetails
        open={!!selectedFlower}
        onClose={() => setSelectedFlower(undefined)}
        flower={selectedFlower}
      />
    </Box>
  );
}
