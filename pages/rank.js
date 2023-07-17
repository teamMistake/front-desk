import { useState, useEffect } from "react";
import { GhostButton } from "../components/button";
import { useRouter } from "next/router";
import { useUser } from "../hook/useUser";

export default function Home() {
    const [ranks, setRanks] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    const router = useRouter();
    const {isAuth, userID} = useUser();

    const Rank = (user, rank, name, score) => {
        return (
            <tr className={""
            + (rank == 1 ? "text-3xl " : "")
            + (rank == 2 ? "text-2xl " : "")
            + (rank == 3 ? "text-xl " : "")
            + (rank > 3 ? "text-base " : "")
            + (user == currentUser ? "text-white bg-base-content fixed" : "text-primary ")}>
                <th>{rank}</th>
                <th>{name}</th>
                <th>{score}</th>
            </tr>
        )
    };

    const getRank = () => {
        const res = fetch("/api/ranking", {
            method: "GET"
        })
        .then((res) => res.json()).then((res) => {
            setRanks(res);
            setLoaded(true);
        }).catch((e) => {
            setError(true);
        });
    };

    useEffect(() => {
        const timeInterval = setInterval(() => {
            getRank();
        }, 10000);

        return () => clearInterval(timeInterval)
    }, []);

    useEffect(() => {
        if (!error) return;
        const timeout = setTimeout(() => {
            setError("");
        }, 1000);

        return () => clearTimeout(timeout);
    }, [error]);

    return (
        <>
            <div className='navbar bg-base-100 border-b-2'>
                <div className='navbar-start'>
                    <GhostButton onClick={() => router.push("")}>MOJA</GhostButton>
                </div>
                <div className='navbar-center'></div>
                <div className="navbar-end">
                    <GhostButton onClick={() => router.push("/")}>Chat</GhostButton>
                </div>
            </div>

            <main className="bg-greyscale-1 flex flex-row h-screen w-screen">
                <div className="relative overflow-hidden h-full flex flex-col w-full">
                    <p className="font-bold text-3xl text-accent justify-center my-10 flex select-none">Rank</p>
                    <div>
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr className="text-base text-content select-none">
                                        <th>Top</th>
                                        <th>Name</th>
                                        <th>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Users Rank (Scrollable) */}
                                    {ranks.map((data, i) => {
                                        if (i < 10 && loaded === true){
                                            return <Rank key={i} {...data} />
                                        }
                                    })}
                                    {/* My Rank (fixed) */}
                                    {ranks.map((data, i) => {
                                        if (isAuth === true
                                            && ranks[i].user == userID
                                            && i >= 10
                                            && loaded === true){
                                            return <Rank key={i} {...data} />
                                        }
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}