import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { API } from "../../api/api"
import { RootStore, updateUser } from "../../store/store"

export const User = () => {
    const [selected,setSelected] = useState('')
    const [to,setTo] = useState('')
    const [amount,setAmount] = useState(0)
    const [from, setFrom] = useState('')
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const user = useSelector((state: RootStore) => state.user)
    const dispatch =useDispatch()
    const transfer = async ()=> {
        setError('')
        try {
        await API.transfer(to, amount)
        const balance = await API.getBalance(user.address)
            dispatch(updateUser({...user, balance}))
        } catch (e) {
            // @ts-ignore
            setError(e.message)
        }
    }
    const transferfrom = async ()=> {
        setError('')
        try {
        await API.transferFrom(from, to, amount)
        const balance = await API.getBalance(user.address)
            dispatch(updateUser({...user, balance}))
        } catch (e) {
            // @ts-ignore
            setError(e.message)
        }
    }
    const allow = async ()=> {
        setError('')
        try {
        await API.setAllow(to, amount)
        const balance = await API.getBalance(user.address)
            dispatch(updateUser({...user, balance}))
        } catch (e) {
            // @ts-ignore
            setError(e.message)
        }
    }
    const whitelist = async ()=> {
        setError('')
        try {
        await API.createRequest(name)
        const balance = await API.getBalance(user.address)
            dispatch(updateUser({...user, balance}))
        } catch (e) {
            // @ts-ignore
            setError(e.message)
        }
    }
    const buy = async ()=> {
        setError('')
        try {
        await API.buy(amount)
        const balance = await API.getBalance(user.address)
            dispatch(updateUser({...user, balance}))
        } catch (e) {
            // @ts-ignore
            setError(e.message)
        }
    }

    return <div>
        <br/>
        <select onChange={e => setSelected(e.target.value)}>
            <option value=''>
                Выбрать
            </option>
            <option value='transfer'>
                Передать
            </option>
            <option value='transferfrom'>
                Передать чужие
            </option>
            <option value='allow'>
                Разрешить распоряжаться
            </option>
            <option value='whitelist'>
                Подать заявку
            </option>
            <option value='buy'>
                Купить
            </option>
        </select>
        <br/>
        {error !== '' && <p>{error}</p>}
        {selected === 'transfer' && <div>
            <label>Кому</label>
            <input value={to} onChange={e => setTo(e.target.value)}/>
            <label>Сколько</label>
            <input value={amount} onChange={e => setAmount(+e.target.value)}/>
            <button onClick={transfer}>Передать</button>
        </div>}
        {selected === 'transferfrom' && <div>
            <label>От кого</label>
            <input value={from} onChange={e => setFrom(e.target.value)}/>
            <label>Кому</label>
            <input value={to} onChange={e => setTo(e.target.value)}/>
            <label>Сколько</label>
            <input value={amount} onChange={e => setAmount(+e.target.value)}/>
            <button onClick={transferfrom}>Передать</button>
        </div>}
        {selected === 'allow' && <div>
            <label>Кому</label>
            <input value={to} onChange={e => setTo(e.target.value)}/>
            <label>Сколько</label>
            <input value={amount} onChange={e => setAmount(+e.target.value)}/>
            <button onClick={allow}>Разрешить</button>
        </div>}
        {selected === 'whitelist' && <div>
            <label>Имя</label>
            <input value={name} onChange={e => setName(e.target.value)}/>
            <button onClick={whitelist}>Подать</button>
        </div>}
        {selected === 'buy' && <div>
            <label>Сколько</label>
            <input value={amount} onChange={e => setAmount(+e.target.value)}/>
            <button onClick={buy}>Купить</button>
        </div>}
    </div>
}