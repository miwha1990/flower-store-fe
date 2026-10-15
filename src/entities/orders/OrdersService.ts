import { API } from '@/api';
import type { Order, OrderItem } from '@/shared/types/Order';
import { OrderStatus } from '@/shared/types/Order';

export type OrderActionState = {
  data: Order | null;
  error: unknown;
};

export class OrdersService {
  static getOrders() {
    return API.get<Order[]>('orders');
  }

  static getOrder(id: string | number) {
    return API.get<Order>(`orders/${id}`);
  }

  static deleteOrder(id: string | number) {
    return API.delete('orders/' + id);
  }

  static createOrder(userId: number | undefined, items: OrderItem[]) {
    return async (
      previousState: OrderActionState,
      formData: FormData
    ): Promise<OrderActionState> => {
      if (userId === undefined) {
        return {
          ...previousState,
          error: 'You must be signed in to place an order.',
        };
      }

      const details = {
        email: formData.get('email'),
        name: formData.get('name'),
        phone: formData.get('phone_client'),
        recipientPhone: formData.get('phone_recipient'),
        description: formData.get('description'),
        address: formData.get('delivery_address'),
        recipient: formData.get('recipient'),
      };
      const order: Order = {
        userId: String(userId),
        items,
        status: OrderStatus.PENDING,
        details: JSON.stringify(details),
      };

      try {
        const response = await API.post<Order>('orders', order);
        return { data: response, error: null };
      } catch (error: unknown) {
        return { ...previousState, error };
      }
    };
  }
  static editOrder(id: number) {
    return async (prevState: any, status: OrderStatus) => {
      try {
        const response = await API.patch<Order>('orders/' + id, { status });
        return { data: response, error: null };
      } catch (error: unknown) {
        return { ...prevState, error: error };
      }
    };
  }
}
