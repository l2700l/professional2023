export type UserType = {
    address: any;
    role: "owner" | "private" | "public" | "user";
    balance: {
        eth: string;
        cmon: any;
        private_balance: any;
        public_balance: any;
    }
}