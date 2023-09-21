import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { API } from "../../api/api"
import { RootStore } from "../../store/store"

export const Users = () => {
    const thisUser = useSelector((state: RootStore) => state.user)
    const [users, setUsers]= useState<{
        address: string;
        balance: {
            eth: string;
            cmon: number;
            public_balance: number;
            private_balance: number;
        }}[]>([])
    useEffect(() => {
        const fetch = async () => {
            const data = await API.getUsers()
            setUsers(data)
        }
        fetch()
    }, [])
    return (<div>
        {users.map((user) => <div>
            <p>адрес: {user.address}</p>
            {thisUser.role ==='owner' || thisUser.role === 'private' && <p>private: {user.balance.private_balance}</p>}
            {thisUser.role ==='owner' || thisUser.role === 'public' && <p>public: {user.balance.public_balance}</p>}
            <br/>
        </div>)}
    </div>)
}