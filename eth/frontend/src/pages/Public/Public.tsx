import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { API } from "../../api/api"
import { Users } from "../../components/Users/Users"
import { RootStore, updateUser } from "../../store/store"

export const Public = () => {
    const [selected,setSelected] = useState('')
    const [to,setTo] = useState('')
    const [amount,setAmount] = useState('0')
    const [error, setError] = useState('')
    const user = useSelector((state: RootStore) => state.user)
    const dispatch =useDispatch()
    const transfer = async ()=> {
        setError('')
        try {
        await API.transfer(to, +amount)
        const balance = await API.getBalance(user.address)
            dispatch(updateUser({...user, balance}))
        } catch (e) {
            // @ts-ignore
            setError(e.message)
        }
    }
    const change = async ()=> {
        setError('')
        try {
        await API.setCost(amount)
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
                Вознаградить
            </option>
            <option value='check'>
                Просмотр пользователей
            </option>
            <option value='change'>
                Изменить цену
            </option>
        </select>
        <br/>
        {error !== '' && <p>{error}</p>}
        {selected === 'transfer' && <div>
            <label>Кому</label>
            <input value={to} onChange={e => setTo(e.target.value)}/>
            <label>Сколько</label>
            <input value={amount} onChange={e => setAmount(e.target.value)}/>
            <button onClick={transfer}>Вознаградить</button>
        </div>}
        {selected === 'change' && <div>
            <label>Новая цена</label>
            <input value={amount} onChange={e => setAmount(e.target.value)}/>
            <button onClick={change}>Установить</button>
        </div>}
        {selected === 'check' && <Users/>}

    </div>
}