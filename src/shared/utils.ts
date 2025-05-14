import { Flower } from "./types/Flower";

export const calculateTotal = (items: [Flower, number][]) =>
    items.reduce((acc, [flower, amount]) => acc + amount * flower.price, 0);