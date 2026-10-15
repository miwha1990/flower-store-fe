export type OrderItem = { itemId: number; quantity: number, item: any, unitPrice: number };
export enum OrderStatus {
	PENDING = "PENDING",
	PAID = "PAID",
	DELIVERED = "DELIVERED"
}
export type Order = {
	id?: number;
	userId: string;
	items: OrderItem[];
	status: OrderStatus;
	details: string;
};