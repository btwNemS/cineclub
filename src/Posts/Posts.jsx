import { useState, useEffect } from "react";
import Post from "./Post";
import CreatePost from "./CreatePost";
import apiFetch from "../Components/tokencheck";

export default function Posts({ filmId }) {
    const [posts, setPosts] = useState([]);

    const getRenderData = async () => {
        const response = await apiFetch(import.meta.env.VITE_API_URL + "/posts/getPostsTreeByFilmId/" + filmId);

        const data = await response.json();
        setPosts(data);
    };

    useEffect(() => {
        const getPosts = async function getPosts() {
            const url = import.meta.env.VITE_API_URL + "/posts/getPostsTreeByFilmId/" + filmId;

            console.log(url);

            const response = await apiFetch(url);
            const data = await response.json();

            console.log(data);
            setPosts(data);
        }

        getPosts();
    }, [filmId]);

    return (
        <>
            <CreatePost
                filmId={filmId}
                getRenderData={getRenderData}
            />
            {posts.map((post) => (
                <Post
                    key={post.id}
                    content={post.content}
                    children={post.children}
                    filmId={filmId}
                    postId={post.id}
                    userId={post.user_id}
                    author={post.author}
                    getRenderData={getRenderData}
                />
            ))}
        </>
    );
}