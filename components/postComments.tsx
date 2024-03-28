import React from "react";
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
  commentsCount: number;
};

export default function PostComments({
  postId,
  commentsCount,
}: PostCommentsProps) {
  const [showComments, setShowComments] = useState(false);
  const { data: comments, isLoading } = useQuery<Comment[]>(
    ["comments", postId],
    () => fetchComments(postId),
    {
      enabled: showComments,
      staleTime: 1000 * 60 * 5,
    }
  );

  const handleToggleComments = () => setShowComments(!showComments);

  if (!isLoading && comments?.length === 0) {
    return;
  }

  return (
    <Box mt={2}>
      {isLoading ? (
        <CircularProgress size={20} />
      ) : (
        <Button onClick={handleToggleComments} aria-expanded={showComments}>
          {showComments ? "Hide" : `Comments (${commentsCount})`}
        </Button>
      )}
      {showComments && comments && (
        <Box mt={2} aria-live="polite" aria-atomic="true">
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
