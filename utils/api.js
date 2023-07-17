const getUserInfoAPI = () => {
    const res = fetch("/api/oauth2/userinfo", {
        method: "GET",
    }).then((res) => res.json()).then((res) => {
        return res
    }).catch((e) => {
        return undefined
    })
}

export {getUserInfoAPI}