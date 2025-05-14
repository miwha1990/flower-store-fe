import { Flower } from '@/shared/types/Flower';
import { StateCreator } from 'zustand'

type OrderItem = { item: Flower; amount: number };

export interface AppStateI {
  bucketItems: Map<Flower, number>;
  addBucketItem: (order: OrderItem) => void;
  removeBucketItem: (item: Flower) => void;
  changeBucketItem: (order: OrderItem) => void;
}

type Set = {
  (partial: unknown, replace?: false): void;
  (state: unknown, replace: true): void;
};

export const AppState = ((set: Set) => ({
  bucketItems: new Map(),
  addBucketItem: (order: OrderItem) =>
    set((state: AppStateI) => state.bucketItems.set(order.item, order.amount)),
  removeBucketItem: (item: Flower) =>
    set((state: AppStateI) => {
      state.bucketItems.delete(item)
      return state.bucketItems;
    }),
  changeBucketItem: (order: OrderItem) =>
    set((state: AppStateI) => state.bucketItems.set(order.item, order.amount)),
})) as StateCreator<AppStateI, [], []>;
