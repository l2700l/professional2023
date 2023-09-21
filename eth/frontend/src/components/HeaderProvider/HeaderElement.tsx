import { useDispatch, useSelector } from "react-redux"
import { API } from "../../api/api"
import { RootStore, updateTime, updateUser } from "../../store/store"
import { useEffect } from 'react';

export const HeaderElement = () => {
    const user = useSelector((state: RootStore) => state.user)
    const time = useSelector((state: RootStore) => state.time)
    const dispatch =useDispatch()
    const travel = async () =>{
        await API.timeTravel();
        await update()
    }
    
    const update = async () => {
        const time = await API.getTime();
        if (time.time >= 5 && time.phase == 'seed') {
            await API.setPrivatePhase()
        }
        if (time.time >= 10 && time.phase == 'private') {
            await API.setPublicPhase()
        }
        const balance = await API.getBalance(user.address)
        console.log(time)
        dispatch(updateUser({...user, balance}))
        dispatch(updateTime(time))
    }
    const unauth = () => {
        window.location.href='#'
        dispatch(updateUser({}))
    }
    
    useEffect(() => {
        const interval = setInterval(update,1000)
        return () => clearInterval(interval)
    }, [])
    return (
        <div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <p>
                    адрес: {user.address}
                </p>
                <p>
                    eth: {`${user.balance.eth.slice(0, user.balance.eth.length-18)}.${user.balance.eth.slice(18, user.balance.eth.length)}`}
                </p>
                <p>
                    время системы: {time.time}
                </p>
                {time.time > 4 && <p>время private: {time.time-5}</p>}
            </div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <p>
                    роль: {user.role}
                </p>
                <p>
                    cmon: {user.balance.cmon}
                </p>
                <p>фаза: {time.phase}</p>
                {time.time > 9 && <p>время public: {time.time-10}</p>}
            </div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <button onClick={travel}>Перемотать время</button>
                <button onClick={unauth} >Выйти</button>
            </div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                {user.role==='owner' && <a href='#owner'>Панель владельца</a>}
                {user.role==='private' && <a href='#private'>Панель private провайдера</a>}
                {user.role==='public' && <a href='#public'>Панель public провайдера</a>}
                <a href='#user'>Панель пользователя</a>
            </div>
        </div>
    )
}