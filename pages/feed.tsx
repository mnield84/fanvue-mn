import React from "react";
import { Container, Box, Typography, CircularProgress } from "@mui/material";
import type { NextPage } from "next";
import { useQuery } from "react-query";
import PostComments from "../components/postComments";
import Head from "next/head";

type Post = {
  id: number;
  title: string;
  body: string;
  commentsCount: number;
};

async function fetchPosts(): Promise<Post[]> {
  const postsResponse = await fetch(
    "https://jsonplaceholder.typicode.com/posts"
  );
  if (!postsResponse.ok) {
    throw new Error("Network response was not ok");
  }
  const posts: Post[] = await postsResponse.json();

  const commentsCountsPromises = posts.map(async (post) => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${post.id}/comments`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const comments = await response.json();
    return comments.length;
  });

  const commentsCounts = await Promise.all(commentsCountsPromises);

  return posts.map((post, index) => ({
    ...post,
    commentsCount: commentsCounts[index],
  }));
}

const Feed: NextPage = () => {
  const {
    data: posts,
    error,
    isLoading,
  } = useQuery<Post[]>("posts", fetchPosts);

  if (isLoading) return <CircularProgress />;
  if (error instanceof Error)
    return <Typography>Error: {error.message}</Typography>;

  return (
    <>
      <Head>
        <title>Feed | Fanvue - MNield</title>
        <meta
          name="description"
          content="Explore the latest posts and comments on our feed page."
        />
      </Head>
      <Container maxWidth="sm">
        {posts?.map((post) => (
          <Box key={post.id} my={2} p={2} boxShadow={3}>
            <Typography variant="h6">{post.title}</Typography>
            <Typography variant="body1">{post.body}</Typography>
            <PostComments postId={post.id} commentsCount={post.commentsCount} />
          </Box>
        ))}
      </Container>
    </>
  );
};

export default Feed;
