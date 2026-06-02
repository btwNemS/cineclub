
import { Card, CardContent, Typography, CardActions, Button, TextField } from "@mui/material";
import { useState } from "react";
import Reply from "./Reply";



export default function Post({ content, children, level = 1, filmId, postId, getRenderData }) {

    const answer = level > 1;
    const [showInput, setShowInput] = useState(false);

    return (
        <>
            <Card variant="outlined" sx={{
                minWidth: 275, ml: level * 3,
                backgroundColor: answer ? "background.default" : "background.paper",
                borderLeft: "2px solid",
                borderLeftColor: answer ? "secondary.main" : "primary.main",
            }} >
                <CardContent style={{ marginLeft: `${level * 30}px` }}>
                    <Typography variant='body1' >{content}</Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" variant="outline" color="primary"
                        sx={{
                            transition: "0.2s",
                            "&:hover": {
                                transform: "translateY(-2px)",
                                backgroundColor: "#5F647A",
                                color: "#FFFFFF"
                            },
                        }}
                        onClick={() => setShowInput(!showInput)} >Répondre</Button>
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
            </Card>
            <Typography variant='h5' style={{ marginLeft: `${level * 30}px` }} >Réponses</Typography>
            {children.map((child) => (
                <Post
                    key={child.id}
                    content={child.content}
                    children={child.children}
                    level={level + 1}
                    filmId={filmId}
                    postId={child.id}
                    getRenderData={getRenderData}
                />
            ))}

        </>
    );
}