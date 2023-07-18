import { useRouter } from "next/router";
import { GhostButton } from "../components/button";
import Opengraph from "../components/opengraph";
import ContextIcon from "../components/contexticon";

export default function Home() {
    const router = useRouter();

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
                    <GhostButton onClick={() => router.back()}>
                        <span className="text-xs">Back</span>
                    </GhostButton>
                </div>
            </div>
            <main className="bg-greyscale-1 flex flex-row h-screen w-screen">
                <div className="relative overflow-hidden h-full flex flex-col w-full">
                    <div>
                        <span className="font-bold text-3xl text-accent justify-center my-10 flex select-none">Our Story</span>
                        <span>
                            {/* JAMO STORY */}
                            {`
                            MOJA(모자)는 언어모델 "자모"를 기반으로 한 인공지능 채팅 서비스입니다.
                            자모는 GPT-3 같은 대규모 언어모델과 비등한 성능을 가지면서도, 낮은 성능의 컴퓨터에서도 구동이 가능하도록 하는 것을 목표로 하는 모델입니다.
                            저희는 왜 이러한 연구를 진행하게 되었을까요?
                            AGI를 향한 도전이 계속되는 만큼, 인공신경망을 기반으로 한 언어모델은 계속해서 발전해왔습니다.
                            특히 GPT 계열의 언어모델은 매년 진화해가고 있다는 표현이 어울릴 정도로, 어마무시한 성능을 가지고 있습니다.
                            그러나 이러한 모델은 일반적인 장치에서는 구동할 수 없습니다.
                            GPT-4에는 1만대의 A100이 사용되었던 것처럼, 대부분의 대형 언어모델은 훈련뿐만 아니라 추론시에도 많은 컴퓨팅 자원을 요구합니다.
                            이는 결국 클라우드 또는 언어모델의 독점과 많은 컴퓨팅 자원 소비로 인한 환경 오염 등의 문제를 야기합니다.
                            저희는 "단순히 모델의 크기를 줄여보면 어떨까?"라는 생각에서 출발하여, 인공지능 모델에 적대적 학습 방식이나 RLHF를 적용하는 등 모델의 크기를 줄이면서도, 성능은 유지하는 방법을 고안하게 되었습니다.
                            따라서 이번 연구를 진행하기 위해서는 자모의 응답에 대한 피드백 데이터가 필요하여, 이 웹 페이지를 빌드하게 되었습니다.
                            저희 자모에게 세상의 아름다운 이야기, 들려주실거죠?
                            `}
                        </span>
                    </div>
                </div>
            </main>
        </>
    );
}