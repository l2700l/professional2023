import { useState } from "react"
import { API } from "../../api/api"
import { Users } from "../../components/Users/Users"

export const Owner = () => {
    const [selected,setSelected] = useState('')
    return <div>
        <br/>
        <select onChange={e => setSelected(e.target.value)}>
            <option value=''>
                Выбрать
            </option>
            <option value='check'>
                Просмотр пользователей
            </option>
        </select>
        <br/>
        {selected === 'check' && <Users/>}
    </div>
}