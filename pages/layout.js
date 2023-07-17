import { NextScript } from "next/document";
import Head from "next/head";
import { useEffect } from "react";
import MetaIcon from "../components/metaicon";

export default function RootLayout({ children }) {
    useEffect(() => {
        try{
            window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY);
        } catch (e) {
            return
        }
    }, []);  

    return (
        <main className='h-screen w-screen flex flex-col'>
            <Head>
                <script defer src='https://developers.kakao.com/sdk/js/kakao.min.js'></script>
            </Head>
            {/* <NextScript /> */}
            <MetaIcon />
            {children}
        </main>
    );
}
