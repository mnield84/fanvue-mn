// components/PostComments.tsx
import { useState } from "react";
import { useQuery } from "react-query";
import { Typography, Button, Box, CircularProgress } from "@mui/material";

type Comment = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};

async function fetchComments(postId: number): Promise<Comment[]> {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

type PostCommentsProps = {
  postId: number;
};

export default function PostComments({ postId }: PostCommentsProps) {
  const [showComments, setShowComments] = useState(false);
  const { data: comments, isLoading } = useQuery<Comment[]>(
    ["comments", postId],
    () => fetchComments(postId),
    {
      enabled: showComments, // Only fetch comments when requested
    }
  );

  const handleToggleComments = () => setShowComments(!showComments);

  return (
    <Box mt={2}>
      {isLoading ? (
        <CircularProgress size={20} />
      ) : (
        <Button onClick={handleToggleComments}>
          {showComments ? "Hide" : `Comments (${comments?.length || 0})`}
        </Button>
      )}
      {showComments && comments && (
        <Box mt={2}>
          {comments.map((comment) => (
            <Box key={comment.id} mt={1} p={1} boxShadow={2}>
              <Typography variant="body2">{comment.body}</Typography>
              <Typography variant="caption">{comment.email}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
