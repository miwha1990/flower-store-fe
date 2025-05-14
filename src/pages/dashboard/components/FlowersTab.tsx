import { Flower } from '@/shared/types/Flower';
import { Box, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { AddFlowerModal } from './AddFlowerModal';
import { ConfirmDialog } from '@/shared/ConfirmDialog';
import { FlowersService } from '@/entities/flowers/FlowersService';

export default function FlowersTab() {
  const queryClient = useQueryClient()
  const { data } = useQuery<Flower[]>({
    queryKey: ['flowers'],
    queryFn: FlowersService.getFlowers,
  });

  const deleting = useMutation({
    mutationFn: FlowersService.deleteFlower,
    onSettled: async () => {
      return await queryClient.invalidateQueries({ queryKey: ['flowers'] })
    },
  });

  const [open, setOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | number>();
  const [selectedItem, setSelectedItem] = useState<Flower | undefined>();
  function handleEditClick(item: Flower) {
    return () => {
      setSelectedItem(item);
      setOpen(true);
    };
  }
  function handleDeleteClick(id: string | number) {
    return () => {
      setDeleteItemId(id);
    };
  }

  const columns: GridColDef<any[number]>[] = useMemo(
    () => [
      { field: 'id', headerName: 'ID', width: 40 },
      {
        field: 'name',
        headerName: 'Name',
        width: 170,
      },
      {
        field: 'price',
        headerName: 'Price',
        width: 70,
        type: 'number',
      },
      {
        field: 'amount',
        headerName: 'Amount',
        width: 90,
        type: 'number',
        renderCell: ({ value }) => value || 0,
      },
      {
        field: 'color',
        headerName: 'Color',
        width: 150,
        renderCell: (cell) => (
          <>
            <input type="color" disabled value={cell.value} />
            &nbsp;{cell.value}
          </>
        ),
      },
      {
        field: 'imageSrc',
        headerName: 'Image',
        renderCell: (cell) => (
          <img
            style={{ verticalAlign: 'middle' }}
            src={cell.value}
            alt="flower image"
            width="40"
          />
        ),
        width: 60,
      },
      {
        field: 'actions',
        type: 'actions',
        cellClassName: 'actions',
        renderHeader: () => (
          <Button variant="outlined" onClick={() => setOpen(true)}>
            + Add
          </Button>
        ),
        width: 120,
        getActions: ({ row }: { row: Flower }) => {
          return [
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(row)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(row.id)}
              color="inherit"
            />,
          ];
        },
      },
    ],
    []
  );

  return (
    <Box sx={{ height: 800, width: '100%' }}>
      <DataGrid
        disableColumnSorting
        disableColumnResize
        disableColumnSelector
        disableColumnMenu
        rows={data as any}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5]}
      />
      <AddFlowerModal
        open={open}
        setSelectedFlower={setSelectedItem}
        setOpen={setOpen}
        selectedFlower={selectedItem}
      />
      <ConfirmDialog
        open={!!deleteItemId}
        onClose={(flag: boolean) => {
          if (flag && deleteItemId) {
            deleting.mutate(deleteItemId)
          }
          setDeleteItemId(undefined);
        }}
      />
    </Box>
  );
}
