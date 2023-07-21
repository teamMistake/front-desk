const getUserInfoAPI = async () => {
    try {
        const res = await fetch("/api/oauth2/userinfo", {
            method: "GET",
        });
        const data = await res.json();
        return data;
    } catch (e) {
        return undefined;
    }
};

const rateAnswerAPI = async ({ chatId, messageId, reqId, stars }) => {
    try {
        const data = { stars: stars };
        const res = await fetch(`/api/chat/${chatId}/messages/${messageId}/${reqId}/rating`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await res.json();
        return result;
    } catch (e) {
        return undefined;
    }
};

const selectABTestItemAPI = async ({ reqId, chatId, messageId }) => {
    try {
        const data = { chosen: reqId };
        const res = await fetch(`/api/chat/${chatId}/messages/${messageId}/chosen`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await res.json();
        return result;
    } catch (e) {
        return undefined;
    }
};

const getChatByContextIDAPI = async (contextID) => {
    try {
        const res = await fetch(`/api/chat/${contextID}`);
        const response = await res.json();

        return response;
    } catch (e) {
        return undefined;
    }
};

const getContextsByUserIDAPI = async () => {
    try {
        const res = await fetch("/api/chat/chats", { method: "GET" });
        const response = await res.json();

        return response;
    } catch (e) {
        return [];
    }
};

const checkForSharing = async ({ chatId, share }) => {
    try {
        const data = { share: share };
        const res = await fetch(`/api/chat/${chatId}/share`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const response = await res.json();

        return response;
    } catch (e) {
        return undefined;
    }
};

const getChatsStatus = async (chatId) => {
    try {
        const res = await fetch(`/api/chat/${chatId}`)
        const resopnse = await res.json()

        console.log(resopnse)

        return resopnse.generating
    } catch (e) {
        return true
    }
}

export { getUserInfoAPI, rateAnswerAPI, selectABTestItemAPI, getChatByContextIDAPI, getContextsByUserIDAPI, checkForSharing, getChatsStatus };
