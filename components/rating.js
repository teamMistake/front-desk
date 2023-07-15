import { useEffect, useState } from "react";
import { Radio, RadioContext, RadioGroup } from "./radio";

const StarRating = ({ setRating }) => {
    const [value, setValue] = useState();

    useEffect(() => {
        if (!value) return;

        const rate = Number(value.split("_")[1]);
        setRating(rate)
    }, [value]);

    return (
        <>
            <div className='rating rating-lg p-2'>
                <RadioGroup value={value} onChange={setValue}>
                    <Radio value='rating_1' className='mask mask-star-2 bg-orange-400' />
                    <Radio value='rating_2' className='mask mask-star-2 bg-orange-400' />
                    <Radio value='rating_3' className='mask mask-star-2 bg-orange-400' />
                    <Radio value='rating_4' className='mask mask-star-2 bg-orange-400' />
                    <Radio value='rating_5' className='mask mask-star-2 bg-orange-400' />
                </RadioGroup>
            </div>
        </>
    );
};

export { StarRating };
