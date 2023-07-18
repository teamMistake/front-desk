const getUserInfoAPI = async () => {
    try {
        const res = await fetch("/api/oauth2/userinfo", {
            method: "GET",
        })
        const data = await res.json()
        return data
    } catch (e) {
        console.log(e)
        return undefined
    }
};

const rateAnswerAPI = ({ seq_id, rate }) => {
    return;
};

const selectABTestItemAPI = ({ seq_id, index }) => {
    return;
};

const getChatsByContextIDAPI = async (contextID) => {
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

export { getUserInfoAPI, rateAnswerAPI, selectABTestItemAPI, getChatsByContextIDAPI, getContextsByUserIDAPI };
