import { Order, Product, Refound, Shop, User } from "../types";

export const APIlogin = async (login: string, password: string) => {
    const raw = await fetch('http://localhost:3002/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({login, password})
    })
    return await raw.json() as User;
}

export const APIgetProducts = async () => {
    const raw = await fetch('http://localhost:3002/getProducts', {
        method: 'GET',
    })
    return await raw.json() as Product[];
}

export const APIgetShops = async () => {
    const raw = await fetch('http://localhost:3002/getShops', {
        method: 'GET',
    })
    return await raw.json() as Shop[];
}

export const APIbuy = async (login: string, name: string, shop: string, count: number,) => {
    const raw = await fetch('http://localhost:3002/boy', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({login, name, shop, count})
    })
    return true;
}

export const APIcreateProduct = async (login: string, name: string, provider: string, date: string, expired: number, temp0: number, temp1: number, count: number, basePrice: number,) => {
    const raw = await fetch('http://localhost:3002/createProduct', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},

        body: JSON.stringify({login, name, provider, date, expired, temp0, temp1, count, basePrice})
    })
    return await raw.json() as Product[];
}

export const APIcreateOrder = async (login: string, name: string, count: number) => {
    const raw = await fetch('http://localhost:3002/createOrder', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},

        body: JSON.stringify({login, name, count})
    })
    return await raw.json() as Order[];
}

export const APIdelivery = async (login: string, name: string) => {
    const raw = await fetch('http://localhost:3002/delivery', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({login, name})
    })
    return await raw.json() as Product;
}

export const APIacceptOrder = async (login: string, name: string, isAccept: boolean) => {
    const raw = await fetch('http://localhost:3002/acceptOrder', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({login, name, isAccept})
    })
    return true;
}

export const APIrefound = async (login: string, name: string) => {
    const raw = await fetch('http://localhost:3002/refound', {
        headers: {'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify({login, name})
    })
    return true;
}

export const APIacceptRefound= async (login: string, isAccept:boolean, name: string) => {
    const raw = await fetch('http://localhost:3002/acceptRefound', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({login, isAccept, name})
    })
    return true;
}

export const APIgetRefounds= async (login: string) => {
    const raw = await fetch('http://localhost:3002/getRefounds', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({login})
    })
    return await raw.json() as Refound[];
}