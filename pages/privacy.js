import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { GhostButton } from "../components/button";
import Opengraph from "../components/opengraph";

export default function Home() {
    const router = useRouter();

    return (
        <>
            <Opengraph title="개인정보처리방침" description="개인정보처리방침 안내 페이지입니다." />
            <div className='navbar bg-base-100 border-b-2'>
                <div className='navbar-start'>
                    <GhostButton onClick={() => router.push("/")}>MOJA</GhostButton>
                </div>
                <div className='navbar-center'></div>
                <div className='navbar-end'>
                    <GhostButton onClick={() => router.push("/rank")}>Rank</GhostButton>
                </div>
            </div>
            <div className='relative flex w-full text-md text-content justify-center items-center '>
                <div className='max-w-[640px] p-4 flex flex-col gap-10 break-words whitespace-break-spaces'>
                    <div className='text-xs max-h-[600px] overflow-hidden overflow-y-scroll'>
                        <span>
                            {`JAMO 빌드 팀은 이용자들의 개인정보보호를 매우 중요시하며, 개인정보보호법, 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 개인정보 보호와 관련된 법령상의 개인정보보호 규정을 준수하고 있습니다.

아래와 같이 개인정보처리방침을 명시하여 이용자가 제공한 개인정보가 어떠한 용도와 방식으로 이용되고 있으며 개인정보보호를 위해 어떠한 조치를 취하는지 알려드립니다.

이용자는 개인정보의 수집, 이용, 제공, 위탁 등과 관련한 아래 사항에 대하여 원하지 않는 경우 동의를 거부할 수 있습니다. 다만, 이용자가 동의를 거부하는 경우 서비스의 전부 또는 일부를 이용할 수 없음을 알려드립니다.

1. 개인정보의 수집 및 이용 목적
JAMO 빌드 팀이 수집한 개인정보는 다음의 목적을 위해 활용합니다.
    1) 웹 회원관리
    웹으로 가입한 회원이 홈페이지 이용에 따른 본인확인, 개인식별, 불량회원의 부정이용 방지와 비인가 사용 방지, 가입의사 확인, 가입 및 가입횟수 제한
    2) 모델 성능 향상 
    더욱 안전하고 성능이 높은 모델을 제공하기 위해 질문 데이터를 수집 
2. 수집하는 개인정보 항목 및 수집방법
    1) 수집하는 개인정보 항목
        (1) 월드비전은 최초 회원가입 또는 서비스 이용시 회원 및 후원자님께 최적화된 서비스를 제공하기 위해 아래와 같은 정보를 수집 합니다.
        [일반, SNS 로그인시]
        ① 필수항목 : 유저 이메일, 닉네임
    2) 수집방법
    JAMO 빌드 팀은 다음과 같은 방법으로 개인정보를 수집합니다.
        (1) 모델과의 대화 로그 기록
3. 수집하는 개인정보의 보유 및 이용기간
원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 다음의 정보에 대해서는 아래의 이유로 명시한 기간 동안 보존합니다.
    1) SNS 소셜 로그인 개인정보
        ① 보존항목: 유저 정보
        ② 보존근거: 서비스 제공
        ③ 보존기간: 서비스 탈퇴 전까지 
    2) 모델과의 대화 
        ① 보존항목: 대화 기록과 유저 아이디
        ② 보존근거: 모델 성능 향상 
        ③ 보존기간: 모델 훈련전까지 

4. 개인정보의 파기절차 및 방법
회사는 원칙적으로 이용자의 개인정보를 후원 중단 또는 철회, 회원 탈퇴 시 지체없이 파기하고 있습니다. 단, 이용자에게 개인정보 보관기간에 대해 별도의 동의를 얻은 경우, 또는 법령에서 일정 기간 정보보관 의무를 부과하는 경우에는 해당 기간 동안 개인정보를 안전하게 보관합니다.
    1) 파기절차
    이용자가 회원가입 등을 위해 입력하신 정보는 이용목적이 달성된 후 파기 됩니다. 다만, 법령에 따라(보유 및 이용기간 참조) 일정 기간 저장된 후 파기될 수 있습니다. 동 개인정보는 법률에 의한 경우가 아니고서는 보전되는 이외의 다른 목적으로 이용되지 않습니다.
    2) 파기방법
    종이(인쇄물, 서면 등)에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기하고 전자적 파일형태로 저장된 개인정보는 복원이 불가능한 방법으로 영구 삭제합니다.
`}
                        </span>
                    </div>
                </div>
                <div className='fixed bottom-0 w-full max-w-[640px] p-3'>
                    <Link
                        href={{
                            pathname: "/",
                            query: { redirectFromPrivacy: true },
                        }}
                    >
                        <button className='w-full btn btn-primary'>돌아가기</button>
                    </Link>
                </div>
            </div>
        </>
    );
}
