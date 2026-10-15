import { Flower } from '@/shared/types/Flower';
import { createJSONStorage, persist } from 'zustand/middleware';

type OrderItem = { item: Flower; amount: number };

export interface AppStateI {
  bucketItems: Map<Flower, number>;
  deliveryAddress?: string;
  updateDeliveryAddress: (address: string) => void;
  addBucketItem: (order: OrderItem) => void;
  removeBucketItem: (item: Flower) => void;
  changeBucketItem: (order: OrderItem) => void;
}

type SerializedAppState = {
  bucketItems: [Flower, number][];
  deliveryAddress?: string;
};

export const AppState = persist<AppStateI, [], [], SerializedAppState>(
  (set) => ({
    bucketItems: new Map(),
    addBucketItem: (order: OrderItem) =>
      set((state) => {
        const bucketItems = new Map(state.bucketItems);
        for (const item of bucketItems.keys()) {
          if (item.id === order.item.id) {
            bucketItems.delete(item);
            break;
          }
        }
        bucketItems.set(order.item, order.amount);
        return { bucketItems };
      }),
    removeBucketItem: (item: Flower) =>
      set((state) => {
        const bucketItems = new Map(state.bucketItems);
        for (const existingItem of bucketItems.keys()) {
          if (existingItem.id === item.id) {
            bucketItems.delete(existingItem);
            break;
          }
        }
        return { bucketItems };
      }),
    changeBucketItem: (order: OrderItem) =>
      set((state) => {
        const bucketItems = new Map(state.bucketItems);
        for (const item of bucketItems.keys()) {
          if (item.id === order.item.id) {
            bucketItems.delete(item);
            break;
          }
        }
        bucketItems.set(order.item, order.amount);
        return { bucketItems };
      }),
    updateDeliveryAddress: (address: string) =>
      set((state) => ({
        deliveryAddress: address,
      })),
  }),
  {
    name: 'flower-store-cart',
    storage: createJSONStorage<SerializedAppState>(() => localStorage),
    partialize: (state) => ({
      bucketItems: [...state.bucketItems.entries()],
      deliveryAddress: state.deliveryAddress,
    }),
    merge: (persistedState, currentState) => {
      const persisted = persistedState as Partial<SerializedAppState> | undefined;
      return {
        ...currentState,
        bucketItems: new Map(persisted?.bucketItems ?? []),
        deliveryAddress: persisted?.deliveryAddress ?? currentState.deliveryAddress,
      };
    },
  }
);
