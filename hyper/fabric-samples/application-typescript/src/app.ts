/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import { Contract, Gateway, GatewayOptions } from 'fabric-network';
import * as path from 'path';
import { buildCCPOrg1, buildWallet, prettyJSONString } from './utils/AppUtil';
import { buildCAClient, enrollAdmin, registerAndEnrollUser } from './utils/CAUtil';
import * as express from 'express';
const channelName = 'blockchain2023';
const chaincodeName = 'placemarket';
const mspOrg1 = 'Users';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'appUser';
let contract: Contract;
import * as cors from 'cors';
const app = express()
app.use(express.json())
// app.use(cors())
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})
app.get('/getUser', async (req, res) => {
    try {
        console.log(req.body)
    const result = await contract.evaluateTransaction('getUser', req.body.login, req.body.password);
    res.send(result.toString());
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

app.get('/getShops', async (req, res) => {
    const result = await contract.evaluateTransaction('getShops');
    res.send(result.toJSON());
})
app.get('/getProducts', async (req, res) => {
    const result = await contract.evaluateTransaction('getProducts');
    res.send(result.toString());
})
app.post('/getOrders', async (req, res) => {
    try {
    const result = await contract.evaluateTransaction('getOrders', req.body.login);
    res.send(result.toString());
} catch (e) {
    res.status(500).send(e)
}
})
app.post('/getRefounds', async (req, res) => {
    try {
    const result = await contract.evaluateTransaction('getRefounds', req.body.login);
    res.send(result.toString());
} catch (e) {
    res.status(500).send(e)
}
})

app.post('/createProduct', async (req, res) => {
    try {
    const result = await contract.submitTransaction('createProduct', req.body.login, req.body.password, JSON.stringify({name: req.body.name, provider: req.body.provider, date: req.body.date, expired: req.body.expired, temp0: req.body.temp0, temp1: req.body.temp1, count: req.body.count, basePrice: req.body.basePrice, unit: req.body.unit}));
    res.send(result.toString());
} catch (e) {
    console.log(e)
    res.status(500).send(e)
}
})
app.post('/createOrder', async (req, res) => {
 try {
    const result = await contract.submitTransaction('createOrder', req.body.login, req.body.password, req.body.productName, req.body.count);
    res.send(result.toString());
} catch (e) {
    res.status(500).send(e)
}
})
app.post('/delivery', async (req, res) => {
try {
    const num = (Math.random()*50) * (Math.random() > 0.5 ? 1 : -1)
    const result = await contract.submitTransaction('delivery', req.body.shop, req.body.orderId, num.toString());
    res.send(result.toString());
} catch (e) {
    res.status(500).send(e)
}
})
app.post('/acceptOrder', async (req, res) => {
try {
    const result = await contract.submitTransaction('acceptOrder', req.body.login, req.body.password, req.body.orderId, req.body.isAccept);
    res.send(result.toString());
} catch (e) {
    res.status(500).send(e)
}
})
app.post('/buy', async (req, res) => {
try {
    const result = await contract.submitTransaction('buy', req.body.login, req.body.password, req.body.shop, req.body.productName, req.body.count);
    res.send(result.toString());
} catch (e) {
    res.status(500).send(e)
}
})
app.post('/refound', async (req, res) => {
try {
    const result = await contract.submitTransaction('createRefound', req.body.login, req.body.password, req.body.productName);
    res.send(result.toString());
} catch (e) {
    res.status(500).send(e)
}
})
app.post('/acceptRefound', async (req, res) => {
try {
    const result = await contract.submitTransaction('acceptRefound', req.body.login, req.body.password, req.body.user, req.body.productName, req.body.isAccept);
    res.send(result.toString());
} catch (e) {
    res.status(500).send(e)
}
})

async function main() {
    try {
        const ccp = buildCCPOrg1();
        const caClient = buildCAClient(ccp, 'ca.org1.example.com');
        const wallet = await buildWallet(walletPath);
        await enrollAdmin(caClient, wallet, mspOrg1);
        await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');
        const gateway = new Gateway();
        const gatewayOpts: GatewayOptions = {
            wallet,
            identity: org1UserId,
            discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
        };
        await gateway.connect(ccp, gatewayOpts);
        const network = await gateway.getNetwork(channelName);
        contract = network.getContract(chaincodeName);
    } catch (error) {
        console.error(`******** FAILED to run the application: ${error}`);
    }
}

main();
app.listen(3002, () => console.log('server has been started'))
