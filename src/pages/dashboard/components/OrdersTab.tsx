import { OrdersService } from '@/entities/orders/OrdersService';
import { ConfirmDialog } from '@/shared/ConfirmDialog';
import { Order, OrderItem, OrderStatus } from '@/shared/types/Order';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import { Badge, Box } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { EditOrderModal } from './EditOrderModal';

export default function OrdersTab() {
  const queryClient = useQueryClient()
  const { data } = useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: OrdersService.getOrders,
  });

  console.log(data, 'data')

  const deleting = useMutation({
    mutationFn: OrdersService.deleteOrder,
    onSettled: async () => {
      return await queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  });

  const [open, setOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | number>();
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();
  function handleEditClick(item: Order) {
    return () => {
      setSelectedOrder(item);
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
        field: 'details',
        headerName: 'Phone Client',
        width: 170,
        valueGetter: (value) => {
          return value && JSON.parse(value)?.phone || '';
        }
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 100,
        valueGetter: (value: OrderStatus) => {
          switch (value) {
            case OrderStatus.PENDING:
              return { text: value, color: '#ff9800' };
            case OrderStatus.PAID:
              return { text: value, color: '#2196f3' };
            case OrderStatus.DELIVERED:
              return { text: value, color: '#4caf50' };
            default:
              return { text: value, color: '#000000' };
          }
        },
        renderCell: ({ value }) => {
          return (<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>{value.text}
            <Badge variant="dot" sx={{ '& .MuiBadge-badge': { bgcolor: value.color } }} />
          </Box>)
        }
      },
      {
        field: 'items',
        headerName: 'Total Price, UAH',
        width: 140,
        type: 'number',
        renderCell: ({ value }) => value?.reduce((acc: number, item: OrderItem) => acc + (item.unitPrice * item.quantity), 0) || 0,
      },
      {
        field: 'createdAt',
        headerName: 'Created At',
        width: 180,
        type: 'dateTime',
        valueGetter: (value: unknown) => {
          if (!value) return null;
          const date = value instanceof Date ? value : new Date(String(value));
          return Number.isNaN(date.getTime()) ? null : date;
        },
      },
      {
        field: 'actions',
        type: 'actions',
        cellClassName: 'actions',
        width: 120,
        getActions: ({ row }: { row: Order }) => {
          return [
            <GridActionsCellItem
              key={`edit-${row.id}`}
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(row)}
              color="inherit"
            />,
            <GridActionsCellItem
              key={`delete-${row.id}`}
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(row.id!)}
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
      <EditOrderModal
        open={open}
        order={selectedOrder}
        onClose={() => {
          setOpen(false);
          setSelectedOrder(undefined);
        }}
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
