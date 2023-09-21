import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { APIgetRefounds } from "../../api/api";
import { RefoundItem } from "../../components/Refound/RefoundItem";
import { RootStore } from "../../store/store"
import { Refound } from "../../types";

export const Refounds = () => {
    const user = useSelector((state: RootStore) => state.user)
    const dispatch = useDispatch();
    const [refounds, setRefounds] = useState<Refound[]>([])
    useEffect(() => {
        const fetch = async () => {
            const data = await APIgetRefounds(user.login);
            setRefounds(data);
        }
        fetch()
    },[])
    return <div>
        <br/>
        {refounds.map((refound) => <RefoundItem refound={refound}/>)}
    </div>
}