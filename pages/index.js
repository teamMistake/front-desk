import Image from "next/image";
import { useForm } from "react-hook-form";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { MessageBox } from "../components/message";
import ndjsonStream from "can-ndjson-stream";
import { AnimateButton, AnimateRegenerateButton, AnimateSendButton, Button, GhostButton } from "../components/button";
import { ErrorMessage } from "../components/error";
import {
    AB_MODEL_TEST_EVENT,
    COMPUTER,
    COMPUTING_LIMITATION_ERROR,
    LOGIN_EVENT,
    LOGIN_TRIGGER_NUM,
    MSG_EVENT,
    NON_INPUT_ERROR,
    RANK_RES_EVENT,
    SHARED_CONTENT_EVENT,
    USER,
} from "../components/constant";
import useLocalStorage from "../hook/useLocalStorage";
import BottomSelectorUI from "../components/bottomSelector";
import { RegenerateIcon } from "../components/regenerateicon";
import { useRouter } from "next/router";
import { StarRating } from "../components/rating";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import queryString from "query-string";
import { LoadingSpinner } from "../components/loading";
import { ShareIcon } from "../components/shareicon";
import {
    FacebookIcon,
    FacebookMessengerIcon,
    FacebookMessengerShareButton,
    FacebookShareButton,
    LineIcon,
    LineShareButton,
    TwitterIcon,
    TwitterShareButton,
} from "react-share";
import { getChatByContextIDAPI, getContextsByUserIDAPI, getUserInfoAPI, rateAnswerAPI, selectABTestItemAPI } from "../utils/api";
import { useUser } from "../hook/useUser";
import SendIcon from "../components/sendicon";
import Opengraph from "../components/opengraph";
import { KakaoBtn } from "../components/kakaobutton";
import ContextIcon from "../components/contexticon";
import RankIcon from "../components/rankicon";
import { parsingChatItem } from "../utils/parsing";

export default function Home() {
    const router = useRouter();

    // TODO: Set isMine false for safety
    const [isMine, setIsMine] = useState(true);
    const { isAuth: auth, userID } = useUser();

    // Chat state list of chat item.
    const [chats, setChats] = useState([]);
    const [chatLoading, setChatLoading] = useState(false);

    // Chatting Ref for scroll down.
    const chatContainerRef = useRef(null);
    const textAreaRef = useRef(null);

    const [contextID, setContextID] = useState("");
    const [messageId, setMessageId] = useState();

    // Context ID for setting the chat context
    const [contexts, setContexts] = useState([]);
    const [seeContexts, setSeeContexts] = useState(false);
    const [contextLoading, setContextLoading] = useState(false);
    const [ABBtnCount, setABBtnCount] = useState(3);

    const [shareURL, setShareURL] = useState("");

    // Loading State for Disable the chatting while getting the response.
    const [loading, setLoading] = useState(false);
    const [update, setUpdate] = useState(0);
    // Set error while responding.
    const [error, setError] = useState(false);
    const [event, setEvent] = useState(MSG_EVENT);

    // If your visit is first or not
    const [firstVisit, setFirstVisit] = useLocalStorage("firstVisit");
    const [logined, setLogined] = useLocalStorage("logined");

    const [privacyChecked, setPrivacyChecked] = useState(false);
    const [privacyError, setPrivacyError] = useState(false);

    const [rating, setRating] = useState(5);

    // Thankyou Container for better User Experience
    const [thankyou, setThankYou] = useState(false);
    const [thankReason, setThankReason] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        setError: setFormError,
    } = useForm();

    const { ref, ...rest } = register("prompt");

    // =========================== Initiate EVENT =================================
    useEffect(() => {
        // Redirect Event Handler for the Login event enabling
        const { redirectFromPrivacy } = router.query;
        if (redirectFromPrivacy) {
            setEvent(LOGIN_EVENT);
        }

        // If this page was shared context page. and so
        const { share: sharedContextId } = queryString.parse(location.search);

        if (sharedContextId) {
            setContextID(sharedContextId);
            // it may be possible that this chat was written by me. so change this state case by case
            // identify the user authorization with userId and context writer id
            // IF NOT MINE
            setEvent(SHARED_CONTENT_EVENT);
            setIsMine(false);
        }
    }, []);

    const clearChat = () => {
        setChats([]);
        setEvent(MSG_EVENT);
        setIsMine(true);
        router.push("/");
    };

    const clearAll = () => {
        clearChat();
        setContextID();
    };

    const startNewChat = () => {
        clearAll();
        toggleContextDrawer();
    };

    // =========================== DEAL CONTEXT =================================
    useEffect(() => {
        clearChat();
        if (contextID == "" || !contextID) return;

        // set share url for future sharing event
        const urlPieces = [location.protocol, "//", location.host, location.pathname];
        let url = urlPieces.join("");
        const turl = `${url}/?share=${contextID}`;
        setShareURL(turl);

        // TODO: request to the server set chat data
        async function fetchChat() {
            setLoading(true);
            setChatLoading(true);

            try {
                const _chats = await getChatByContextIDAPI(contextID);
                const { messages } = _chats;

                if ((_chats.userId = userID)) {
                    setEvent(MSG_EVENT);
                    setIsMine(true);
                }

                const parsed_chats = parsingChatItem(messages);
                setChats(() => parsed_chats);
                
                const lastChat = parsed_chats[parsed_chats.length - 1]
                // AB TESTING EVENT Trigger
                if (lastChat.talker == COMPUTER && lastChat.prompt.length > 1) {
                    let isEnded = false;

                    const tChat = chats[chats.length - 1];
                    tChat.prompt.map((p) => {
                        isEnded = p?.selected && true;
                    });

                    if (!isEnded) {
                        setEvent(AB_MODEL_TEST_EVENT);
                        setABBtnCount(lastChat.prompt.length);
                    }
                }

                setLoading(false);
                setChatLoading(false);
            } catch (e) {
                console.log("183", e);
                return;
            }
        }

        fetchChat();
    }, [contextID]);

    useEffect(() => {
        async function fetchContexts() {
            setContextLoading(true);

            // TODO: GET contexts
            const _contexts = await getContextsByUserIDAPI();

            if (_contexts) {
                console.log("Context!!!!!!", _contexts);

                const sorted_context = _contexts.sort(function (a, b) {
                    const a_timestamp = new Date(a.creationTimestamp).getTime()
                    const b_timestamp = new Date(b.creationTimeStamp).getTime()
                    return  a_timestamp - b_timestamp
                }).reverse()

                setContexts(sorted_context);

                setContextLoading(false);
            }
        }

        if (seeContexts) {
            fetchContexts();
        }
    }, [seeContexts]);

    const changeContext = (cid) => {
        setContextID(cid);
        toggleContextDrawer();
        setIsMine(true);
        setEvent(MSG_EVENT);
    };

    const shareAPI = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: "모자와 대화 해모자. Chat with MOJA.",
                    text: "저와 모자의 재밌는 대화 기록 한번 보실래요?",
                    url: shareURL,
                })
                .then(() => console.log("share success"))
                .catch((error) => console.log("fail to share", error));
        }
    };

    // =========================== GENERATE CHAT EVENT =================================
    const onSubmit = (data, regenerate=false) => {
        const prompt = data.prompt;

        const removedSpaceValue = prompt.replace(/(\r\n|\n|\r)/gm, "");
        if (removedSpaceValue == "" || loading) {
            setFormError("prompt", { message: NON_INPUT_ERROR });
            return;
        }

        setValue("prompt", "");

        const chatPrompt = { resp: prompt };

        const chat = {
            talker: USER,
            prompt: [chatPrompt],
            event: MSG_EVENT,
            onlive: true,
            regenerate: regenerate
        };

        return setChats([...chats, chat]);
    };

    // Submit data using watching
    const SubmitData = () => {
        const prompt = watch("prompt");

        const data = { prompt: prompt };
        return handleSubmit(onSubmit(data));
    };

    // Disable return key event.
    const enterSubmit = (e) => {
        if (e.nativeEvent.isComposing) return;
        if (e.key === "Enter" && e.shiftKey == false) {
            e.preventDefault();
            return SubmitData();
        }
    };

    // Regenerate the user prompt.
    // TODO: Turn this into new api
    const Regenerate = () => {
        // const target_prompt = chats[chats.length - 2].prompt;
        const _chats = chats;
        let target_prompt;
        for (let i = 1; i <= _chats.length; i++) {
            const target = _chats[_chats.length - i];
            if (target.talker == USER) {
                target_prompt = target.prompt[0].resp;
                break;
            }
        }
        if (!target_prompt) {
            return;
        }
        const data = { prompt: target_prompt, regenerate: true };
        return handleSubmit(onSubmit(data));
    };

    const PostGenerate = (prompt, regenerate=false) => {
        // Timeout Detector
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // just wait for 10s

        const isFirstChat = chats.length == 1;
        const _chats = chats;

        let data = {};
        let url = "";
        if (regenerate) {
            url = `/api/chat/${contextID}/regenerate`
        } else if (isFirstChat) {
            data = { initialPrompt: prompt };
            url = "/api/chat/create";
        } else {
            data = { message: prompt };
            url = `/api/chat/${contextID}/message`;
        }

        const stream = fetch(url, {
            body: JSON.stringify(data),
            method: "POST",
            signal: controller.signal,
            headers: {
                Accept: "application/x-ndjson",
                "Content-Type": "application/json",
            },
        })
            .then((response) => ndjsonStream(response.body))
            .then((stream) => {
                clearTimeout(timeoutId);
                const streamReader = stream.getReader();
                streamReader.read().then(async (response) => {
                    let item = {};

                    while (!response || !response.done) {
                        response = await streamReader.read();
                        if (response.done) {
                            if (auth) {
                                if (Object.keys(item).length > 1) {
                                    setEvent(AB_MODEL_TEST_EVENT);
                                    setABBtnCount(Object.keys(item).length);
                                } else if (auth) {
                                    randomRatingEventTrigger();
                                }
                            }
                            setLoading(false);
                            return;
                        }

                        const data = response.value.data;

                        if (data.type == "chat") {
                            console.log("type chat", data);
                        } else if (data.type == "message") {
                            const { chatId, message } = data;
                            setContextID(chatId);
                            setMessageId(message.messageId);
                        } else if (data.type == "lm_reqids") {
                            const { reqIds } = data;

                            reqIds.map((id) => {
                                item[id.req_id] = "";
                            });
                        } else if (data.type == "lm_response") {
                            const { reqId, messageId, data: d } = data;
                            item[reqId] = d.resp_full;

                            const parsed = Object.entries(item).map((_data) => {
                                try {
                                    let tempReqId = _data[0];
                                    let tempMsg = _data[1];
                                    return { resp: tempMsg, selected: false, reqId: tempReqId };
                                } catch (e) {
                                    console.log(e);
                                }
                            });
                            const comChat = { talker: COMPUTER, prompt: parsed, event: MSG_EVENT, onlive: true, messageId: messageId };
                            setChats(() => [..._chats, comChat]);
                        } else if (data.type == "lm_error") {
                            console.log(data);
                            setError(COMPUTING_LIMITATION_ERROR);
                            return;
                        } else if (data.type == "error") {
                            console.log(data);
                            setError(COMPUTING_LIMITATION_ERROR);
                            return;
                        }
                    }
                });
            })
            .catch((e) => {
                console.log(e);
                setError(COMPUTING_LIMITATION_ERROR);
            });
    };

    // TODO: Chats
    // chat state update event management such as login event, generate event, scroll trigger
    useEffect(() => {
        if (chats.length == 0) return;

        const trigger = firstVisit == undefined ? LOGIN_TRIGGER_NUM : 3;
        // Login Event Trigger

        if (chats[chats.length - 1].talker == USER && chats.length >= trigger && !auth) {
            const _chats = chats;
            setFirstVisit(false);

            const login_request_data = {
                talker: COMPUTER,
                prompt: [{ resp: "자모와 대화를 더 나누기 위해서는 로그인이 필요합니다..." }],
                event: LOGIN_EVENT,
                onlive: true,
            };

            // LOGIN EVENT Trigger
            setEvent(LOGIN_EVENT);

            return setChats([..._chats, login_request_data]);
        }

        const lastChat = chats[chats.length - 1];
        if (lastChat.talker == USER) {
            setLoading(true);
            const target_prompt = chats[chats.length - 1].prompt;

            PostGenerate(target_prompt[0].resp, target_prompt.regenerate);
        }

        if (lastChat.talker == COMPUTER) {
            setMessageId(lastChat.messageId);
        }

        if (chats.length != update) {
            scrollToBottom();
            setUpdate(chats.length);
        }
    }, [chats]);

    const selectABTestItem = (index) => {
        // Post the answer and set event msg event
        setEvent(MSG_EVENT);
        setLoading(true);

        const _chats = chats;

        // Update for UI
        _chats[_chats.length - 1].prompt[index].selected = true;

        async function fetchABTest() {
            const reqId = _chats[_chats.length - 1].prompt[index].reqId;
            await selectABTestItemAPI({ messageId: messageId, chatId: contextID, reqId: reqId });

            setLoading(false);
        }

        fetchABTest();
    };

    // =========================== AUTH EVENT =================================
    // =========================== LOGIN =================================
    useEffect(() => {
        if (auth) {
            setLogined(true);
        } else if (auth == false && logined) {
            toggleLoginModal();
        }
    }, [auth]);

    const loginEventHandler = () => {
        if (!privacyChecked) return setPrivacyError(true);

        router.push("/login");
    };

    const reLoginEventHandler = () => {
        router.push("/login");
    };

    // =========================== PRIVACY EVENT =================================
    useEffect(() => {
        if (privacyChecked) setPrivacyError(false);
    }, [privacyChecked]);

    // =========================== RATING EVENT =================================
    const randomRatingEventTrigger = () => {
        const trigger = Math.floor(Math.random() * 10) == 3;
        if (!trigger) return;

        // If random rating event triggered
        setEvent(RANK_RES_EVENT);
    };

    const queryRateAnswer = () => {
        const reqId = chats[chats.length - 1].prompt[0].reqId;
        rateAnswerAPI({ chatId: contextID, messageId: messageId, reqId: reqId, stars: rating });

        // AFTER
        setThankYou(true);
        setThankReason("답변해주셔서");
    };

    // ========================= UX Animation Event Controller =======================
    useEffect(() => {
        if (thankyou) {
            const tout = setTimeout(() => {
                setThankYou(false);

                // IT MAY OCCUR SERIOUS LOGIC CONFLICTION BE CAREFUL
                setEvent(MSG_EVENT);
            }, 1000);

            return () => clearTimeout(tout);
        }
    }, [thankyou]);

    // Set timeout for clearing the chatting response error.
    useEffect(() => {
        if (!error) return;
        scrollToBottom();
        const timeout = setTimeout(() => {
            setLoading(false);
            setError("");
        }, 1000);

        return () => clearTimeout(timeout);
    }, [error]);

    // chatting textarea size adjusting for UX
    useEffect(() => {
        if (textAreaRef.current.style) {
            if (textAreaRef.current.scrollHeight > 24 * 5) {
                return;
            }

            textAreaRef.current.style.height = "0px";
            const scrollHeight = textAreaRef.current.scrollHeight;

            textAreaRef.current.style.height = Math.max(...[scrollHeight, 24 * 2]) + "px";
        }
    }, [textAreaRef, watch("prompt")]);

    useEffect(() => {
        const value = watch("prompt");
        if (!value) return;
        const removedSpaceValue = value.replace(/(\r\n|\n|\r)/gm, "");
        if (value != "" && removedSpaceValue == "") {
            setFormError("prompt", { message: NON_INPUT_ERROR });
            return;
        }
        setFormError("prompt", { message: "" });
    }, [watch("prompt")]);

    const scrollToBottom = () => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    };

    // =========================== TOGGLE MODAL EVENT =================================
    const toggleContextDrawer = () => {
        return setSeeContexts(() => !seeContexts);
    };
    const toggleShareModal = () => {
        return window.share_modal.showModal();
    };
    const toggleLoginModal = () => {
        return window.login_request_modal.showModal();
    };

    const formatUTCTime = (time) => {
        const d = new Date(time)
        // const date = d.toISOString().split('T')[0].split("-");

        const date = d.toLocaleDateString("ko-KR").split(".")
        const hour = d.toTimeString().split(' ')[0].split(":")[0];
        const mm = date[1].slice(1, date[1].length)
        const dd = date[2].slice(1, date[2].length)
        return `${mm}/${dd}/${hour}h`
    }

    return (
        <>
            <Opengraph
                title=''
                ogTitle=''
                description={`MOJA(모자)는 언어모델 "자모"를 기반으로 한 인공지능 채팅 서비스입니다. 자모는 GPT-3 같은 대규모 언어모델과 비등한 성능을 가지면서도, 낮은 성능의 컴퓨터에서도 구동이 가능할 수 있도록 만들어진 인공지능 언어 모델입니다. ChatGPT와 비교하자면 낮은 성능을 보이기는 하지만… OpenAI는 몇천억을 들여서 모델을 만들고 저희는 무자본으로 만들었는걸요. 이런 “자모”와 한번 대화해 볼래요?`}
                isMainPage={true}
            />
            <div className='navbar bg-base-100 border-b-2'>
                <div className='navbar-start'>
                    {!auth && <GhostButton onClick={() => router.push("story")}>MOJA</GhostButton>}
                    {auth && (
                        <label className='btn btn-ghost' onClick={() => toggleContextDrawer()}>
                            <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h7' />
                            </svg>
                        </label>
                    )}
                </div>
                <div className='navbar-center'></div>
                <div className='navbar-end'>
                    {chats.length > 0 && shareURL && auth && (
                        <GhostButton onClick={() => toggleShareModal()}>
                            <ShareIcon width='40' />
                        </GhostButton>
                    )}
                    <GhostButton onClick={() => router.push("/rank")}>
                        <RankIcon width='32' height='32' />
                        <span className='text-xs'>Rank</span>
                    </GhostButton>
                </div>
            </div>

            <main className='bg-base-100 flex flex-row h-full w-screen overflow-hidden'>
                <Drawer open={seeContexts} onClose={toggleContextDrawer} direction='bottom' size={500}>
                    <div className='w-full h-full flex flex-col justify-center items-center bg-base-100'>
                        <div className='w-full flex-1 overflow-hidden overflow-y-scroll'>
                            {contextLoading ? (
                                <LoadingSpinner />
                            ) : (
                                <>
                                    {contexts.length > 0 ? (
                                        <ul className='w-full divide-y divide-slate-100'>
                                            {contexts.map(({ chatId, title, creationTimestamp }, index) => (
                                                <li
                                                    onClick={() => changeContext(chatId)}
                                                    className='cursor-pointer w-full flex flex-row justify-center items-center gap-2 p-3 text-center md:hover:bg-base-200'
                                                    key={index}
                                                >
                                                    <div>
                                                        <ContextIcon width='20' height='20' />
                                                    </div>
                                                    {/* TODO: set appropriate item */}
                                                    <span className='text-md font-medium'>{title == "" ? "새로운 대화" : title}</span>
                                                    <span className='text-sm font-thin'>{formatUTCTime(creationTimestamp)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className='flex w-full h-full flex-col justify-center items-center'>
                                            <span className='text-2xl font-bold highlight dark:bg-none'>헉.. 아무 대화가 없어요..</span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        <div className='p-3'>
                            <button
                                onClick={() => startNewChat()}
                                className='btn btn-wide btn-outline border-gray-500 font-medium rounded-lg text-sm px-4 py-2.5 shadow-lg'
                            >
                                새로운 대화 시작하기
                            </button>
                        </div>
                    </div>
                </Drawer>

                {/* LOGIN REQUEST MODAL FOR OUTDATED TOKEN USER */}
                <dialog id='login_request_modal' className='modal'>
                    <form method='dialog' className='modal-box'>
                        <div className='w-full flex justify-center'>
                            <BottomSelectorUI title='다시 로그인해주세요.'>
                                <button className='w-[50%] btn btn-outline join-item' onClick={() => reLoginEventHandler()}>
                                    예
                                </button>
                                <button className='w-[50%] btn btn-outline join-item'>아니요</button>
                            </BottomSelectorUI>
                        </div>
                    </form>
                </dialog>

                {/* LOGIN REQUEST MODAL FOR OUTDATED TOKEN USER */}
                <dialog id='share_modal' className='modal'>
                    <form method='dialog' className='modal-box'>
                        <div className='w-full flex justify-center'>
                            <div className='w-[90%] max-w-[640px] flex flex-col items-center rounded-md p-1 pb-1'>
                                <div className='mb-2'>
                                    <span className='text-2xl font-bold highlight dark:bg-none'>여러분의 대화 내용을 공유하고 싶나요?</span>
                                </div>
                                <div className='mt-2 join w-full flex justify-center'>
                                    <button className='w-[50%] btn btn-outline join-item' onClick={() => shareAPI()}>
                                        예
                                    </button>
                                    <button className='w-[50%] btn btn-outline join-item'>아니요</button>
                                </div>
                                <div className='divider'>SNS</div>
                                <div className='flex flex-row gap-2'>
                                    <KakaoBtn shareURL={shareURL} />
                                    <FacebookShareButton url={shareURL}>
                                        <FacebookIcon size={48} round={true} borderRadius={24}></FacebookIcon>
                                    </FacebookShareButton>
                                    <FacebookMessengerShareButton url={shareURL}>
                                        <FacebookMessengerIcon size={48} round={true} borderRadius={24}></FacebookMessengerIcon>
                                    </FacebookMessengerShareButton>
                                    <TwitterShareButton url={shareURL}>
                                        <TwitterIcon size={48} round={true} borderRadius={24}></TwitterIcon>
                                    </TwitterShareButton>
                                    <LineShareButton url={shareURL}>
                                        <LineIcon size={48} round={true} borderRadius={24}></LineIcon>
                                    </LineShareButton>
                                </div>
                            </div>
                        </div>
                    </form>
                </dialog>

                {/* Main Chat Space */}
                <div className='relative overflow-hidden h-full flex flex-col w-full drawer'>
                    <div className={`${chats.length != 0 && "hidden"}  flex-1 flex flex-col items-center text-center w-full md:justify-center select-none`}>
                        <div className='text-4xl text-accent font-extrabold mt-10 md:mt-0'>MOJA</div>
                        <p className='text-md text-neutral dark:text-gray-300'>GPT as a Hat</p>
                        <div className='flex items-center mx-20 my-10'>
                            <Image alt='appicon' src={"/app_icon.jpg"} width={200} height={200} />
                        </div>

                        <div className='text-content md:mt-5 flex flex-col md:flex-row gap-2 md:animate-bounce text-etc text-sm break-all '>
                            Copyright 2023 ©{"\n"}
                            <Link href='https://github.com/teamMistake'>
                                <p className='cursor-pointer font-bold text-md'>Sema R&E teamMistake</p>
                            </Link>
                        </div>
                    </div>

                    {/* Chat UI */}
                    <main className={`${chats.length == 0 && "hidden"} w-full flex flex-col h-full`}>
                        <div className='w-full h-full flex flex-col items-center overflow-hidden'>
                            {/* TODO: Loading UX improve with Blurred CHAT UI */}
                            {chatLoading && <LoadingSpinner />}
                            <div className={`w-full overflow-y-scroll flex-1 ${chatLoading && "hidden"}`} ref={chatContainerRef}>
                                {chats.map((chat, i) => {
                                    return (
                                        <>
                                            <MessageBox key={i} {...chat} />
                                        </>
                                    );
                                })}

                                {error != "" && (
                                    <div className='flex justify-center'>
                                        <div className='w-[70%] md:w-[50%] pt-2 text-center'>
                                            <ErrorMessage>{error}</ErrorMessage>
                                        </div>
                                    </div>
                                )}
                                <div className='h-[50px]'></div>
                            </div>
                            <div className='w-full h-32 max-h-96'></div>
                        </div>
                    </main>

                    {/* Fixed Content UI */}
                    <div className='fixed box-content w-full bottom-0 flex items-center flex-col justify-center'>
                        {event == LOGIN_EVENT && (
                            <>
                                <BottomSelectorUI title='로그인 하실래요?'>
                                    <div
                                        className={`w-[50%] ${privacyError && "tooltip tooltip-open tooltip-top"}`}
                                        data-tip='개인정보처리방침을 동의해주세요.'
                                    >
                                        <button className='w-full btn btn-outline join-item' onClick={() => loginEventHandler()}>
                                            예
                                        </button>
                                    </div>
                                    <button onClick={() => alert("'예'를 누르고 자모와 더 대화해봐요.")} className='w-[50%] btn btn-outline join-item'>
                                        아니요
                                    </button>
                                </BottomSelectorUI>

                                <div className='flex flex-row mb-2 justify-center items-center'>
                                    <span className={`text-xs ${privacyError && "text-error"}`}>
                                        로그인을 진행하기 위해서{" "}
                                        <span className='text-md link'>
                                            {" "}
                                            <Link href='/privacy'>개인정보처리방침</Link>
                                        </span>
                                        을 동의합니다.
                                    </span>
                                    <div className='form-control'>
                                        <label className='label cursor-pointer'>
                                            <input
                                                type='checkbox'
                                                checked={privacyChecked}
                                                onChange={({ target: { checked } }) => setPrivacyChecked(checked)}
                                                className={`checkbox ${privacyError && "checkbox-error"}`}
                                            />
                                        </label>
                                    </div>
                                </div>
                            </>
                        )}

                        {event == SHARED_CONTENT_EVENT && (
                            <BottomSelectorUI title={`자모와 직접 대화를 시작해봐요! Let's just chat with JAMO`}>
                                <button className='btn btn-outline flex-1 max-w-[400px]' onClick={() => clearAll()}>
                                    시작하기
                                </button>
                            </BottomSelectorUI>
                        )}

                        {event == AB_MODEL_TEST_EVENT && ABBtnCount && (
                            <BottomSelectorUI title='어떤 대답이 가장 마음에 드시나요?'>
                                {Array(ABBtnCount)
                                    .fill(1)
                                    .map((_, i) => (
                                        <button key={i} onClick={() => selectABTestItem(i)} className='flex-1 btn btn-outline join-item'>
                                            {i + 1}번
                                        </button>
                                    ))}
                            </BottomSelectorUI>
                        )}

                        {event == RANK_RES_EVENT && !thankyou && (
                            <BottomSelectorUI title='직전 대화에서 자모의 대답을 평가해주세요.'>
                                <div className='flex flex-col gap-2'>
                                    <StarRating setRating={setRating} />
                                    <Button onClick={() => queryRateAnswer()}>제출하기</Button>
                                </div>
                            </BottomSelectorUI>
                        )}

                        {isMine && !loading && chats.length != 0 && (
                            <div className={`my-2 ${event != MSG_EVENT && "hidden"}`}>
                                <AnimateRegenerateButton onClick={Regenerate}>
                                    <span>다시 물어보기</span>
                                    <RegenerateIcon width='15' height='15' />
                                </AnimateRegenerateButton>
                            </div>
                        )}

                        {thankyou && (
                            <div className='p-5 flex flex-col justify-center text-center'>
                                <span className='text-xl'>{thankReason}</span>
                                <span className='text-4xl font-bold highlight dark:bg-none'>감사합니다!!</span>
                            </div>
                        )}

                        <form
                            onKeyDown={enterSubmit}
                            className={`flex w-full justify-center gap-2 md:gap-4 px-4 items-center ${(event != MSG_EVENT || thankyou || !isMine) && "hidden"}`}
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div className='relative flex-1 max-w-[48rem] flex flex-col justify-center items-center bg-white dark:bg-black rounded-xl shadow-xl '>
                                <div className='pl-[1rem] pr-[0.4rem] pt-[0.75rem] pb-[1.2rem] w-full relative flex flex-row'>
                                    <textarea
                                        maxLength={200}
                                        onKeyPress={enterSubmit}
                                        {...rest}
                                        ref={(e) => {
                                            ref(e);
                                            textAreaRef.current = e;
                                        }}
                                        className={`resize-none  border-box border-none outline-none w-full text-content leading-[1.5rem] align-middle overflow-hidden bg-white dark:bg-black dark:text-gray-100 dark:placeholder:text-white  ${
                                            errors.prompt && "placeholder:font-bold"
                                        }`}
                                        placeholder='무언가를 입력해주세요.'
                                    />
                                </div>
                                <div className='absolute left-4 bottom-[3px] text-content font-thin text-sm'>
                                    <span>{watch("prompt") ? watch("prompt").length : 0}/200</span>
                                </div>
                            </div>

                            <div className='flex h-[45px] w-[45px] md:h-[60px] md:w-[60px]'>
                                <AnimateSendButton disabled={loading} name='send'>
                                    {!loading ? <SendIcon width='27' height='27' /> : <span className='loading loading-spinner'></span>}
                                </AnimateSendButton>
                            </div>
                        </form>

                        {event != LOGIN_EVENT && (
                            <div className='pt-[6px] pb-[12px]'>
                                <span className='text-sm text-content'>저희는 귀여운 GPT를 만드는 세마고 R&E TeamMistake입니다.</span>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}
