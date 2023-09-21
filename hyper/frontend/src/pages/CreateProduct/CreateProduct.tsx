import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { APIcreateProduct } from "../../api/api"
import { RootStore, updateUser } from "../../store/store"

export const CreateProduct = () => {
    const [error, setError] = useState('')
    const [name, setName] =useState('');
    const [provider, setprovider] =useState('');
    const [date, setdate] =useState('');
    const [expired, setexpired] =useState('0');
    const [temp0, settemp0] =useState('0');
    const [temp1, settemp1] =useState('0');
    const [count, setcount] =useState('0');
    const [basePrice, setbasePrice] =useState('0');

    const user = useSelector((state: RootStore) => state.user)
    const create = async () => {
        setError('')
        try {
            await APIcreateProduct(user.login, name, provider, date, +expired, +temp0, +temp1, +count, +basePrice)
        } catch (e) {
            // @ts-ignore
            setError(e.message)
        }
    }
    return <div>
        <br/>
        {error !== '' && <p>{error}</p>}
        <input value={name} onChange={e => setName(e.target.value)}/>
        <input value={provider} onChange={e => setprovider(e.target.value)}/>
        <input value={date} onChange={e => setdate(e.target.value)}/>
        <input value={expired} onChange={e => setexpired(e.target.value)}/>
        <input value={temp0} onChange={e => settemp0(e.target.value)}/>
        <input value={temp1} onChange={e => settemp1(e.target.value)}/>
        <input value={count} onChange={e => setcount(e.target.value)}/>
        <input value={basePrice} onChange={e => setbasePrice(e.target.value)}/>
        <button onClick={create}>Создать</button>
    </div>
}