import { UsersService } from '@/entities/users/UsersService';
import { ConfirmDialog } from '@/shared/ConfirmDialog';
import type { User } from '@/shared/types/User';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { Box } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
} from '@mui/x-data-grid';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

export default function UsersTab() {
  const queryClient = useQueryClient();
  const { data } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: UsersService.getUsers,
  });

  const deleting = useMutation({
    mutationFn: UsersService.deleteUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      setDeleteUserId(undefined);
    },
  });

  const [deleteUserId, setDeleteUserId] = useState<string | number>();

  const columns: GridColDef<User>[] = useMemo(
    () => [
      { field: 'id', headerName: 'ID', width: 80 },
      { field: 'name', headerName: 'Name', flex: 1, minWidth: 150 },
      { field: 'email', headerName: 'Email', flex: 1, minWidth: 200 },
      { field: 'phone', headerName: 'Phone', width: 170 },
      { field: 'type', headerName: 'Type', width: 120 },
      {
        field: 'actions',
        type: 'actions',
        width: 80,
        getActions: ({ row }) => [
          <GridActionsCellItem
            key={`delete-${row.id}`}
            icon={<DeleteIcon />}
            label="Delete user"
            onClick={() => setDeleteUserId(row.id)}
            disabled={deleting.isPending}
          />,
        ],
      },
    ],
    [deleting.isPending]
  );

  return (
    <Box sx={{ height: 800, width: '100%' }}>
      <DataGrid
        disableColumnSorting
        disableColumnResize
        disableColumnSelector
        disableColumnMenu
        rows={data ?? []}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
      <ConfirmDialog
        open={deleteUserId !== undefined}
        onClose={confirmed => {
          if (confirmed && deleteUserId !== undefined) {
            deleting.mutate(deleteUserId);
          } else {
            setDeleteUserId(undefined);
          }
        }}
      />
    </Box>
  );
}
