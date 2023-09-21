import { useSelector } from "react-redux"
import { Login } from "../../pages/Login/Login"
import { RootStore } from "../../store/store"
import { HeaderProvider } from "../HeaderProvider/HeaderProvider"

export const AuthProvider: React.FC<{children: JSX.Element}> = ({children}) => {
    const user = useSelector((state: RootStore) => state.user)
    return <>{user?.address ? <HeaderProvider>{children}</HeaderProvider> : <Login/>}</>
}