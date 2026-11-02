import { FlowersService } from '@/entities/flowers/FlowersService';
import { Flower } from '@/shared/types/Flower';
import { Filter } from '@/widgets/Filter/Filter';
import FlowerCard from '@/widgets/FlowerCard/FlowerCard';
import { Box, Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FlowerDetails } from './components/FlowerDetails';

export default function Home() {
  const [selectedFlower, setSelectedFlower] = useState<Flower | undefined>();
  const { data } = useQuery<{ items: Flower[] }>({
    queryKey: ['flowers/with-filters'],
    queryFn: FlowersService.getFlowersWithFilters,
    select: ({ items }) => ({
      items: items.filter((fl) => !!fl.amount,)
    })
  });

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', gap: 2 }}>
      <Filter onFilterChange={(filter) => console.log(filter)} />
      <Stack direction={'row'} flexWrap="wrap" flex={1} gap="20px">
        {data?.items.map((flower) => <FlowerCard key={flower.id} flower={flower} onClick={setSelectedFlower} />)}
      </Stack>
      <FlowerDetails
        open={!!selectedFlower}
        onClose={() => setSelectedFlower(undefined)}
        flower={selectedFlower}
      />
    </Box>
  );
}
