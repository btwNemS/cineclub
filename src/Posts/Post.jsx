
import { Card, CardContent, Typography, CardActions, Button, TextField, Box } from "@mui/material";
import { useState } from "react";
import Reply from "./Reply";
import DeletePost from "../Components/deletePost";
import { useAuth } from "../Authentification";
import { useNavigate } from "react-router-dom";
import Like from "../Components/Like";


export default function Post({ content, children, level = 1, filmId, postId, userId, author, getRenderData }) {

    const answer = level > 1;
    const [showInput, setShowInput] = useState(false);
    const { user } = useAuth();

    return (
        <>
            <Card variant="outlined" sx={{
                mb: 1,
                ml: level * 2,

                borderRadius: 2,
                backgroundColor: answer ? "background.default" : "background.paper",
                borderLeft: "2px solid",
                borderLeftColor: answer ? "secondary.main" : "primary.main",
            }} >
                <CardContent >
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 0.5
                    }}>
                        <Typography variant="subtitle2"
                            sx={{
                                fontWeight: 600,
                                color: "secondary.main",
                                mb: 0.5,
                            }} >{author ?? "Utilisateur supprimé"}</Typography>
                        <Like postId={postId}/>
                    </Box>
                    <Typography variant="body2"
                        sx={{
                            fontSize: "0.9rem",
                            lineHeight: 1.5,
                            color: "text.primary",
                        }} >{content}</Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: "space-between" }}>
                    <Button size="small" color="primary" variant="outline"
                        sx={{
                            transition: "0.2s",
                            "&:hover": {
                                transform: "translateY(-2px)",
                                backgroundColor: "#5F647A",
                                color: "#FFFFFF",
                            },
                        }}
                        onClick={() => setShowInput(!showInput)} >Répondre</Button>
                    {((user && user.id === userId) || user?.role === "ADMIN") ? (
                        <DeletePost postId={postId} />
                    ) : null}
                </CardActions>


                {showInput && (
                    <CardContent>
                        <Reply
                            filmId={filmId}
                            postId={postId}
                            getRenderData={getRenderData}
                        />
                    </CardContent>
                )}
            </Card >
            {children.length > 0 && (
                <Box
                    sx={{
                        ml: level * 1.5,
                        display: "flex",
                        alignItems: "center",
                        height: 20,
                    }}
                >
                    <Box
                        sx={{
                            width: 20,
                            height: "100%",
                            borderLeft: "2px solid",
                            borderBottom: "2px solid",
                            borderColor: "text.primary", // PLUS VISIBLE
                            borderBottomLeftRadius: 8,
                            opacity: 0.6, // adoucit sans rendre invisible
                        }}
                    />
                </Box>
            )}
            {
                children.map((child) => (
                    <Post
                        key={child.id}
                        content={child.content}
                        children={child.children}
                        level={level + 1}
                        filmId={filmId}
                        postId={child.id}
                        userId={child.user_id}
                        author={child.author}
                        getRenderData={getRenderData}
                    />
                ))
            }

        </>
    );
}