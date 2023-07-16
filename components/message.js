import { useEffect, useState } from "react";
import Image from "next/image";
import CopyIcon from "./copyicon";
import OkIcon from "./okicon";
import { COMPUTER, LOGIN_EVENT, USER } from "./constant";
import { IconButton } from "./button";
import copy from "copy-to-clipboard";

const MessageBox = ({ talker, prompt, event, onlive }) => {
    const [payload, setPayload] = useState([]);
    const [cursor, setCursor] = useState(0);
    const [updates, setUpdates] = useState(0);
    const [think, setThink] = useState("");
    const [copied, setCopied] = useState(false);
    const [end, setEnd] = useState(false)

    useEffect(() => {
        if (prompt == undefined) return;

        setPayload(prompt);

        if (talker == USER || !onlive) {
            setCursor(prompt[0].resp.length);
            return;
        }
    }, [prompt]);

    useEffect(() => {
        if (!payload || payload.length == 0) return
        if (payload[0].resp == "") {
            return setCursor(1);
        }
        setUpdates(updates + 1);
        setCursor(cursor);
    }, [payload])

    useEffect(() => {
        if (!onlive) return setEnd(true);

        setEnd(cursor == payload[0]?.resp?.length)

        const timeout = setTimeout(() => {
            if (cursor < prompt[0].resp.length) {
                const arr = ["모자가 생각중...", "모자가 생각중..", "모자가 생각중."];
                setThink(arr[Math.floor(Math.random() * 3)]);
                setCursor((c) => c + 1);
            }
        }, 50);

        return () => clearTimeout(timeout);
    }, [cursor, updates]);

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
                    <div className={`${!end ? "rounded-t-md" : "rounded-md"} overflow-hidden`}>
                        <Image alt='.' src={talker == COMPUTER ? "/hat.jpg" : "/you.jpg"} width={60} height={50} />
                    </div>
                    {talker == COMPUTER && !end && (
                        <span className='indicator-item badge badge-base-100 h-[30px] indicator-bottom indicator-center bottom-[-5px]'>
                            <span className='loading loading-dots w-[30px]'></span>
                        </span>
                    )}
                </div>
            </div>

            <div className='flex flex-1 flex-col whitespace-pre-wrap break-words justify-start w-full gap-2'>
                <div className='flex flex-col flex-1'>
                    {talker == COMPUTER && !end && <span className='text-xs text-success'>{think}</span>}

                    {(payload && payload.length == 1) ? (
                        <span className={`text-md  font-semibold ${!end && "blinking-cursor"}`}>{payload[0].resp.slice(0, cursor)}</span>
                    ) : (
                        <ul>
                            {payload.map((p, i) => (
                                <li key={i} className="flex flex-row gap-2 justify-start items-center">
                                    <span className="text-xl font-bold">{i+1}.</span>
                                    <span className={`text-md ${p?.selected ? "font-bold" : "font-semibold"}`}>{p.resp}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className='min-w-[30px] md:min-w-[60px]'>
                {talker == COMPUTER && (
                    <>
                        {!copied ? (
                            <IconButton
                                onClick={() => {
                                    copy(payload);
                                    setCopied(true);
                                }}
                            >
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
