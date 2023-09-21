import { useDispatch } from "react-redux";
import { API } from "../../api/api"
import { updateTime, updateUser } from "../../store/store";

export const Login = () => {
    const dispatch = useDispatch()
    const auth = async () => {
        const account = await API.login();
        console.log(account)
        const time = await API.getTime();
        dispatch(updateTime(time))
        dispatch(updateUser(account))
    }
    return <div>
        <button onClick={auth}>Войти</button>
    </div>
}   