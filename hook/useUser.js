import { useEffect, useState } from "react"
import useLocalStorage from "./useLocalStorage"

const useUser = () => {
    const [isAuth, setIsAuth] = useState(false)
    const [token, setToken] = useLocalStorage("jwt")

    // AUTHORIZATION identification
    useEffect(() => {
        // if not me 
        setToken(undefined)
        isAuth(false)

        // else 
        isAuth(true)
    }, [token])

    return isAuth
}


export {useUser}