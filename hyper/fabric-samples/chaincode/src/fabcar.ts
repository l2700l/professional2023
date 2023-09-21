/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { Context, Contract } from 'fabric-contract-api';
import { Order } from './types/Order';
import { Product } from './types/Product';
import { Refound } from './types/Refound';
import { User } from './types/User';

export class Placemarket extends Contract {

    public async initLedger(ctx: Context) {
        console.info('============= START : Initialize Ledger ===========');
        const users: User[] = [
            {
                login: '1',
                password: '1',
                balance: 1000,
                role: 'shop',
                products: [],
                city: 'Дмитров'
            },
            {
                login: '2',
                password: '2',
                balance: 900,
                role: 'shop',
                products: [],
                city: 'Калуга'
            },
            {
                login: '3',
                password: '3',
                balance: 950,
                role: 'shop',
                products: [],
                city: 'Москва'
            },
            {
                login: '4',
                password: '4',
                balance: 700,
                role: 'shop',
                products: [],
                city: 'Рязань'
            },
            {
                login: 'goldfish',
                password: 'goldfish',
                balance: 100,
                role: 'provider',
                products: [],
            },
            {
                login: 'roman',
                password: 'roman',
                balance: 100,
                role: 'user',
                products: [],
                fio: 'Романов Роман Романович'
            },
            {
                login: 'nikola',
                password: 'nikola',
                balance: 100,
                role: 'user',
                products: [],
                fio: 'Николаев Николай Николаевич'
            },
        ];

        for (let i = 0; i < users.length; i++) {
            await ctx.stub.putState('USER-' + users[i].login, Buffer.from(JSON.stringify(users[i])));
            console.info('Added <--> ', users[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    // region provider

    public async createProduct(ctx: Context, login: string, password: string, productStringify: string) {
        const product = JSON.parse(productStringify);
        const provider = await this.getUser(ctx, login, password);
        if (provider.role !== 'provider') {
            throw new Error('Only provider can do this action');
        }
        const products = await this.getProducts(ctx);
        products.push({...product, price: product.basePrice});
        await ctx.stub.putState('PRODUCTS', Buffer.from(JSON.stringify(products)));
    }

    public async delivery(ctx: Context, shop: string, orderId: string, num: number) {
        const orders = await this.getOrders(ctx, shop);
        const order = orders.filter((order) => order.orderId === orderId)[0];
        if (num < order.product.temp0 || num > order.product.temp1) {
            order.product.price -= order.product.basePrice * 0.1;
        }
        if (!order.product.temps) {
            order.product.temps = [];
        }
        order.product.temps.push(num)
        const newOrders = orders.filter((order) => order.orderId !== orderId);
        newOrders.push(order);    

        await ctx.stub.putState('ORDER-'+shop, Buffer.from(JSON.stringify(newOrders)));
        return order;
    }

    // endregion

    // region shop

    public async createOrder(ctx: Context, login: string, password: string, productName: string, count: number) {
        const shop = await this.getUser(ctx, login, password);
        if (shop.role !== 'shop') {
            throw new Error('Only shop can do this action');
        }
        const products = await this.getProducts(ctx)
        const product = products.filter((product) => product.name === productName)[0];
        if (!product) {
            throw new Error('Product not found');
        }
        console.log(product)
        const provider = await this.getProvider(ctx);
        const k = count < 100 ? 1 : count < 1000 ? 0.95 : 0.9;
        if (shop.balance < count * k * product.basePrice) {
            throw new Error('Balance soo smaller');
        }
        shop.balance -= count * k * product.basePrice;
        provider.balance += count * k * product.basePrice;
        const orders = await this.getOrders(ctx, login);
        orders.push({
            orderId: login+'-'+productName,
            product: {...product, count},
            shop
        })
        
        await ctx.stub.putState('ORDER-'+login, Buffer.from(JSON.stringify(orders)));
        await ctx.stub.putState('USER-'+login, Buffer.from(JSON.stringify(shop)));
        await ctx.stub.putState('USER-'+provider.login, Buffer.from(JSON.stringify(provider)));
        return orders;
    }

    public async acceptOrder(ctx: Context, login: string, password: string, orderId: string, isAccept: boolean) {
        const shop = await this.getUser(ctx, login, password);
        if (shop.role !== 'shop') {
            throw new Error('Only shop can do this action');
        }
        const orders = await this.getOrders(ctx, login);
        const order = orders.filter((order) => order.orderId === orderId)[0];
        const newOrders = orders.filter((order) => order.orderId !== orderId);
        await ctx.stub.putState('ORDER-'+login, Buffer.from(JSON.stringify(newOrders)));
        if (isAccept) {
            shop.products.push({...order.product, price: order.product.price * 1.5, shop: login});
            await ctx.stub.putState('USER-'+login, Buffer.from(JSON.stringify(shop)));
        } else {
            const provider = await this.getProvider(ctx);
            const k = order.product.count < 100 ? 1 : order.product.count < 1000 ? 0.95 : 0.9;
            shop.balance -= order.product.count * k * order.product.basePrice;
            provider.balance += order.product.count * k * order.product.basePrice;
            await ctx.stub.putState('USER-'+login, Buffer.from(JSON.stringify(shop)));
            await ctx.stub.putState('USER-'+provider.login, Buffer.from(JSON.stringify(provider)));
        }
    }

    public async acceptRefound(ctx: Context, login: string, password: string, user: string, productName: string, isAccept: boolean) {
        const shop = await this.getUser(ctx, login, password);
        if (shop.role !== 'shop') {
            throw new Error('Only shop can do this action');
        }
        const refounds = await this.getRefounds(ctx, login);
        const refound = refounds.filter((refound) => refound.user.login === user && refound.product.name === productName)[0];
        const newRefounds = refounds.filter((refound) => refound.user.login !== user && refound.product.name !== productName);
        await ctx.stub.putState('REFOUNDS-'+login, Buffer.from(JSON.stringify(newRefounds)));
        if (!refound) {
            throw new Error('Refound not found');
        }
        if (isAccept) {
            const User = (await this.queryAll<User>(ctx, 'USER-'+user))[0];
            User.products = User.products.filter((product) => product.name !== productName);
            User.balance += refound.product.price * refound.product.count;
            shop.balance -= refound.product.price * refound.product.count;
            await ctx.stub.putState('USER-'+login, Buffer.from(JSON.stringify(shop)));
            await ctx.stub.putState('USER-'+user, Buffer.from(JSON.stringify(User)));
        }
    }

    // endregion

    // region user

    public async buy(ctx: Context, login: string, password: string, shop: string, productName: string, count: number) {
        const user = await this.getUser(ctx, login, password);
        const shopUser = await this.getShop(ctx, shop);
        const product = shopUser.products.filter((product) => product.name === productName)[0];
        const index = shopUser.products.indexOf(product);
        if (!product || product.count < count) {
            throw new Error('Count is soo big');
        }
        if (user.balance < product.price * count) {
            throw new Error('Balance soo smaller');
        }
        user.balance -= product.price * count;
        shopUser.balance += product.price * count
        user.products.push({...product, count});
        shopUser.products[index] = {...product, count: product.count - count};
        await ctx.stub.putState('USER-'+login, Buffer.from(JSON.stringify(user)));
        await ctx.stub.putState('USER-'+shop, Buffer.from(JSON.stringify(shopUser)));
    }

    public async createRefound(ctx: Context, login: string, password: string, productName: string) {
        const user = await this.getUser(ctx, login, password);
        const product = user.products.filter((product) => product.name === productName)[0];
        if (!product) {
            throw new Error('Product not found');
        }
        const refounds = await this.getRefounds(ctx, product.shop);
        const refound = {
            user,
            product
        } as Refound;
        refounds.push(refound);
        await ctx.stub.putState('REFOUNDS-'+product.shop, Buffer.from(JSON.stringify(refounds)));
    }

    // region get

    public async getUser(ctx: Context, login: string, password: string): Promise<User> {
        const user = (await this.queryAll<User>(ctx, 'USER-'+login))[0];
        if (user && user.password === password) {
            return user;
        }
        throw new Error('Uncorrect login/password');
    }

    public async getProvider(ctx: Context): Promise<User> {
        const users = await this.queryAll<User>(ctx, 'USER-')
        let user: User;
        for (let i = 0; i<users.length; i++) {
            if (users[i].role === 'provider') {
                user = users[i];
            }
        }
        return user;
    }

    public async getShops(ctx: Context): Promise<User[]> {
        const users = await this.queryAll<User>(ctx, 'USER-')
        let shops: User[] = [];
        for (let i = 0; i<users.length; i++) {
            if (users[i].role === 'shop') {
                shops.push(users[i]);
            }
        }
        return shops;
    }

    public async getShop(ctx: Context, shop: string): Promise<User> {
        const shops = await this.getShops(ctx);
        for (let i = 0; i<shops.length; i++) {
            if (shops[i].login === shop) return shops[i];
        }
    }

    public async getProducts(ctx: Context): Promise<Product[]> {
        const products = (await this.queryAll<Product[]>(ctx, 'PRODUCTS'))[0];
        if (products) return products;
        return []
    }

    public async getRefounds(ctx: Context, shop: string): Promise<Refound[]> {
        const refounds = (await this.queryAll<Refound[]>(ctx, 'REFOUNDS-'+shop))[0];
        if (refounds) return refounds;
        return []
    }

    public async getOrders(ctx: Context, shop: string): Promise<Order[]> {
        const orders = (await this.queryAll<Order[]>(ctx, 'ORDER-'+shop))[0];
        if (orders) return orders;
        return []
    }

    public async queryAll<T = string>(ctx: Context, prefix: string): Promise<T[]> {
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange('', '')) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            if (key.startsWith(prefix)) {
                allResults.push(record as T);
            }
        }
        console.info(allResults);
        return allResults;
    }

    // endregion
}
