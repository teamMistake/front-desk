import Image from "next/image";
import { set, useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MessageBox } from "../components/message";
import ndjsonStream from "can-ndjson-stream";

export default function Home() {
    const [chats, setChat] = useState([]);
    const chatContainerRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [update, setUpdate] = useState(0);
    const [error, setError] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        setLoading(true);
        const prompt = data.prompt;
        setValue("prompt", "");

        const chat = {
            mode: "user",
            message: prompt,
        };
        return setChat([...chats, chat]);
    };

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

    const PostGenerate = async (message) => {
        const data = { req: message, model: "prod", stream: true, max_token: 120, context: [] };

        // Timeout Detector
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // just wait for 10s

        const _chats = chats;
        const stream = fetch("/api/generate", { body: JSON.stringify(data), method: "POST", signal: controller.signal })
            .then((response) => ndjsonStream(response.body))
            .then((stream) => {
                clearTimeout(timeoutId)
                const streamReader = stream.getReader();
                streamReader.read().then(async (response) => {
                    while (!response || !response.done) {
                        response = await streamReader.read();
                        if (response.done) {
                            setLoading(false);
                            return;
                        }

                        const chat = {
                            mode: "computer",
                            message: response.value.resp_full,
                        };
                        setChat([..._chats, chat]);
                    }
                });
            })
            .catch((e) => {setError(true)});
    };

    useEffect(() => {
      if (!error) return
      scrollToBottom()
      const timeout = setTimeout(() => {
        setLoading(false)
        setError(false)
      }, 1000)

      return () => clearTimeout(timeout)
    }, [error])

    const regenerate = () => {
        const target_prompt = chats[chats.length - 2].message;
        const data = { prompt: target_prompt };
        return handleSubmit(onSubmit(data));
    };

    const scrollToBottom = () => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    };

    useEffect(() => {
        if (chats.length == 0) return;
        if (chats[chats.length - 1].mode == "user") {
            const target_prompt = chats[chats.length - 1].message;
            PostGenerate(target_prompt);
        }

        if (chats.length != update) {
            scrollToBottom();
            setUpdate(chats.length);
        }
    }, [chats]);

    return (
        <>
            <main className='flex flex-row h-screen w-screen'>
                {/* Main Chat Space */}
                <div className='relative overflow-hidden h-full flex flex-col w-full bg-lblue'>
                    <div
                        className={`${
                            chats.length != 0 && "hidden"
                        }  flex-1 flex flex-col items-center text-center flex-col w-full justify-center items-center `}
                    >
                        <div className='text-4xl text-title font-extrabold'>MOJA</div>
                        <p className='text-md text-content'>GPT as a Hat</p>
                        <div className='flex items-center mx-20 my-10'>
                            <Image alt='appicon' src={"/app_icon.jpg"} width={200} height={200} />
                        </div>

                        <div className='mt-5 flex flex-col md:flex-row flex-row gap-2 animate-bounce text-etc text-sm break-all '>
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
                                    return <MessageBox key={i} mode={chat.mode} message={chat.message} />;
                                })}

                                {error && (
                                    <div className=' flex justify-center '>
                                      <div className="w-[70%] md:w-[50%] pt-2 text-center">
                                        <span className='text-red-400  font-md text-sm whitespace-pre-wrap '>
                                            지금 저희 서버가 수많은 사용자분의 요청을 받고 있어 답변에 어려움을 겪고 있습니다.
                                             잠시만 기다려 주세요.
                                        </span>
                                      </div>
                                    </div>
                                )}
                                <div className="h-[20px]"></div>
                            </div>
                            <div className='w-full h-32 max-h-96'></div>
                        </div>
                    </main>

                    {/* Fixed Content UI */}
                    <div className='fixed box-content w-full bottom-0 flex justify-center items-center flex-col'>
                        {(!loading && chats.length) != 0 && (
                            <button
                                onClick={() => regenerate()}
                                className='text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 my-2'
                            >
                                <div className='flex flex-row gap-2'>
                                    <span>다시 물어보기</span>
                                    <div>
                                        <Image alt='regenerate' src='/regenerate.svg' width={18} height={18} />
                                    </div>
                                </div>
                            </button>
                        )}
                        <form onKeyDown={enterSubmit} className='flex w-full justify-center ' onSubmit={handleSubmit(onSubmit)}>
                            <div className='relative w-[90%] max-w-[48rem] flex flex-col justify-center align-center items-center bg-white  rounded-xl shadow-xl'>
                                <div className='pl-[1rem] pr-[0.4rem] pt-[0.75rem] pb-[1.2rem] w-full relative flex flex-row'>
                                    <textarea
                                        maxLength={200}
                                        onKeyPress={enterSubmit}
                                        {...register("prompt", { required: true })}
                                        className='resize-none  border-box border-none outline-none w-full text-gray-600 leading-[1.5rem] align-middle overflow-hidden bg-white'
                                        placeholder='무언가를 입력해주세요.'
                                    />

                                    <button disabled={loading}>
                                        <Image alt='sendbutton' src='/send.png' width={40} height={40} />
                                    </button>
                                </div>
                                <div className="absolute left-4 bottom-[3px] text-gray-600 font-thin text-sm">
                                  <span>{watch("prompt") ? watch("prompt").length :0}/200</span>
                                </div>
                                {/* {errors.command && <span className='pl-2 text-sm text-green-900 font-bold'>무언가를 입력해주세요.</span>} */}
                            </div>
                        </form>

                        <div className='pt-[6px] pb-[12px]'>
                            <span className='text-sm text-[#6B705C]'>저희는 귀여운 GPT를 만드는 세마인입니다.</span>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
