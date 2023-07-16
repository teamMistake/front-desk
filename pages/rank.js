import { useState, useEffect } from "react";

export default function Home() {
    const [ranks, setRanks] = useState([]);

    const getRank = () => {
        const response = fetch({/* getRankAPI */}, {
            method: "GET"
        })
        .then((res) => res.json()).then((res) => {
            setRanks(res);
        })
    };

    useEffect(() => {
        const timeInterval = setInterval(() => {
            getRank();
        }, 10000);

        return () => clearInterval(timeInterval)
    }, []);

    const Rank = (rank, name, token) => {
        if(rank === 1){
        }
        return (
            <tr className={"text-content "
            + (rank == 1 ? "text-3xl" : "")
            + (rank == 2 ? "text-2xl" : "")
            + (rank == 3 ? "text-xl" : "")
            + (rank > 3 ? "text-base" : "")}>
                <th>{rank}</th>
                <th>{name}</th>
                <th>{token}</th>
            </tr>
        )
    };

    return (
        <main className="bg-greyscale-1 flex flex-row h-screen w-screen">
            <div className="relative overflow-hidden h-full flex flex-col w-full">
                <p className="font-bold text-3xl text-primary justify-center my-10 flex">Rank</p>
                <div>
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr className="text-base text-content">
                                    <th>Top</th>
                                    <th>Name</th>
                                    <th>Token</th>
                                </tr>
                            </thead>
                            <tbody>
                                    <tr className="text-4xl text-primary">
                                        <th>1</th>
                                        <th>윤승현</th>
                                        <th>1024</th>
                                    </tr>
                                    <tr className="text-3xl text-primary">
                                        <th>2</th>
                                        <th>송시영</th>
                                        <th>512</th>
                                    </tr>
                                    <tr className="text-2xl text-white bg-base-content">
                                        <th>3</th>
                                        <th>임청원</th>
                                        <th>256</th>
                                    </tr>
                                    <tr className="text-xl text-primary">
                                        <th>4</th>
                                        <th>이호빈</th>
                                        <th>128</th>
                                    </tr>
                                    <tr className="text-base text-primary">
                                        <th>5</th>
                                        <th>이성호</th>
                                        <th>64</th>
                                    </tr>
                                    <tr className="text-base text-primary">
                                        <th>6</th>
                                        <th>장윤형</th>
                                        <th>32</th>
                                    </tr>
                                    <tr className="text-base text-primary">
                                        <th>7</th>
                                        <th>정명락</th>
                                        <th>16</th>
                                    </tr>
                                    <tr className="text-base text-primary">
                                        <th>8</th>
                                        <th>이수성</th>
                                        <th>8</th>
                                    </tr>
                                    <tr className="text-base text-primary">
                                        <th>9</th>
                                        <th>조수혁</th>
                                        <th>4</th>
                                    </tr>
                                    <tr className="text-base text-primary">
                                        <th>10</th>
                                        <th>자모</th>
                                        <th>2</th>
                                    </tr>
                                {ranks.map((data, i) => {
                                    return <Rank key={i} {...data} />
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    )
}