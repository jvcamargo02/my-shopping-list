import { items } from '@prisma/client';

export interface Item {
    id: number,
    title: string,
    url: string,
    description: string,
    amount: number

}

export type TItemData = Omit<items, 'id'>;
export type TItemUpdate = Partial<items>;
