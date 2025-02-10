"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { Visibility, VisibilityOff, Google } from "@mui/icons-material";

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: "100vh",
  display: "flex",
  borderRadius: 0,
  overflow: "hidden",
  border: "6px solid #FFCA40",
}));

import { createStyles } from "@mui/material/styles";
import Image from "next/image";
import { signIn } from "next-auth/react";

const ImageSection = styled(Box)(() =>
  createStyles({
    flex: 0.5,
    position: "relative",
    display: { xs: "none", md: "block" },
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "linear-gradient(to bottom, rgba(246, 236, 236, 0.3), )",
      zIndex: 1,
    },
  })
);

const FormSection = styled(Box)(({ theme }) => ({
  flex: 0.5,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(8),
  backgroundColor: "#FFCA40",
  color: "white",
}));

const GoogleButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.text.primary,
  "&:hover": {
    backgroundColor: theme.palette.grey[200],
  },
}));

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <StyledPaper elevation={0}>
      <ImageSection>
        <Box
          component="img"
          src="/image16.jpg"
          alt="Login background"
          sx={{
            width: "80%",
            height: "80%",
            objectFit: "cover",
            position: "relative",
            zIndex: 0,
          }}
        />

        <Box
          sx={{
            position: "absolute",
            bottom: 50,
            left: "25%",
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography
            color="#FFB22C"
            sx={{ fontWeight: "bold", fontSize: "30px" }}
          >
            Welcome to <span style={{ color: "#000000" }}> Foodie POS</span>
          </Typography>
          <Typography
            color="#F0A04B"
            sx={{
              fontWeight: "semi-bold",
              fontSize: "15px",
              fontFamily: "Monospace",
            }}
          >
            Experience Effortless Backoffice Managing
          </Typography>
        </Box>
      </ImageSection>

      <FormSection>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            maxWidth: 400,
            mx: "auto",
            width: "100%",
            color: "#000000",
          }}
        >
          <Typography variant="h3" gutterBottom>
            Welcome
          </Typography>
          <Typography variant="body1" mb={4}>
            Start Managing Your Accounts Faster and Better
          </Typography>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Email"
              InputLabelProps={{ shrink: false }}
              variant="outlined"
              margin="normal"
              sx={{ backgroundColor: "#FEF9F2", color: "white" }}
              disabled={isLoading}
            />
            <TextField
              fullWidth
              placeholder="Password"
              variant="outlined"
              margin="normal"
              sx={{ backgroundColor: "#FEF9F2", color: "white" }}
              type={showPassword ? "text" : "password"}
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Button
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            disabled={isLoading}
            sx={{
              mb: 2,
              backgroundColor: "#000000",
              color: "#FFCA40",
              ":hover": { backgroundColor: "#292828" ,color: "#FFCA40"},
            }}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <Box sx={{ my: 3 }}>
            <Divider>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>
          </Box>

          <GoogleButton
            fullWidth
            variant="contained"
            size="large"
            onClick={() => signIn("google", { callbackUrl: "/backoffice" })}
            startIcon={
              <Image src={"/google.png"} alt="Google" width={24} height={24} />
            }
            disabled={isLoading}
          >
            Continue with Google
          </GoogleButton>
        </Box>
      </FormSection>
    </StyledPaper>
  );
}
