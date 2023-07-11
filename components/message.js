import { useEffect, useState } from "react";
import Image from "next/image";
import { CopyToClipboard } from "react-copy-to-clipboard";
import CopyIcon from "./copyicon";
import OkIcon from "./okicon";

const MessageBox = ({ mode, message }) => {
    const [payload, setPayload] = useState("");
    const [cursor, setCursor] = useState(0);
    const [updates, setUpdates] = useState(0);
    const [think, setThink] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (message == undefined) return;

        setPayload(message);

        if (mode == "user") {
            setCursor(message.length);
            return;
        }

        if (payload == "") {
            return setCursor(1);
        }
        setUpdates(updates + 1);
        setCursor(cursor);
    }, [message]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (cursor < message.length) {
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
            className={`flex flex-row ${mode == "user" ? "bg-user" : "bg-computer"} w-full px-[1rem] md:px-[10rem] py-[1.24rem] min-h-[104px] justify-between`}
        >
            <div className='min-w-[30px] md:min-w-[60px] relative'>
                <div className='rounded-md overflow-hidden'>
                    <Image alt='.' src={mode == "computer" ? "/hat.jpg" : "/you.jpg"} width={60} height={50} />
                </div>
                {(mode=="computer" && cursor != payload.length) && (
                    <div className='absolute top-1 right-[10px]'>
                        <Image alt="spinner" src='/spinner.png' className='animate-spin' width={40} height={40} />
                    </div>
                )}
            </div>

            <div className='mx-[0.8rem] md:mx-[2rem] box-border flex flex-col whitespace-pre-wrap break-words flex justify-start w-full'>
                {(mode=="computer" && cursor != payload.length) && <span className='text-xs text-white'>{think}</span>}
                <span className={`text-md text-gray-700 font-semibold  ${cursor != payload.length && "blinking-cursor"}`}>{payload.slice(0, cursor)}</span>
            </div>

            <div className='min-w-[30px] md:min-w-[60px]'>
                {/* {cursor != payload.length} */}
                {mode == "computer" && (
                    <>
                        {!copied && cursor == payload.length ? (
                            <CopyToClipboard text={payload} onCopy={() => setCopied(true)}>
                                <button className='p-1 text-green-800 rounded-md hover:bg-green-200 hover:text-green-500'>
                                    <CopyIcon color='currentColor' width='15' height='20' />
                                </button>
                            </CopyToClipboard>
                        ) : (
                            <button className='p-1 text-green-800 rounded-md hover:bg-green-200 hover:text-green-500'>
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
