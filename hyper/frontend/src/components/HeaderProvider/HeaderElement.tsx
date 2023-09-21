import { useDispatch, useSelector } from "react-redux"
import { RootStore, updateUser } from "../../store/store"
import { Shop, User } from "../../types"
import { Shops } from "../Shops/Shops"

export const HeaderElement = () => {
    const user = useSelector((state: RootStore) => state.user)
    const dispatch =useDispatch()
    const unauth = () => {
        window.location.href='#'
        dispatch(updateUser({}))
    }
    return (
        <div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
               <p>Login: {user.login}</p>
               <p>Balance: {user.balance}</p>
               {user.role === 'shop' && (user as Shop).city !== '' && 
                <p>City: {(user as Shop).city}</p>}
            </div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <p>Role: {user.role}</p>
                {user.role === 'user' && (user as User).fio !== '' && 
                <p>FIO: {(user as User).fio}</p>}
            </div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <button onClick={unauth}>Выйти</button>
            </div>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                <a href='#products'>Товары</a>
                {user.role === 'provider' && <a href='#create'>Создать продукт</a>}
                {user.role === 'shop' && <a href='#order'>Заказать продукт</a>}
                {user.role === 'shop' && <a href='#refounds'>Возвраты</a>}
            </div>
            <div><br/><Shops/></div>
        </div>
    )
}