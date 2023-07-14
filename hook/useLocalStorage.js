import { useEffect, useState } from "react";

const useLocalStorage = (key, initialState) => {
    const [state, setState] = useState(() => initialState);

    useEffect(() => {
        const result = JSON.parse(localStorage.getItem(key));
        setState(result)
    }, []);

    useEffect(() => {
        if(state != undefined){
            localStorage.setItem(key, JSON.stringify(state));
        }
    }, [key, state]);

    return [state, setState];
};

export default useLocalStorage;
