import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PostComments from "./postComments";
import fetchMock from "jest-fetch-mock";
import { QueryClient, QueryClientProvider } from "react-query";

fetchMock.enableMocks();

type Comment = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};

const comments: Comment[] = [
  {
    postId: 1,
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    body: "This is a comment",
  },
];

describe("PostComments", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('fetches and displays comments when the "Show Comments" button is clicked', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(comments));

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <PostComments postId={1} commentsCount={comments.length} />
      </QueryClientProvider>
    );

    const commentsButton = screen.getByRole("button", {
      name: `Comments (${comments.length})`,
    });
    fireEvent.click(commentsButton);

    await waitFor(() => {
      expect(screen.getByText(comments[0].body)).toBeInTheDocument();
      expect(screen.getByText(comments[0].email)).toBeInTheDocument();
    });
  });
});
