import React, { useState } from "react";
import { Box, Grid, Typography, Container, Skeleton } from "@mui/material";
import { useQuery } from "react-query";
import CustomModal from "../components/modal";

type Photo = {
  id: number;
  albumId: number;
  title: string;
  url: string;
  thumbnailUrl: string;
};

async function fetchPhotos(): Promise<Photo[]> {
  const albumId = 1;
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/albums/${albumId}/photos`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export default function Vault() {
  const { data: photos, isLoading, error } = useQuery("photos", fetchPhotos);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState("");

  const handleOpen = (imgUrl: string) => {
    setSelectedImg(imgUrl);
    setModalOpen(true);
  };

  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {Array.from(new Array(12)).map((_, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <Box sx={{ width: "100%", paddingTop: "100%" }}>
              <Skeleton variant="rectangular" width="100%" height="100%" />
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error instanceof Error)
    return <Typography>Error: {error.message}</Typography>;

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2}>
        {photos?.map((photo) => (
          <Grid item xs={6} sm={4} md={3} key={photo.id}>
            <Box
              sx={{
                backgroundImage: `url(${photo.thumbnailUrl})`,
                backgroundSize: "cover",
                width: "100%",
                paddingTop: "100%",
                cursor: "pointer",
              }}
              onClick={() => handleOpen(photo.url)}
            />
          </Grid>
        ))}
      </Grid>
      {modalOpen && (
        <CustomModal
          openInitially={modalOpen}
          onClose={() => setModalOpen(false)}
          selectedImg={selectedImg}
        />
      )}
    </Container>
  );
}
