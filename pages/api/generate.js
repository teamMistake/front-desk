import {Readable} from "stream";

export default async function generate(req, res){
    const data = JSON.parse(req.body)

    const resp = await fetch(`${process.env.NEXT_PUBLIC_API_LINK}/generate`, {
        body:  JSON.stringify(data),
        headers: {
            "Accept": "application/x-ndjson",
            "Content-Type": "application/json",
        },
        method: "POST",
    });
    const stream = Readable.fromWeb(resp.body);
    await stream.pipe(res);
}
