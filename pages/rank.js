import Image from "next/image";
import { set, useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MessageBox } from "../components/message";
import ndjsonStream from "can-ndjson-stream";

export default function Home() {
    return (
        <main className="flex flex-row h-screen w-screen">
            <div className="flex justify-center w-full">
                <p className="font-weight text-3xl justify-center">Rank</p>
            </div>
        </main>
    )
}