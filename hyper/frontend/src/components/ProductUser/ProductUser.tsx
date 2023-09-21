import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { APIbuy, APIlogin } from "../../api/api";
import { RootStore, updateUser } from "../../store/store";
import { Product } from "../../types";

export const ProductUser: React.FC<{product: Product}> = ({product}) => {
    const [count, setCount] = useState('0')
    const user = useSelector((state: RootStore) => state.user)
    const dispatch = useDispatch()
    const buy = async () => {
        await APIbuy(user.login, product.name, product.shop || '', +count)
        const account = await APIlogin(user.login, user.password);
        dispatch(updateUser(account))
    }
    return <div>
        <p>Name: {product.name}</p>
        <p>Provider: {product.provider}</p>
        <p>Count: {product.count}</p>
        <p>Shop: {product.shop}</p>
        <p>Price: {product.price}</p>
        <br/>
        <input value={count} onChange={e => setCount(e.target.value)}/>
        {+count > 0 && <div>
            <p>Total: {+count*(product.price || 0)}</p>
            <button onClick={buy}>Buy</button>
            </div>
        }
        <br/>
    </div>
}