import { BigNumber, ethers } from "ethers";
import token from './token.json';

export class API {
    static provider: ethers.providers.Web3Provider;
    static accounts: any[];
    static signer: ethers.providers.JsonRpcSigner;
    static contract: ethers.Contract;

    static async login() {
        // @ts-ignore
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log(1)
        this.signer = this.provider.getSigner();
        this.accounts = await this.provider.send('eth_requestAccounts', []);
        // @ts-ignore
        this.contract = new ethers.Contract(process.env.REACT_APP_API, token.abi, this.signer)
        console.log(2)
        const role = await this.getRole(this.accounts[0])
        console.log(4)
        const balance = await this.getBalance(this.accounts[0])
        console.log(3)
        return {address: this.accounts[0], role, balance};
    }
    static async getRole(address: string) {
        const roleNum =  await this.contract.roles(address);
        switch (roleNum) {
            case 0:
              return 'owner'
            case 1:
              return 'private'
            case 2:
              return 'public'
            case 3:
              return 'user'
        }
        return 'user'
    }
    static async getPhase() {
        const phaseNum =  await this.contract.currentPhase();
        switch (phaseNum) {
            case 0:
              return 'seed'
            case 1:
              return 'private'
            case 2:
              return 'public'
        }
        return 'public'
    }
    static async getBalance(address: string) {
        const eth = (await this.provider.getBalance(address)).toString()
        const cmon = (await this.contract.balanceOf(address)).toNumber()
        const public_balance = (await this.contract.publicTokens(address)).toNumber();
        const private_balance = (await this.contract.privateTokens(address)).toNumber();
        return {eth, cmon, private_balance, public_balance}
    }
    static async getTime() {
        console.log((await this.contract.timeStart()).toNumber(), (await this.provider.getBlock(this.provider.blockNumber)).timestamp)
        const time = (await this.contract.getTime()).toNumber();
        const phase = await this.getPhase()
        return {time,phase}
    }
    static async getCost() {
        return (await this.contract.cost()).toNumber();
    }
    static async getUsers() {
        const users: {address: string, balance: {eth: string, cmon: number, public_balance: number, private_balance: number}}[] = [];
        let i = 0;
        while (true) {
            try {
                const address = await this.contract.users(i);
                const balance = await this.getBalance(address);
                users.push({address, balance});
                i++;
            } catch (e) {
                break;
            }
        }
        return users;
    }
    static async getRequests() {
        const users: {user: string, text: string}[] = [];
        let i = 0;
        while (true) {
            try {
                const user = await this.contract.requestsAddresses(i);
                const text = await this.contract.requests(user)
                users.push({user, text});
                i++;
            } catch (e) {
                break;
            }
        }
        return users;
    }


    static async transfer(to: string, amount: number) {
        const tx = await this.contract.transfer(to, amount)
        await tx;
    }
    static async transferFrom(from: string, to: string, amount: number) {
        const tx = await this.contract.transferFrom(from, to, amount)
        await tx.wait();
    }
    static async createRequest(text: string) {
        const tx = await this.contract.createRequest(text);
        await tx.wait();
    }
    static async approveRequest(addr: string, isAccept: boolean) {
        const tx = await this.contract.approveRequest(addr, isAccept)
        await tx.wait();
    }
    static async buy(amount: number) {
        const sum = amount * await this.getCost();
        const options = {value: BigNumber.from(sum.toString())};
        const tx = await this.contract.buy(amount, options)
        await tx.wait();
    }
    static async setAllow(to: string, amount: number) {
        const tx = await this.contract.setAllow(to, amount)
         await tx.wait();
    }
    static async setCost(newCost: string) {
        const tx = await this.contract.setCost(ethers.utils.parseEther(newCost))
        await tx.wait();
    }
    static async setPrivatePhase() {
        const tx = await this.contract.setPrivatePhase()
        await tx.wait();
    }
    static async setPublicPhase() {
        const tx = await this.contract.setPublicPhase()
        await tx.wait();
    }
    static async timeTravel() {
        const tx = await this.contract.timeTravel(3)
        await tx.wait();
    }
}