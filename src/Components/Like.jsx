import { useEffect, useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function LikePosts({postId}){

const [likes,setLikes] = useState([]);
const [like,liked] = useState(false);
const [animation,setAnimation] =useState(false)

useEffect(() => {
        const getLikes = async function getLikes() {
            const url = import.meta.env.VITE_API_URL + "/likes/getlikesByPostId/" + postId;

            console.log(url);

            const response = await fetch(url);
            const data = await response.json();

            console.log(data);
            setLikes(data);
        }

        getLikes();
    }, [postId]);

    return <div>Console </div>;

}