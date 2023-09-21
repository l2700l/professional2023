import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { API } from "../../api/api"
import { Users } from "../../components/Users/Users"
import { RootStore, updateUser } from "../../store/store"

export const Private = () => {
    const [selected,setSelected] = useState('')
    const [error, setError] = useState('')
    const [requests,  setRequests] = useState<{user: string; text: string; }[]>([])
    const user = useSelector((state: RootStore) => state.user)
    const dispatch =useDispatch()
    useEffect(() => {
        const fetch = async () => {
            const data = await API.getRequests()
            setRequests(data);
        }
        fetch()
    },[])
    const approve = async (address: string,isAccept: boolean) => {
        setError('')
        try {
            await API.approveRequest(address, isAccept);
            const data = await API.getRequests()
            const balance = await API.getBalance(user.address)
            dispatch(updateUser({...user, balance}))
            setRequests(data);
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
            <option value='whitelist'>
                Заявки
            </option>
            <option value='check'>
                Просмотр пользователей
            </option>
        </select>
        <br/>
        {error !== '' && <p>{error}</p>}
        {selected === 'whitelist' && <div>
            {requests.map((request)=> <div>
                <p>адрес: {request.user}</p>
                <p>имя: {request.text}</p>
                <button onClick={() => approve(request.user, true)}>Принять</button>
                <button onClick={() => approve(request.user, false)}>Отклонить</button>
                <br/>
                </div>)}           
        </div>}
        {selected === 'check' && <Users/>}
    </div>
}