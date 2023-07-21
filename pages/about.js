import { useRouter } from "next/router";
import { GhostButton } from "../components/button";
import Opengraph from "../components/opengraph";
import ContextIcon from "../components/contexticon";
import RankIcon from "../components/rankicon";

export default function Home() {
    const router = useRouter();
    const { contextId } = router.query;

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
                    <span className='normal-case font-semibold text-xl mx-5 select-none'>MOJA</span>
                </div>
                <div className='navbar-center'></div>
                <div className='navbar-end'>
                    <GhostButton
                        onClick={() =>
                            router.push({
                                pathname: "/",
                                query: { share: contextId ? contextId : "" },
                            })
                        }
                    >
                        <ContextIcon width='30' height='30' />
                        <span className='text-xs'>Chat</span>
                    </GhostButton>
                    <GhostButton
                        onClick={() =>
                            router.push({
                                pathname: "/rank",
                                query: { share: contextId ? contextId : "" },
                            })
                        }
                    >
                        <RankIcon width='30' height='30' />
                        <span className='text-xs'>Rank</span>
                    </GhostButton>
                </div>
            </div>
            <main className='bg-greyscale-1 flex flex-row h-screen w-screen'>
                <div className='relative overflow-hidden h-full flex flex-col w-full'>
                    <span className='text-6xl text-accent justify-start m-10 flex select-none font-extrabold container'>
                        자모는 할 수있다
                        <br />
                        모든지.
                    </span>
                    <div className='flex justify-center m-10'>
                        <span className='text-3xl max-w-xs'>Sample Text</span>
                    </div>
                </div>
            </main>
        </>
    );
}
