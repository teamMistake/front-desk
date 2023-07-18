import { COMPUTER, MSG_EVENT, USER } from "../components/constant"

const parsingChatItem = (chat) => {
    let chats = []
    chat.map(({messageId, req, resp, experiment}) => {
        const userChat = {talker: USER, prompt: [{resp: req}], event: MSG_EVENT, onlive: false, seqID: messageId}

        let parsedResp = resp.map(({reqId, text, selected}) => {
            return {resp: text, selected: selected, reqId: reqId}
        })
        const comChat = {talker: COMPUTER, prompt: parsedResp, event: MSG_EVENT, onlive: false, messageId: messageId}

        chats.append(userChat)
        chats.append(comChat)
    })

    return chats
}

export {parsingChatItem}