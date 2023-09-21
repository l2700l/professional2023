import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { APIacceptOrder, APIcreateOrder, APIdelivery, APIlogin } from "../../api/api";
import { RootStore, updateUser } from "../../store/store";
import { Product } from "../../types";

export const ProductOrder: React.FC<{product: Product}> = ({product}) => {
    const [count, setCount] = useState('0')
    const [delivery, setDelivery] = useState<Product>();
    const user = useSelector((state: RootStore) => state.user)
    const dispatch = useDispatch()
    const buy = async () => {
        await APIcreateOrder(user.login, product.name, +count)
        await APIdelivery(user.login, product.name)
        await APIdelivery(user.login, product.name)
        await APIdelivery(user.login, product.name)
        await APIdelivery(user.login, product.name)
        await APIdelivery(user.login, product.name)
        const data = await APIdelivery(user.login, product.name)
        setDelivery(data)
    }
    const accept = async (isAccept: boolean) => {
        await APIacceptOrder(user.login, product.name, isAccept)
        const account = await APIlogin(user.login, user.password);
        dispatch(updateUser(account))
    }
    return <div>
        <p>Name: {product.name}</p>
        <p>Provider: {product.provider}</p>
        <p>Count: {product.count}</p>
        <p>Price: {product.basePrice}</p>
        <br/>
        <input value={count} onChange={e => setCount(e.target.value)}/>
        {+count > 0 && <div>
            <p>Total: {+count*product.basePrice*(+count <= 100 ? 1: +count <= 1000? 0.95 : 0.9)}</p>
            <button onClick={buy}>Buy</button>
            </div>
        }
        {delivery && <div>
            <p>Temps: {delivery.temps?.toString()}</p>
            <p>Total price: {delivery.price}</p>
            <button onClick={() => accept(true)}>Accept</button>
            <button onClick={() => accept(false)}>Decline</button>
            </div>}
            <br/>
    </div>
}