import { HeaderElement } from "./HeaderElement"


export const HeaderProvider: React.FC<{children: JSX.Element}> = ({children}) => {
    return <>
    <HeaderElement/>
    {children}
    </>
}