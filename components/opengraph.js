import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

function Opengraph({ title, ogTitle, description, isMainPage = false }) {
    const router = useRouter();
    const URL = "https://chatmoja.seda.club/";
    const prefix = "모자와 대화 해모자. Chat with MOJA";

    return (
        <Head>
            <title>{isMainPage ? prefix : prefix + " | " + title}</title>
            <meta name='description' content={ description } />
            {isMainPage && <link rel='canonical' href='https://chatmoja.seda.club/' />}

            <meta property='og:url' content={URL + router.asPath} />
            <meta property='og:type' content='website' />
            <meta property='og:title' content={isMainPage ? prefix : prefix + " | " + title} />
            <meta property='og:description' content={description} />
            <meta property='og:image' content='/app_icon.jpg' />
        </Head>
    );
}

export default Opengraph;
