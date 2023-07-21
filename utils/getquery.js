import queryString from "query-string";
import { useEffect, useState } from "react";

const UseQuery = (name) => {
    const [query, setQuery] = useState();

    useEffect(() => {
        console.log(location.search)
        const parsed = queryString.parse(location.search);
        console.log(parsed)
        setQuery(parsed[name]);
    }, []);

    return [query];
};

export { UseQuery };
