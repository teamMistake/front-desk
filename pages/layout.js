import Head from "next/head";
import { useEffect } from "react";
import MetaIcon from "../components/metaicon";

export default function RootLayout({ children }) {
    useEffect(() => {
        try {
            window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_API_KEY);
        } catch (e) {
            console.log(e);
            return;
        }
    }, []);

    return (
        <main className='md:h-screen w-screen flex flex-col absolute inset-0'>
            <Head>
                <script defer src='https://developers.kakao.com/sdk/js/kakao.min.js'></script>
            </Head>
            <MetaIcon />
            {children}
        </main>
    );
}
