import Image from "next/image";
import { MOJA_DESC } from "./constant";

const KakaoBtn = ({ shareURL }) => {
    const onClick = () => {
        const { Kakao, location } = window;

        Kakao.Share.sendDefault({
            objectType: "feed",
            content: {
                title: "저와 자모의 재미있는 대화 한번 보실래요?",
                description: MOJA_DESC,
                imageUrl: "https://chatmoja.seda.club/app_icon.jpg",
                link: {
                    mobileWebUrl: shareURL,
                    webUrl: shareURL,
                },
            },
            buttons: [
                {
                    title: "대화 보러 가기",
                    link: {
                        mobileWebUrl: shareURL,
                        webUrl: shareURL,
                    },
                },
            ],
        });
    };

    return (
        <button className='rounded-full overflow-hidden' onClick={() => onClick()}>
            <Image src='/kakao.png' alt='kakao' width={48} height={48} />
        </button>
    );
};

export { KakaoBtn };
