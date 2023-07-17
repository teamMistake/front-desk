import { useState, useEffect } from "react";
import { GhostButton } from "../components/button";
import { useRouter } from "next/router";
import { useUser } from "../hook/useUser";
import Opengraph from "../components/opengraph";
import ContextIcon from "../components/contexticon";

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
            <Opengraph
                title=''
                ogTitle=''
                description={`MOJA(모자)는 언어모델 "자모"를 기반으로 한 인공지능 채팅 서비스입니다. 자모는 GPT-3 같은 대규모 언어모델과 비등한 성능을 가지면서도, 낮은 성능의 컴퓨터에서도 구동이 가능할 수 있도록 만들어진 인공지능 언어 모델입니다. ChatGPT와 비교하자면 낮은 성능을 보이기는 하지만… OpenAI는 몇천억을 들여서 모델을 만들고 저희는 무자본으로 만들었는걸요. 이런 “자모”와 한번 대화해 볼래요?`}
                isMainPage={false}
            />
            <div className='navbar bg-base-100 border-b-2'>
                <div className='navbar-start'>
                    <GhostButton onClick={() => router.push("")}>MOJA</GhostButton>
                </div>
                <div className='navbar-center'></div>
                <div className="navbar-end">
                    <GhostButton onClick={() => router.push("/")}>
                        <ContextIcon width="30" height="30" />
                        <span className="text-xs">Chat</span>
                    </GhostButton>
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
    );
}