import { useEffect, useState } from "react";
import Image from "next/image";
import CopyIcon from "./copyicon";
import OkIcon from "./okicon";
import { COMPUTER, LOGIN_EVENT, MULTIPLE_MESSAGES, SINGLE_MESSAGE, USER } from "./constant";
import { IconButton } from "./button";
import copy from "copy-to-clipboard";

const MessageBox = ({ talker, prompt, event, onlive, messageId, isTalking = false, isSkeleton = false }) => {
    const [payload, setPayload] = useState();
    const [cursor, setCursor] = useState(1);
    const [updates, setUpdates] = useState(0);
    // const [end, setEnd] = useState(false);
    const [think, setThink] = useState("");
    const [copied, setCopied] = useState(false);
    const [type, setType] = useState();

    useEffect(() => {
        if (isSkeleton) return;
        if (prompt) {
            if (prompt.length > 0) {
                setType(() => (prompt.length == 1 ? SINGLE_MESSAGE : MULTIPLE_MESSAGES));
                setPayload(prompt);
            }
        }
    }, [prompt]);

    useEffect(() => {
        if (talker == USER) {
            setCursor(prompt[0].resp.length);
        }

        if (!payload || payload.length == 0 || type != SINGLE_MESSAGE) return;
        setUpdates(updates + 1);
    }, [payload]);

    useEffect(() => {
        if (!onlive || type != SINGLE_MESSAGE || talker == USER) return;

        // setEnd(cursor == payload[0]?.resp?.length);
        const timeout = setTimeout(() => {
            if (cursor < prompt[0].resp.length) {
                setCursor((c) => c + 1);
            }
            if (isTalking) {
                const arr = ["모자가 생각중...", "모자가 생각중..", "모자가 생각중."];
                setThink(arr[Math.floor(Math.random() * 3)]);
            }
        }, 50);

        return () => clearTimeout(timeout);
    }, [cursor, updates]);

    const onCopy = () => {
        const target_payload = payload.map((p) => p.resp).join("\n");

        copy(target_payload);
        setCopied(true);
    };

    useEffect(() => {
        if (!copied) return;

        const timeout = setTimeout(() => {
            setCopied(false);
        }, 1000);

        return () => clearTimeout(timeout);
    }, [copied]);

    return (
        <div
            className={`flex flex-row ${
                talker == USER ? "bg-base-200" : "bg-base-300"
            } w-full px-[1rem] md:px-[10rem] py-[1.7rem] min-h-[104px] justify-between gap-5 `}
        >
            <div className='flex flex-col min-w-[30px] md:min-w-[60px] relative'>
                <div className={`overflow indicator`}>
                    <div className={`select-none ${isTalking ? "rounded-t-md" : "rounded-md"} overflow-hidden`}>
                        <Image alt='.' src={talker == COMPUTER ? "/hat.jpg" : "/you.jpg"} width={60} height={50} />
                    </div>
                    {talker == COMPUTER && (isTalking || isSkeleton) && (
                        <span className='indicator-item badge badge-base-100 h-[30px] indicator-bottom indicator-center bottom-[-5px]'>
                            <span className='loading loading-dots w-[30px]'></span>
                        </span>
                    )}
                </div>
            </div>

            <div className='flex flex-1 flex-col whitespace-pre-wrap break-words justify-start w-full gap-2'>
                <div className='flex flex-col flex-1'>
                    {talker == COMPUTER && isTalking && <span className='text-xs text-success'>{think}</span>}

                    {payload && onlive && type == SINGLE_MESSAGE && (
                        <span className={`text-md  font-semibold ${isTalking && "blinking-cursor"}`}>{payload[0].resp.slice(0, cursor)}</span>
                    )}

                    {payload && !onlive && type == SINGLE_MESSAGE && (
                        <span className={`text-md font-semibold ${isTalking && "blinking-cursor"}`}>{payload[0].resp}</span>
                    )}

                    {payload && type == MULTIPLE_MESSAGES && (
                        <ul>
                            {payload.map((p, i) => (
                                <li
                                    key={i}
                                    className={`flex flex-row gap-2 justify-start p-2 ${
                                        p?.selected && " border-2 bg-[#fce041] text-primary dark:bg-white rounded-xl"
                                    }`}
                                >
                                    <span className='select-none w-[20px] text-xl font-bold '>{i + 1}.</span>
                                    <span className={`p-[1.5px] text-md ${p?.selected ? "font-bold " : "font-semibold"}`}>{p.resp}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    {isSkeleton && (
                        <div className='animate-pulse'>
                            <div className='h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 max-w-[540px] mb-2.5 mx-auto'></div>
                            <div className='h-2.5 mx-auto bg-gray-300 rounded-full dark:bg-gray-700 mb-2.5 max-w-[540px]'></div>
                            <div className='h-2.5 mx-auto bg-gray-300 rounded-full dark:bg-gray-700 max-w-[540px]'></div>
                        </div>
                    )}
                </div>
            </div>

            <div className='min-w-[30px] md:min-w-[60px]'>
                {talker == COMPUTER && !isSkeleton && (
                    <>
                        {!copied ? (
                            <IconButton onClick={() => onCopy()}>
                                <CopyIcon color='currentColor' width='15' height='20' />
                            </IconButton>
                        ) : (
                            <div className='tooltip tooltip-open' data-tip='Copied!'>
                                <IconButton>
                                    <OkIcon color='currentColor' width='20' height='20' />
                                </IconButton>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export { MessageBox };
