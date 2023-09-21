import { useEffect, useState } from "react"
import { APIgetShops } from "../../api/api"
import { Shop } from "../../types"
import { ProductUser } from "../ProductUser/ProductUser"

export const Shops = () => {
    const [shops, setShops] = useState<Shop[]>([])
    useEffect(() => {
        const fetch = async () => {
            const data = await APIgetShops()
            console.log(data)
            setShops(data)
        }
        fetch()
    }, [])
    return <>
        {shops.map(({products})=> products.map((product) => <ProductUser product={product}/>))}
    </>
}