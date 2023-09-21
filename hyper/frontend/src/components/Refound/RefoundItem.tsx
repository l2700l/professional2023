import { useDispatch, useSelector } from "react-redux";
import { APIacceptRefound, APIlogin } from "../../api/api";
import { RootStore, updateUser } from "../../store/store";
import { Refound } from "../../types";

export const RefoundItem: React.FC<{refound: Refound}> = ({refound}) => {
    const user = useSelector((state: RootStore) => state.user)
    const dispatch = useDispatch()
    const accept = async (isAccept: boolean) => {
        await APIacceptRefound(user.login, isAccept, refound.user.login)
        const account = await APIlogin(user.login, user.password);
        dispatch(updateUser(account))
    }
    return <div>
        <p>{refound.user.fio}</p>
        <p>{refound.product.name}</p>
        <p>{refound.product.price}</p>
        <button onClick={() => accept(true)}>Accept</button>
        <button onClick={() => accept(false)}>Decline</button>
    </div>
}
