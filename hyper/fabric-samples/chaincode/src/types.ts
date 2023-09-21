/*
 * SPDX-License-Identifier: Apache-2.0
 */

export class Product {
    public name: string;
    public provider: string;
    public date: string;
    public expired: number;
    public temp0: number;
    public temp1: number;
    public temps?: number[];
    public count: number;
    public basePrice: number;
    public price?: number; 
    public shop?: string;
}

export class BasicUser {
    public login: string;
    public password: string;
    public role: 'shop' | 'user' | 'provider';
    public balance: number;
    public products: Product[] = [];
}

export class User extends BasicUser {
    fio: string;
}

export class Shop extends BasicUser {
    city?: string;
}

export class Order {
    user: Shop;
    product: Product;
    count: number;
}
export class Refound {
    user: User;
    product: Product;
    
}