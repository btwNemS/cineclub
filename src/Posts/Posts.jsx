export default function Posts({filmId}) {
    async function getPosts() {
        const url = import.meta.env.VITE_API_URL+'/posts/getPostsTreeByFilmId/'+filmId;
        console.log(url);
    }
    return (
        <p>Test</p>
    )
}