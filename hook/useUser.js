import { useEffect, useState } from "react"
import { getUserInfoAPI } from "../utils/api"

const useUser = () => {
    const [isAuth, setIsAuth] = useState()
    const [userID, setUserID] = useState()

    // AUTHORIZATION identification
    useEffect(() => {
        async function fetchUser() {
            const user = await getUserInfoAPI()
            if (user) {
                setIsAuth(true)
                setUserID(user.user)
            } else {
                setIsAuth(false)
            }
        }

        fetchUser()
    }, [])

    return {isAuth: isAuth, userID: userID}
}


export {useUser}