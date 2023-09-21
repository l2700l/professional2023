import { useState } from "react";
import { useDispatch } from "react-redux";
import { APIlogin } from "../../api/api";
import { updateUser } from "../../store/store";

export const Login = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch()
    const auth = async () => {
        try {
            setError('')
            const account = await APIlogin(login, password);
            console.log(account)
            dispatch(updateUser(account))
        }catch(e) {
            // @ts-ignore
            setError(e.message)
        }
    }
    return <div>
        {error !== '' && <p>{error}</p>}
        <input value={login} onChange={e => setLogin(e.target.value)} />
        <input value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={auth}>Войти</button>
    </div>
}   