import React from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export default function NotFound() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        bgcolor: "background.default",
      }}
    >
      <Typography component="h1" variant="h3" fontWeight="bold" gutterBottom>
        404
      </Typography>
      <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
        Page not found
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: "center" }}>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button component={Link} to="/" variant="contained" size="large">
        Go to home
      </Button>
    </Box>
  );
}
