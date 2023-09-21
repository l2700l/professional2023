/*
 * SPDX-License-Identifier: Apache-2.0
 */

export type Product = {
    name: string;
     provider: string;
     date: string;
     expired: number;
     temp0: number;
     temp1: number;
     temps?: number[];
     count: number;
     basePrice: number;
     price?: number; 
     shop?: string;
}

export type BasicUser = {
     login: string;
     password: string;
     role: 'shop' | 'user' | 'provider';
     balance: number;
     products: Product[];
}

export type User = BasicUser & {
    fio: string;
}

export type Shop  = BasicUser & {
    city?: string;
}

export type Order = {
    user: Shop;
    product: Product;
    count: number;
}
export type Refound = {
    user: User;
    product: Product;
    
}