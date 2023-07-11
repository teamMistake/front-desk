import Image from "next/image";
import { set, useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MessageBox } from "../components/message";
import ndjsonStream from "can-ndjson-stream";

export default function Home() {
    const [rank, setRank] = useState();
    const getRank = (req) => {
        const data = {req : req};
        const response = fetch("getRankAPI")
        .then((response) => ndjsonStream(response.body));
        console.log(response);
    };

    getRank(rank);

    return (
        <main className="flex flex-row h-screen w-screen">
            <div className="relative overflow-hidden h-full flex flex-col w-full bg-lblue">
                <p className="font-bold text-3xl justify-center my-10 flex w-full">Rank</p>
                <div>
                    <div>
                        {/* Rank Div (Scrollable) */}
                        <div className="border border-1 bg-primary-4  border-transparent">
                            <div className="flex justify-between">
                                <p className="font-semibold text-gray-700 m-8">1. 이성호</p>
                                <p className="font-semibold text-gray-700 m-8">Token : 1024</p>
                            </div>
                        </div>
                        <div className="border border-1 bg-primary-4  border-transparent">
                            <div className="flex justify-between">
                                <p className="font-semibold text-gray-700 m-8">2. 윤승현</p>
                                <p className="font-semibold text-gray-700 m-8">Token : 512</p>
                            </div>
                        </div>
                        <div className="border border-1 bg-primary-4  border-transparent">
                            <div className="flex justify-between">
                                <p className="font-semibold text-gray-700 m-8">3. 송시영</p>
                                <p className="font-semibold text-gray-700 m-8">Token : 256</p>
                            </div>
                        </div>
                        {/* My rank (fixed) */}
                        <div className="fixed top-96 left-0 right-0 border border-1 bg-primary-4  border-black mt-96">
                            <div className="flex justify-between">
                                <p className="font-semibold text-gray-700 m-8">14. 임청원</p>
                                <p className="font-semibold text-gray-700 m-8">Token : 2</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}