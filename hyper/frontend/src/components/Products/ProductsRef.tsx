import { useSelector } from "react-redux";
import { APIrefound } from "../../api/api";
import { RootStore } from "../../store/store";
import { Product } from "../../types";

export const ProductsRef: React.FC<{product: Product}> = ({product}) => {
    const user = useSelector((state: RootStore) => state.user)
    const refund = async () => {
        await APIrefound(user.login, product.name)
    }
    return <div>
        <p>Name: {product.name}</p>
        <p>Provider: {product.provider}</p>
        <p>Count: {product.count}</p>
        {user.role === 'user' && <button onClick={refund}>Refound</button>}
        <br/>
    </div>
}