import Head from "next/head";
import Link from "next/link";

const metadata = {
    title: "모자와 대화해봐요.",
    description: "2023 R&E Project by 물실 소프트웨어 엔지니어 일동",
    twitter: {
        card: "summary_large_image",
        title: "MOJA",
        description: "GPT as a HAT",
        creator: "@teamMistake",
        images: ["/app_icon.jpg"],
    },
    icons: {
        icon: "/app_icon.jpg",
        shortcut: "/icons/favicon-96x96.png",
        apple: "/icons/apple-icon.png"
    },
};

export default function RootLayout({ children }) {
    return (
        <>
            <div className="my-3">
                <Link className="font-bold mx-7" href="/">Chat</Link>
                <Link className="font-bold" href="/rank">Rank</Link>
            </div>
            <Head>
                <title>모자와 대화해봐요. Chat with MOJA.</title>
                <meta description="2023 R&E Project by 물실 소프트웨어 엔지니어 일동" />
                <link rel="apple-touch-icon" sizes="57x57" href="/icons/apple-icon-57x57.png" />
                <link rel="apple-touch-icon" sizes="60x60" href="/icons/apple-icon-60x60.png" />
                <link rel="apple-touch-icon" sizes="72x72" href="/icons/apple-icon-72x72.png" />
                <link rel="apple-touch-icon" sizes="76x76" href="/icons/apple-icon-76x76.png" />
                <link rel="apple-touch-icon" sizes="114x114" href="/icons/apple-icon-114x114.png" />
                <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-icon-120x120.png" />
                <link rel="apple-touch-icon" sizes="144x144" href="/icons/apple-icon-144x144.png" />
                <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-icon-152x152.png" />
                <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-icon-180x180.png" />
                <link rel="icon" type="image/png" sizes="192x192"  href="/icons/android-icon-192x192.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="96x96" href="/icons/favicon-96x96.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
                <meta name="msapplication-TileImage" content="/icons/ms-icon-144x144.png" />
            </Head>
            {children}
            </>
    );
}
