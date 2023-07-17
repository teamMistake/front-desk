import { useEffect, useState } from "react"
import { getUserInfoAPI } from "../utils/api"

const useUser = () => {
    const [isAuth, setIsAuth] = useState(false)
    const [userID, setUserID] = useState()

    // AUTHORIZATION identification
    useEffect(() => {
        async function fetchUser() {
            const user = await getUserInfoAPI()
            if (user) {
                setIsAuth(true)
                setUserID(user.user)
            }
        }

        fetchUser()
    }, [])

    return {isAuth: isAuth, userID: userID}
}


export {useUser}