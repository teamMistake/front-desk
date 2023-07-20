import { COMPUTER, MSG_EVENT, NON_OUTPUT_ERROR, USER } from "../components/constant";

const parsingChatItem = (chat) => {
    let chats = [];
    chat.map(({ messageId, req, resp, experiment }) => {
        const userChat = { talker: USER, prompt: [{ resp: req }], event: MSG_EVENT, onlive: false, messageId: messageId };

        // let targetResp = resp.filter((r) => r.text != "" || !r.text)
        let parsedResp = targetResp.map(({ reqId, text, selected }) => {
            return { resp: text != "" ? text : NON_OUTPUT_ERROR, selected: selected, reqId: reqId };
        });
    
        const comChat = { talker: COMPUTER, prompt: parsedResp, event: MSG_EVENT, onlive: false, messageId: messageId };

        chats.push(userChat);
        chats.push(comChat);

        // if (targetResp.length != 0){
        // }
    });

    return chats;
};

export { parsingChatItem };
