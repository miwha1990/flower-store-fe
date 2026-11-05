import { useAppStore } from '@/app/store';
import { FiltersResponse, FlowersService } from '@/entities/flowers/FlowersService';
import { Flower } from '@/shared/types/Flower';
import { Filter } from '@/widgets/Filter/Filter';
import FlowerCard from '@/widgets/FlowerCard/FlowerCard';
import { Box, Dialog, DialogContent, Stack } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { FlowerDetails } from './components/FlowerDetails';

export default function Home() {
  const [selectedFlower, setSelectedFlower] = useState<Flower | undefined>();
  const mobileFilterOpen = useAppStore((state) => state.mobileFilterOpen);
  const toggleMobileFilter = useAppStore((state) => state.toggleMobileFilter);
  const [searchParams] = useSearchParams();
  const query = searchParams.toString();
  const { data } = useQuery<{ items: Flower[]; filters: FiltersResponse }>({
    queryKey: ['flowers/with-filters', query],
    queryFn: () => FlowersService.getFlowersWithFilters(query),
    select: ({ items, filters }) => ({
      items: items.filter((fl) => !!fl.amount),
      filters,
    }),
  });

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', gap: 2 }}>
      <Box sx={{ display: { xs: 'none', md: 'contents' } }}>
        <Filter filters={data?.filters} />
      </Box>
      <Stack direction={'row'} flexWrap="wrap" flex={1} gap="20px" height="fit-content" justifyContent={'center'}>
        {data?.items.map((flower) => <FlowerCard key={flower.id} flower={flower} onClick={setSelectedFlower} />)}
      </Stack>
      <Dialog
        open={mobileFilterOpen}
        onClose={() => toggleMobileFilter(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Filter
            filters={data?.filters}
            onClose={() => toggleMobileFilter(false)}
            fullWidth
          />
        </DialogContent>
      </Dialog>
      <FlowerDetails
        open={!!selectedFlower}
        onClose={() => setSelectedFlower(undefined)}
        flower={selectedFlower}
      />
    </Box>
  );
}
