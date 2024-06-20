import {useParams} from "react-router-dom";

export default function Browser()
{
    const {id} = useParams();
    if (id === undefined) window.location.href = "/site-browser/new";
    return (
        <div>
            <h1>Browser {id}</h1>
        </div>
    );
}