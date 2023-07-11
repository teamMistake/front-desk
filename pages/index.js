import Image from "next/image";
import { set, useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MessageBox } from "../components/message";
import ndjsonStream from "can-ndjson-stream";
import { Button } from "../components/button";
import { ErrorMessage } from "../components/error";
import useAutosizeTextArea from "../hook/useAutosizeTextArea";
import { COMPUTING_LIMITATION_ERROR, LOGIN_EVENT, MSG_EVENT } from "../components/constant";

export default function Home() {
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

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm();

    const { ref, ...rest } = register('prompt');

    const onSubmit = (data) => {
        const prompt = data.prompt;
        setValue("prompt", "");

        const chat = {
            talker: "user",
            prompt: prompt,
            event: MSG_EVENT,
        };
        return setChats([...chats, chat]);
    };

    useEffect(() => {
        if (textAreaRef.current.style) {
            textAreaRef.current.style.height = "0px";
            const scrollHeight = textAreaRef.current.scrollHeight;

            if (scrollHeight < 24*2){
                textAreaRef.current.style.height = scrollHeight*2 + "px";
            } else {
                textAreaRef.current.style.height = scrollHeight + "px"
            }
        }
    }, [textAreaRef, watch("prompt")]);

    // Disable return key event.
    const enterSubmit = (e) => {
        if (e.nativeEvent.isComposing) return;
        if (e.key === "Enter" && e.shiftKey == false) {
            e.preventDefault();
            const value = e.target.value;
            if (value == "" || loading) {
                return;
            }

            const data = { prompt: value };
            return handleSubmit(onSubmit(data));
        }
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
                            talker: "computer",
                            prompt: response.value.resp_full,
                            event: MSG_EVENT,
                        };
                        setChats([..._chats, chat]);
                    }
                });
            })
            .catch((e) => {
                setError(COMPUTING_LIMITATION_ERROR);
            });
    };

    const regenerate = () => {
        const target_prompt = chats[chats.length - 2].prompt;
        const data = { prompt: target_prompt };
        return handleSubmit(onSubmit(data));
    };

    useEffect(() => {
        if (chats.length == 0) return;

        // Login Event Trigger
        if (chats[chats.length - 1].talker == "user" && chats.length >= 1 && !auth) {
            const _chats = chats;

            const login_request_data = {
                talker: "computer",
                prompt: "저, 자모와 대화를 더 나누기 위해서는 로그인을 필요합니다...",
                event: LOGIN_EVENT,
            };

            return setChats([..._chats, login_request_data]);
        }

        if (chats[chats.length - 1].talker == "user") {
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

    return (
        <>
            <main className='bg-greyscale-1 flex flex-row h-full w-screen overflow-hidden'>
                {/* Main Chat Space */}
                <div className='relative overflow-hidden h-full flex flex-col w-full bg-lblue'>
                    <div className={`${chats.length != 0 && "hidden"}  flex-1 flex flex-col items-center text-center w-full justify-center`}>
                        <div className='text-4xl text-primary font-extrabold'>MOJA</div>
                        <p className='text-md text-content'>GPT as a Hat</p>
                        <div className='flex items-center mx-20 my-10'>
                            <Image alt='appicon' src={"/app_icon.jpg"} width={200} height={200} />
                        </div>

                        <div className='text-content mt-5 flex flex-col md:flex-row gap-2 animate-bounce text-etc text-sm break-all '>
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
                                    return <MessageBox key={i} {...chat} />;
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
                        {(!loading && chats.length) != 0 && (
                            <div className='my-2'>
                                <Button onClickFunc={regenerate}>
                                    <div className='flex flex-row gap-2'>
                                        <span>다시 물어보기</span>
                                        <div>
                                            <Image alt='regenerate' src='/regenerate.svg' width={18} height={18} />
                                        </div>
                                    </div>
                                </Button>
                            </div>
                        )}
                        <form onKeyDown={enterSubmit} className='flex w-full justify-center gap-2 md:gap-4 px-4 items-center' onSubmit={handleSubmit(onSubmit)}>
                            <div className='relative flex-1 max-w-[48rem] flex flex-col justify-center items-center bg-white  rounded-xl shadow-xl'>
                                <div className='pl-[1rem] pr-[0.4rem] pt-[0.75rem] pb-[1.2rem] w-full relative flex flex-row'>
                                    <textarea
                                        maxLength={200}
                                        onKeyPress={enterSubmit}
                                        {...rest}
                                        ref={(e) => {
                                            ref(e)
                                            textAreaRef.current = e
                                        }}
                                        // {...register("prompt", { required: true })}
                                        className='resize-none  border-box border-none outline-none w-full text-content leading-[1.5rem] align-middle overflow-hidden bg-white'
                                        placeholder='무언가를 입력해주세요.'
                                    />
                                </div>
                                <div className='absolute left-4 bottom-[3px] text-content font-thin text-sm'>
                                    <span>{watch("prompt") ? watch("prompt").length : 0}/200</span>
                                </div>
                                {/* {errors.command && <span className='pl-2 text-sm text-green-900 font-bold'>무언가를 입력해주세요.</span>} */}
                            </div>
                            <div className='flex max-w-[100px]'>
                                <button
                                    disabled={loading}
                                    className={`text-gray-700  border border-gray-300 focus:outline-none hover:bg-gray-100 font-medium rounded-lg text-sm px-4 h-full py-5 shadow-lg ${
                                        loading ? "cursor-wait bg-gray-100" : "cursor-pointer bg-white"
                                    }`}
                                >
                                    {/* <Image alt='sendbutton' src='/send.png' width={40} height={40} /> */}
                                    <span className='font-bold text-xs md:text-sm'>SEND</span>
                                </button>
                            </div>
                        </form>

                        <div className='pt-[6px] pb-[12px]'>
                            <span className='text-sm text-content'>저희는 귀여운 GPT를 만드는 세마인입니다.</span>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
