import { useState, useEffect } from "react";
import { GhostButton } from "../components/button";
import { useRouter } from "next/router";
import { useUser } from "../hook/useUser";
import Opengraph from "../components/opengraph";
import ContextIcon from "../components/contexticon";

export default function Home() {
    const [ranks, setRanks] = useState([]);
    const [myrank, setMyRank] = useState();
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    const router = useRouter();
    // get user identity by api
    const [isAuth, userID] = useUser();

    // Define Rank Element
    // gets user id by ranks form, but not visible
    const Rank = ({username, rank, score}) => {
        return (
            // text size adjustment by rank in row 1~3
            <tr className={""
            + (rank == 0 ? "text-3xl " : "")
            + (rank == 1 ? "text-2xl " : "")
            + (rank == 2 ? "text-xl " : "")
            + (rank > 2 ? "text-base " : "")
            + (username == myrank.username ? "text-white bg-base-content border-none " : "text-gray-600 ")}>
                <th>{rank + 1}</th>
                <th>{username}</th>
                <th>{score}</th>
            </tr>
        )
    };

    // get rank by fetch(GET)
    const getRank = () => {
        const res = fetch("/api/leaderboard", {
            method: "GET"
        }).then((res) => res.json()).then((res) => {
            setRanks(res);
            setLoaded(true);
        }).catch((e) => {
            setError(true);
        });
    };

    // get myrank by fetch(GET)
    const getMyRank = () => {
        const res = fetch("/api/leaderboard/me", {
            method: "GET"
        }).then((res) => res.json()).then((res) => {
            setMyRank(res);
        }).catch((e) => {
            setError(true);
        });
    };

    // fetch again in 10s
    useEffect(() => {
        const timeInterval = setInterval(() => {
            getRank();
            getMyRank();
        }, 10000);

        return () => clearInterval(timeInterval)
    }, []);

    // get Error
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
            {/* Navigation bar */}
            <div className='navbar bg-base-100 border-b-2'>
                <div className='navbar-start'>
                    <GhostButton onClick={() => router.push("story")}>MOJA</GhostButton>
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
                    <div className="flex-1 overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr className="text-base text-content dark:bg-none select-none">
                                        <th>Top</th>
                                        <th>Name</th>
                                        <th>Score</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Users Rank */}
                                    {loaded && (ranks.map((data, i) => {
                                        {
                                            return <Rank key={i} {...data} />
                                        }
                                    }))}
                                </tbody>
                            </table>

                            {!loaded && (
                                <div className="fixed p-2 flex w-full justify-center">
                                    <span className="text-xl font-bold dark:bg-none select-none">순위를 가져오는 중입니다...</span>
                                </div>
                            )}
                            {!isAuth && (
                                <div className="fixed bottom-0 p-5 flex w-full justify-center">
                                    <span className="text-xl font-bold highlight dark:bg-none select-none">로그인 정보를 불러올 수 없습니다...</span>
                                </div>
                            )}
                            {(isAuth && myrank.rank > 9) && (
                                <table className="table fixed bottom-0">
                                    <thead>
                                        <tr className="text-base text-content select-none border-none">
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* My Rank (fixed) */}
                                        <Rank {...myrank} />
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
            </main>
        </>
    );
}