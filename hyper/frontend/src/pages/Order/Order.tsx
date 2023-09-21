import { useEffect, useState } from "react"
import { APIgetProducts } from "../../api/api"
import { ProductOrder } from "../../components/ProductOrder/ProductOrder"
import { Product } from "../../types"

export const Order = () => {
    const [products, setProducts] = useState<Product[]>([])
    useEffect(() => {
        const fetch = async () => {
            const data = await APIgetProducts()
            setProducts(data)
        }
        fetch()
    }, [])

    return <div>
        <br/>
        {products.map((product) => <ProductOrder product={product}/>)}
    </div>
}