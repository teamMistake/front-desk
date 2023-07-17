const getUserInfoAPI = async () => {
    const res = fetch("/api/oauth2/userinfo", {
        method: "GET",
    })
        .then((res) => res.json())
        .then((res) => {
            return res;
        })
        .catch(e => {
            console.log(e)
            return undefined;
        });
    return res
};

const rateAnswerAPI = ({ seq_id, rate }) => {
    return;
};

const selectABTestItemAPI = ({ seq_id, index }) => {
    return;
};

const getChatsByContextIDAPI = async (contextID) => {
    try {
        const res = await fetch(`/chat/${contextID}`)   
        const response = await res.json()
    
        return response
    } catch (e) {
        return undefined
    }
};

const getContextsByUserIDAPI = async () => {
    try{
        const res = await fetch("/chat/chats", {"method": "GET"})
        const response = await res.json()
    
        return response
    } catch(e) {
        return []
    }
}

export { getUserInfoAPI, rateAnswerAPI, selectABTestItemAPI, getChatsByContextIDAPI, getContextsByUserIDAPI };
