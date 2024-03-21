import {
  Box,
  Grid,
  Modal,
  Typography,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useQuery } from "react-query";
import { useState } from "react";
import Image from "next/image";

type Photo = {
  id: number;
  albumId: number;
  title: string;
  url: string;
  thumbnailUrl: string;
};

async function fetchPhotos(): Promise<Photo[]> {
  const albumId = 1; // Specify the album ID you're interested in
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/albums/${albumId}/photos`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export default function Vault() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const { data: photos, isLoading, error } = useQuery("photos", fetchPhotos);
  const [open, setOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState("");

  const handleOpen = (imgUrl: string) => {
    setOpen(true);
    setSelectedImg(imgUrl);
  };
  const handleClose = () => setOpen(false);

  if (isLoading) return <Typography>Loading...</Typography>;
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
            ></Box>
          </Grid>
        ))}
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: matches ? "50%" : "50%",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
            <img
              src={selectedImg}
              alt="Full size"
              style={{ width: "100%", height: "auto" }}
            />
          </Box>
        </Box>
      </Modal>
    </Container>
  );
}
