import { COMPUTER, MSG_EVENT, USER } from "../components/constant";

const parsingChatItem = (chat) => {
    let chats = [];
    chat.map(({ messageId, req, resp, experiment }) => {
        const userChat = { talker: USER, prompt: [{ resp: req }], event: MSG_EVENT, onlive: false, messageId: messageId };

        let targetResp = resp.filter((r) => r.text != "")
        let parsedResp = targetResp.map(({ reqId, text, selected }) => {
            return { resp: text, selected: selected, reqId: reqId };
        });
    
        const comChat = { talker: COMPUTER, prompt: parsedResp, event: MSG_EVENT, onlive: false, messageId: messageId };

        chats.push(userChat);

        if (targetResp.length != 0){
            chats.push(comChat);
        }
    });

    return chats;
};

export { parsingChatItem };
