export type Flower = {
    id: number;
    itemId: number;
    name: string;
    category: string;
    color: string;
    price: number;
    amount: number;
    imageSrc?: string;
};

export type Category = {
    id: number;
    name: string;
}