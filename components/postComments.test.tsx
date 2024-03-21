import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import PostComments from "./postComments"; // Adjust the import path as necessary
import fetchMock from "jest-fetch-mock";
import { QueryClient, QueryClientProvider } from "react-query";

// Enable fetch mocking
fetchMock.enableMocks();

// Define the type for mock comments
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

  it('fetches and displays comments when the "Comments" button is clicked', async () => {
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
        <PostComments postId={1} />
      </QueryClientProvider>
    );

    // The button might not have "Comments (0)" if your component logic is different. Adjust as necessary.
    const commentsButton = await screen.findByRole("button", {
      name: /comments/i,
    });
    fireEvent.click(commentsButton);

    // Wait for comments to be fetched and displayed
    await waitFor(() => {
      expect(screen.getByText(comments[0].body)).toBeInTheDocument();
    });
  });
});
