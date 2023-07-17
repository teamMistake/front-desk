const COMPUTING_LIMITATION_ERROR = "저희 서버는 현재 많은 사용자분들의 요청을 처리하고 있어 답변에 시간이 조금 걸릴 수 있습니다. 조금만 기다려 주시면 감사하겠습니다."
const NON_INPUT_ERROR = "무언가를 입력해 주시겠어요?"

const LOGIN_TRIGGER_NUM = 5

const MSG_EVENT = "msg"
const LOGIN_EVENT = "login"
const AB_MODEL_TEST_EVENT = "abtest"
const RANK_RES_EVENT = "rankmodelresponse"
const SHARED_CONTENT_EVENT = "shared"

const USER = "user"
const COMPUTER = "computer"

const SINGLE_MESSAGE = "single"
const MULTIPLE_MESSAGES = "multiple"

const MOJA_TITLE = "모자와 대화 해모자. Chat with MOJA."
const MOJA_DESC = `MOJA(모자)는 언어모델 "자모"를 기반으로 한 인공지능 채팅 서비스입니다. 자모는 GPT-3 같은 대규모 언어모델과 비등한 성능을 가지면서도, 낮은 성능의 컴퓨터에서도 구동이 가능할 수 있도록 만들어진 인공지능 언어 모델입니다. ChatGPT와 비교하자면 낮은 성능을 보이기는 하지만… OpenAI는 몇천억을 들여서 모델을 만들고 저희는 무자본으로 만들었는걸요. 이런 “자모”와 한번 대화해 볼래요?`

export {COMPUTING_LIMITATION_ERROR, MSG_EVENT, LOGIN_EVENT, NON_INPUT_ERROR, USER, COMPUTER, LOGIN_TRIGGER_NUM, AB_MODEL_TEST_EVENT, RANK_RES_EVENT, SINGLE_MESSAGE, MULTIPLE_MESSAGES, MOJA_TITLE, MOJA_DESC, SHARED_CONTENT_EVENT}
