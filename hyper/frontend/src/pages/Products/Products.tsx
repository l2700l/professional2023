import { useSelector } from "react-redux"
import { ProductsRef } from "../../components/Products/ProductsRef"
import { RootStore } from "../../store/store"

export const Products = () => {
    const user = useSelector((state: RootStore) => state.user)
   
    return <div>
        <br/>
        {user.products.map((product) => <ProductsRef product={product}/>)}        
    </div>
}