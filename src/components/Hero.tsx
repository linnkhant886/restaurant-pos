import { Box, Button, Slide, Typography } from "@mui/material";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column-reverse", md: "row" },
        justifyContent: "center",
        p: { xs: 3, md: 4 },
        alignItems: "center",
        backgroundImage: "url('/heroCurve.svg')",
      }}
      id="hero"
    >
      <Slide
        direction="down"
        in={true}
        mountOnEnter
        unmountOnExit
        timeout={1000}
      >
        <Box >
          <Typography
            sx={{
              maxWidth: 700,
              mb: { xs: 2, md: 4 },
              fontSize: { xs: "16px", md: "25px" },
              fontWeight: "bold",
            }}
          >
            Revolutionize Your Restaurant Management
          </Typography>
          <Typography
            sx={{
              maxWidth: 550,
              mb: 3,
            }}
          >
            Simplify operations, enhance customer experiences, and streamline
            your workflow with our all-in-one POS system. With powerful
            back-office control and an innovative mobile QR menu, managing your
            restaurant has never been easier. Elevate your service and
            efficiency today!
          </Typography>

          <Box
            sx={{
              display: "flex",
              position: "relative",
            
            }}
          >
            <Link href={`/order?tableId=1`}>
              <Button
                variant="contained"
                sx={{
                  fontSize: { xs: "12px", md: "16px" },
                  mr: 2,
                  width: "fit-content",
                  backgroundColor: "#74E291",
                  ":hover": { backgroundColor: "#6EC207" },
                  color: "black",
                }}
              >
                Order App
              </Button>
            </Link>
            <Link href={`/backoffice`}>
              <Button
                variant="contained"
                sx={{
                  fontSize: { xs: "12px", md: "16px" },
                  width: "fit-content",
                  backgroundColor: "#74E291",
                  ":hover": { backgroundColor: "#6EC207" },
                  color: "black",
                }}
              >
                Backoffice App
              </Button>
            </Link>
          </Box>
        </Box>
      </Slide>

     

      <Box
        sx={{
          width: {
            xs: 400,
            md: 700,
          },
          height: {
            xs: 400,
            md: 700, // Height for medium screens
          },
          overflow: "hidden", // Ensures content stays within box dimensions
        }}
      >
        <Image
          src="/heroVector.png"
          alt="header-image"
          layout="responsive" // Makes the image responsive within the container
          width={500} // These are ratios; not exact dimensions
          height={700}
        />
      </Box>
    </Box>
  );
};

export default Hero;
