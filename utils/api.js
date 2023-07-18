const getUserInfoAPI = async () => {
    try {
        const res = await fetch("/api/oauth2/userinfo", {
            method: "GET",
        })
        const data = await res.json()
        return data
    } catch (e) {   
        return undefined
    }
};

const rateAnswerAPI = async ({ chatId, messageId, reqId, stars }) => {
    try {
        const data = {"stars": stars}
        const res = await fetch(`/api/chat/${chatId}/messages/${messageId}/${reqId}/rating`, {
            method: "PUT",
            body: JSON.stringify(data)
        })    
        const result = await res.json()
        return result
    } catch (e) {
        console.log("23", e)
        return undefined
    }
};

const selectABTestItemAPI = async ({ reqId, messageId }) => {
    try {
        const data = {chosen: reqId}
        const res = await fetch(`/api/messages/${messageId}/`, {
            method: "PUT",
            body: JSON.stringify(data)
        })

        const result = await res.json()
        return result
    } catch (e) {
        return undefined
    }
};

const getChatByContextIDAPI = async (contextID) => {
    try {
        const res = await fetch(`/api/chat/${contextID}`)   
        const response = await res.json()
    
        return response
    } catch (e) {
        return undefined
    }
};

const getContextsByUserIDAPI = async () => {
    try{
        const res = await fetch("/api/chat/chats", {"method": "GET"})
        const response = await res.json()
    
        return response
    } catch(e) {
        return []
    }
}

export { getUserInfoAPI, rateAnswerAPI, selectABTestItemAPI, getChatByContextIDAPI, getContextsByUserIDAPI };
