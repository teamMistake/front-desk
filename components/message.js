import { useEffect, useState } from "react";
import Image from "next/image";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CopyIcon from "./copyicon";
import OkIcon from "./okicon";
import { Button } from "./button";
import { LOGIN_EVENT } from "./constant";

const MessageBox = ({ talker, prompt, event }) => {
    const [payload, setPayload] = useState("");
    const [cursor, setCursor] = useState(0);
    const [updates, setUpdates] = useState(0);
    const [think, setThink] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (prompt == undefined) return;

        setPayload(prompt);

        if (talker == "user") {
            setCursor(prompt.length);
            return;
        }

        if (payload == "") {
            return setCursor(1);
        }
        setUpdates(updates + 1);
        setCursor(cursor);
    }, [prompt]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (cursor < prompt.length) {
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
                talker == "user" ? "bg-primary-3" : "bg-primary-2"
            } w-full px-[1rem] md:px-[10rem] py-[1.24rem] min-h-[104px] justify-between gap-5`}
        >
            <div className='min-w-[30px] md:min-w-[60px] relative'>
                <div className='rounded-md overflow-hidden'>
                    <Image alt='.' src={talker == "computer" ? "/hat.jpg" : "/you.jpg"} width={60} height={50} />
                </div>
                {talker == "computer" && cursor != payload.length && (
                    <div className='absolute top-1 right-[10px]'>
                        <Image alt='spinner' src='/spinner.png' className='animate-spin' width={40} height={40} />
                    </div>
                )}
            </div>

            <div className='flex flex-1 flex-col whitespace-pre-wrap break-words justify-start w-full gap-2'>
                <div className='flex flex-col flex-1'>
                    {talker == "computer" && cursor != payload.length && <span className='text-xs text-white'>{think}</span>}
                    <span className={`text-md text-gray-800 font-semibold  ${cursor != payload.length && "blinking-cursor"}`}>{payload.slice(0, cursor)}</span>
                </div>
                {event == LOGIN_EVENT && (
                    <div className='flex gap-1'>
                        <button className=' text-white bg-primary-1 focus:outline-none hover:bg-secondary-1 cursor-pointer font-bold text-md px-5 py-1.5 rounded-2xl shadow-md'>
                            <span className="underline underline-offset-1">{"LOGIN"}</span>
                        </button>
                    </div>
                )}
            </div>

            <div className='min-w-[30px] md:min-w-[60px]'>
                {talker == "computer" && (
                    <>
                        {!copied ? (
                            <CopyToClipboard text={payload} onCopy={() => setCopied(true)}>
                                <button className='p-1 text-secondary rounded-sm hover:bg-secondary-2 hover:text-green-500'>
                                    <CopyIcon color='currentColor' width='15' height='20' />
                                </button>
                            </CopyToClipboard>
                        ) : (
                            <button className='p-1 text-secondary rounded-sm hover:bg-secondary-2 hover:text-green-500'>
                                <OkIcon color='currentColor' width='20' height='20' />
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export { MessageBox };
