import MetaIcon from "../components/metaicon";

export default function RootLayout({ children }) {
    return (
        <main className='h-screen w-screen flex flex-col'>
            <MetaIcon />
            {children}
        </main>
    );
}
