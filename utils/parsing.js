import { COMPUTER, MSG_EVENT, NON_OUTPUT_ERROR, USER } from "../components/constant";

const parsingChatItem = (chat) => {
    let chats = [];
    chat.map(({ messageId, req, resp, experiment }) => {
        const userChat = { talker: USER, prompt: [{ resp: req }], event: MSG_EVENT, onlive: false, messageId: messageId };

        // let targetResp = resp.filter((r) => r.text != "" || !r.text)
        let parsedResp = resp.map(({ reqId, text, selected }) => {
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


function parsingChatByReqsObject(item, clean=false) {
    if (clean) {
        let item = Object.entries(item).filter((r) => r[1] != "")
    }
    return Object.entries(item).map((_data) => {
        try {
            let tempReqId = _data[0];
            let tempMsg = _data[1];
            // if (non) {
            //     tempMsg = tempMsg != "" ? tempMsg : NON_OUTPUT_ERROR
            // }
            return { resp: tempMsg, selected: false, reqId: tempReqId };
        } catch (e) {
            console.log(e);
        }
    });
}

export { parsingChatItem, parsingChatByReqsObject };
