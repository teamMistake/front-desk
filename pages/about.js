import { useRouter } from "next/router";
import { GhostButton } from "../components/button";
import Opengraph from "../components/opengraph";
import ContextIcon from "../components/contexticon";
import RankIcon from "../components/rankicon";

export default function Home() {
    const router = useRouter();
    const { share:contextId } = router.query;

    const exp_data = [
        `MOJA(모자)는 인공지능 언어모델 "자모"를`,
        `품은 인공지능 채팅 서비스입니다.`,
        `저희가 연구한 언어모델 자모는 GPT-3 등의`,
        `대규모 언어모델과 같은 준수한 성능을 지니면서,`,
        `낮은 성능의 컴퓨터에서 구동이 가능하도록`,
        `하는 것을 목표로 하는 모델입니다.`,
        `br`,
        `저희는 왜 이러한 연구를 진행하게 되었을까요?`,
        `br`,
        `인류의 AGI를 향한 도전이 계속되는 만큼,`,
        `지금까지 인공신경망을 기반으로 한 언어모델은`,
        `계속해서 발전해왔습니다.`,
        `br`,
        `특히 OpenAI의 GPT 언어모델은 매 버전마다`,
        `예상을 뛰어넘는 추론 성능을 보여줍니다.`,
        `그러나 이 거대한 모델들은 우리가 사용하는`,
        `보통의 컴퓨터에서는 작동시키기 어렵습니다.`,
        `br`,
        `GPT-4에는 1만 대의 A100이 사용되었던 것처럼,`,
        `대부분의 대형 언어모델은 훈련과`,
        `추론에 많은 컴퓨팅 자원을 요구합니다.`,
        `이는 결국 클라우드와 언어모델의 독점,`,
        `많은 컴퓨팅 자원 소비로 인한`,
        `환경 오염을 불러올 것입니다.`,
        `br`,
        `저희는`,
        `"단순히 모델의 크기를 줄여보면 어떨까?"`,
        `라는 작은 생각에서 출발하여,`,
        `인공지능 모델에 적대적 학습 방식을 도입하거나`,
        `RLHF로 Finetune 하는 것처럼`,
        `모델의 크기를 줄이면서도 성능을 높일 수 있는`,
        `방법을 고안하게 되었습니다.`,
        `br`,
        `저희는 여러분이 자모와 대화하며 평가한 데이터를`,
        `바탕으로 여러가지 실험을 진행하고,`,
        `자모의 성능을 향상시키기 위해`,
        `이 웹 서비스를 빌드하게 되었습니다.`,
        `따라서 이번 연구에서의 여러가지 실험 진행과`,
        `모델의 성능 향상을 위해서는`,
        `자모에 대한 여러분들의 많은 피드백이 필요합니다.`,
        `br`,
        `자모에게 여러분의 아름다운 이야기, 들려주실거죠?`
    ];

    const Content = ({exp}) => {
        if (exp === `br`) return <div className="w-[90%] max-w-[400px] h-[0.2rem] bg-base-200 my-3" />;
        return (
            <div className="flex w-full justify-center">
                <span className="flex text-md md:text-2xl font-semibold mx-10 justify-center text-center w-full p-1">{exp}</span>
            </div>
        );
    }

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
            <main className='bg-greyscale-1 flex flex-row h-screen w-screen overflow-hidden'>
                <div className='relative overflow-hidden overflow-y-auto h-full flex flex-col w-full'>
                    {/* <div className="menu-title"> */}
                    <div className="bg-primary-content flex flex-col min-h-[560px] justify-end items-end p-4 pattern-paper pattern-blue-500 pattern-bg-white pattern-size-10 pattern-opacity-90 mb-20">
                        <span className='leading-[90px] text-[70px] md:text-[100px] dark:text-neutral  text-primary select-none font-extrabold text-right'>
                        모두다.<br/> 자모는 할 수 있다
                        </span>
                    </div>

                    {/* Explanation of JAMO */}
                    <div className="flex w-full flex-col items-center justify-center">
                    {exp_data && (exp_data.map((data, i) => {
                        return <Content key={i} exp={data}/>;
                    }))}
                    </div>
                    

                    <div className="m-40" />
                </div>
            </main>
        </>
    );
}
