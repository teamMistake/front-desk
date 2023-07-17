import { COMPUTER, MSG_EVENT, USER } from "../components/constant";
import { parsingChatItem } from "./parsing";

const getUserInfoAPI = () => {
    const res = fetch("/api/oauth2/userinfo", {
        method: "GET",
    })
        .then((res) => res.json())
        .then((res) => {
            return res;
        })
        .catch((e) => {
            return undefined;
        });
};

const rateAnswerAPI = ({ seq_id, rate }) => {
    return;
};

const selectABTestItemAPI = ({ seq_id, index }) => {
    return;
};

const getChatsByContextIDAPI = (contextID) => {
    const mockChat = [
        { talker: USER, prompt: [{ resp: "안녕 반가워." }], event: MSG_EVENT, onlive: false, seqID: 10 },
        {
            talker: COMPUTER,
            prompt: [
                {
                    resp: "안녕은 말 그대로 안녕이라는 의미입니다. 대부분의 사람들은 일상 대화에서부터 부정적인 뉘앙스를 드러냅니다. 하지만, 이 문구는 언제나 기쁨과 안녕함을 전합니다.",
                    selected: false,
                },
                {
                    resp: "안녕은 말 그대로 안녕이라는 의미입니다. 대부분의 사람들은 일상 대화에서부터 부정적인 뉘앙스를 드러냅니다. 하지만, 이 문구는 언제나 기쁨과 안녕함을 전합니다.",
                    selected: false,
                },
                {
                    resp: "안녕은 말 그대로 안녕이라는 의미입니다. 대부분의 사람들은 일상 대화에서부터 부정적인 뉘앙스를 드러냅니다. 하지만, 이 문구는 언제나 기쁨과 안녕함을 전합니다.",
                    selected: false,
                },
                {
                    resp: "안녕은 말 그대로 안녕이라는 의미입니다. 대부분의 사람들은 일상 대화에서부터 부정적인 뉘앙스를 드러냅니다. 하지만, 이 문구는 언제나 기쁨과 안녕함을 전합니다.",
                    selected: false,
                },
                {
                    resp: "안녕은 말 그대로 안녕이라는 의미입니다. 대부분의 사람들은 일상 대화에서부터 부정적인 뉘앙스를 드러냅니다. 하지만, 이 문구는 언제나 기쁨과 안녕함을 전합니다.",
                    selected: false,
                },
                {
                    resp: "안녕",
                    selected: false,
                },
                { resp: "안녕.", selected: false },
                { resp: "안녕.", selected: true },
            ],
            event: MSG_EVENT,
            onlive: false,
            onlive: true,
            seqID: 10,
        },
    ]
    const parsedChat = parsingChatItem(mockChat)

    return parsedChat
};

const getContextsByUserIDAPI = (userID) => {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
}

export { getUserInfoAPI, rateAnswerAPI, selectABTestItemAPI, getChatsByContextIDAPI, getContextsByUserIDAPI };
