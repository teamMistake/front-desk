import Image from "next/image";
import { set, useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MessageBox } from "../components/message";
import ndjsonStream from "can-ndjson-stream";
import { AnimateButton, AnimateRegenerateButton, AnimateSendButton, Button } from "../components/button";
import { ErrorMessage } from "../components/error";
import { AB_MODEL_TEST_EVENT, COMPUTER, COMPUTING_LIMITATION_ERROR, LOGIN_EVENT, LOGIN_TRIGGER_NUM, MSG_EVENT, NON_INPUT_ERROR, RANK_RES_EVENT, USER } from "../components/constant";
import useLocalStorage from "../hook/useLocalStorage";
import BottomSelectorUI from "../components/bottomSelector";
import { RegenerateIcon } from "../components/regenerateicon";
import { useRouter } from "next/router";
import { StarRating } from "../components/rating";

export default function Home() {
    const router = useRouter();

    // Chat state list of chat item.
    const [chats, setChats] = useState([]);
    // Chatting Ref for scroll down.
    const chatContainerRef = useRef(null);
    const textAreaRef = useRef(null);

    // Loading State for Disable the chatting while getting the response.
    const [loading, setLoading] = useState(false);
    const [update, setUpdate] = useState(0);
    // Set error while responding.
    const [error, setError] = useState(false);

    const [auth, setAuth] = useState(false);

    const [event, setEvent] = useState(MSG_EVENT);

    // If your visit is first or not
    const [firstVisit, setFirstVisit] = useLocalStorage("firstVisit");

    const [privacyChecked, setPrivacyChecked] = useState(false);
    const [privacyError, setPrivacyError] = useState(false);

    const [rating, setRating] = useState(5)

    // Thankyou Container for better User Experience
    const [thankyou, setThankYou] = useState(false)
    const [thankReason, setThankReason] = useState("")

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        setError: setFormError,
    } = useForm();

    const { ref, ...rest } = register("prompt");

    // =========================== START EVENT =================================
    useEffect(() => {
        setChats([{talker: USER, prompt:"안녕 반가워.", event: MSG_EVENT}, {talker: COMPUTER, prompt:"반가워요.", event: MSG_EVENT}])

        const { redirectFromPrivacy } = router.query;
        if (redirectFromPrivacy) {
            setEvent(LOGIN_EVENT);
        }
    }, []);

    // =========================== GENERATE CHAT EVENT =================================
    const onSubmit = (data) => {
        const prompt = data.prompt;

        const removedSpaceValue = prompt.replace(/(\r\n|\n|\r)/gm, "");
        if (removedSpaceValue == "" || loading) {
            setFormError("prompt", { message: NON_INPUT_ERROR });
            return;
        }

        setValue("prompt", "");

        const chat = {
            talker: USER,
            prompt: prompt,
            event: MSG_EVENT,
        };

        return setChats([...chats, chat]);
    };

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
    const Regenerate = () => {
        // const target_prompt = chats[chats.length - 2].prompt;
        const _chats = chats;
        let target_prompt;
        for (let i = 1; i <= _chats.length; i++) {
            const target = _chats[_chats.length - i];
            if (target.talker == USER) {
                target_prompt = target.prompt;
                break;
            }
        }
        if (!target_prompt) {
            return;
        }
        const data = { prompt: target_prompt };
        return handleSubmit(onSubmit(data));
    };

    const PostGenerate = async (prompt) => {
        const data = { req: prompt, model: "prod", stream: true, max_token: 120, context: [] };

        // Timeout Detector
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // just wait for 10s

        const _chats = chats;
        const stream = fetch("/api/generate", { body: JSON.stringify(data), method: "POST", signal: controller.signal })
            .then((response) => ndjsonStream(response.body))
            .then((stream) => {
                clearTimeout(timeoutId);
                const streamReader = stream.getReader();
                streamReader.read().then(async (response) => {
                    while (!response || !response.done) {
                        response = await streamReader.read();
                        if (response.done) {
                            setLoading(false);
                            return;
                        }

                        const chat = {
                            talker: COMPUTER,
                            prompt: response.value.resp_full,
                            event: MSG_EVENT,
                        };
                        setChats([..._chats, chat]);
                    }
                });

                randomRatingEventTrigger()
            })
            .catch((e) => {
                setError(COMPUTING_LIMITATION_ERROR);
            });
    };

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
                prompt: "자모와 대화를 더 나누기 위해서는 로그인이 필요합니다...",
                event: LOGIN_EVENT,
            };

            // LOGIN EVENT Trigger
            setEvent(LOGIN_EVENT);

            return setChats([..._chats, login_request_data]);
        }

        if (chats[chats.length - 1].talker == USER) {
            setLoading(true);
            const target_prompt = chats[chats.length - 1].prompt;
            PostGenerate(target_prompt);
        }

        if (chats.length != update) {
            scrollToBottom();
            setUpdate(chats.length);
        }
    }, [chats]);

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

    const scrollToBottom = () => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    };

    // =========================== AUTH EVENT =================================
    // =========================== LOGIN =================================
    const loginEventHandler = () => {
        if (!privacyChecked) return setPrivacyError(true);

        console.log("DEX LOGIN");
    };

    // =========================== RELOGIN REQUEST =================================
    const showAuthModal = () => {
        return window.login_request_modal.showModal();
    };

    // =========================== PRIVACY EVENT =================================
    useEffect(() => {
        if (privacyChecked) setPrivacyError(false);
    }, [privacyChecked]);


    // =========================== RATING EVENT =================================
    const randomRatingEventTrigger = () => {
        const trigger = Math.floor((Math.random())*10)==3        
        if (!trigger) return

        // If random rating event triggered
        setEvent(RANK_RES_EVENT)
    }

    const queryRateAnswer = () => {
        // TODO: SEND REQUEST TO SERVER

        // AFTER
        setThankYou(true)
        setThankReason("답변해주셔서")
    }

    // ========================= UX Animation Event Controller =======================
    useEffect(() => {
        if (thankyou) {
            const tout = setTimeout(() => {
                setThankYou(false)
            }, 1000)
    
            return () => clearTimeout(tout)
        }
    }, [thankyou])

    return (
        <>
            <main className='bg-base-100 flex flex-row h-full w-screen overflow-hidden'>
                {/* LOGIN REQUEST MODAL FOR OUTDATED TOKEN USER */}
                <dialog id='login_request_modal' className='modal'>
                    <form method='dialog' className='modal-box'>
                        <div className='w-full flex justify-center'>
                            <BottomSelectorUI title='다시 로그인해주세요.'>
                                <button className='w-[50%] btn btn-outline join-item' onClick={() => loginEventHandler()}>
                                    예
                                </button>
                                <button className='w-[50%] btn btn-outline join-item'>
                                    아니요
                                </button>
                            </BottomSelectorUI>
                        </div>
                    </form>
                </dialog>

                {/* Main Chat Space */}
                <div className='relative overflow-hidden h-full flex flex-col w-full'>
                    <div className={`${chats.length != 0 && "hidden"}  flex-1 flex flex-col items-center text-center w-full md:justify-center`}>
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
                            <div className='w-full overflow-y-scroll flex-1' ref={chatContainerRef}>
                                {chats.map((chat, i) => {
                                    return (
                                        <>
                                            <MessageBox key={i} {...chat} />
                                            {/* <div className="divider m-0"></div> */}
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

                        {event == AB_MODEL_TEST_EVENT && (
                            <BottomSelectorUI title='어떤 대답이 가장 마음에 드시나요?'>
                            <button className='w-[30%] btn btn-outline join-item'>1번</button>
                            <button className='w-[30%] btn btn-outline join-item'>2번</button>
                            <button className='w-[30%] btn btn-outline join-item'>3번</button>
                        </BottomSelectorUI>
                        )}

                        {(event == RANK_RES_EVENT && !thankyou) && (
                            <BottomSelectorUI title='직전 대화에서 자모의 대답을 평가해주세요.'>
                                <div className="flex flex-col gap-2">
                                <StarRating setRating={setRating} />
<Button onClick={() => queryRateAnswer()}>제출하기</Button>
                                </div>
                        </BottomSelectorUI>
                        )}

                        {!loading && chats.length != 0 && (
                            <div className={`my-2 ${event != MSG_EVENT && "hidden"}`}>
                                <AnimateRegenerateButton onClick={Regenerate}>
                                    <span>다시 물어보기</span>
                                    {/* <Image alt='regenerate' src='/regenerate.svg' width={18} height={18} /> */}
                                    <RegenerateIcon width='15' height='15' />
                                </AnimateRegenerateButton>
                            </div>
                        )}

                        {thankyou && (
                            <div className='p-5 flex flex-col justify-center text-center'>
                            <span className="text-xl">{thankReason}</span>
                            <span className='text-4xl font-bold highlight dark:bg-none'>감사합니다!!</span>
                        </div>
                        )}

                        <form
                            onKeyDown={enterSubmit}
                            className={`flex w-full justify-center gap-2 md:gap-4 px-4 items-center ${(event != MSG_EVENT && !thankyou) && "hidden"}`}
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
                                        // {...register("prompt", { required: true })}
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
                                {/* <button
                                    disabled={loading}
                                    className={`text-gray-700  border border-gray-300 focus:outline-none hover:bg-gray-100 font-medium rounded-lg text-sm px-4 h-full py-5 shadow-lg ${
                                        loading ? "cursor-wait bg-gray-100" : "cursor-pointer bg-white"
                                    }`}
                                >
                                    <span className='font-bold text-xs md:text-sm'>SEND</span>
                                </button> */}
                                <AnimateSendButton disabled={loading}>
                                    {!loading ? (
                                        <Image src='/white_hand.png' alt='' width={30} height={30} />
                                    ) : (
                                        <span className='loading loading-spinner'></span>
                                    )}
                                </AnimateSendButton>
                            </div>
                        </form>
                        {/* {errors.prompt && errors.prompt.message != "" && <span className=' text-sm text-error font-bold'>{errors?.prompt.message}</span>} */}

                        {event != LOGIN_EVENT && (
                            <div className='pt-[6px] pb-[12px]'>
                                <span className='text-sm text-content'>저희는 귀여운 GPT를 만드는 세마인입니다.</span>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}
