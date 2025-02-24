import { Box, Button, Slide, Typography } from "@mui/material"
import Link from "next/link"
import Image from "next/image"

const Hero = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column-reverse", md: "row" },
        justifyContent: "center",
        p: { xs: 3, md: 4 },
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
      id="hero"
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('/bg.jpg')",
          backgroundSize: "cover",
          opacity: 0.1,
          zIndex: 0,
        }}
      />
      <Slide direction="down" in={true} mountOnEnter unmountOnExit timeout={1000}>
        <Box sx={{ zIndex: 1 }}>
          <Typography
            sx={{
              maxWidth: 700,
              mb: { xs: 2, md: 4 },
              fontSize: { xs: "24px", md: "36px" },
              fontWeight: "bold",
              color: "#000000",
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            Revolutionize Your Restaurant Management
          </Typography>
          <Typography
            sx={{
              maxWidth: 550,
              mb: 3,
              color: "#000000",
              fontSize: { xs: "16px", md: "18px" },
            }}
          >
            Simplify operations, enhance customer experiences, and streamline your workflow with our all-in-one POS
            system. With powerful back-office control and an innovative mobile QR menu, managing your restaurant has
            never been easier. Elevate your service and efficiency today!
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
                  backgroundColor: "#000000",
                  ":hover": {
                    backgroundColor: "#333333",
                    transform: "translateY(-2px)",
                  },
                  color: "#FFCA40",
                  transition: "all 0.3s ease",
                }}
              >
                Order App
              </Button>
            </Link>
            <Link href={`/backoffice`}>
              <Button
                variant="outlined"
                sx={{
                  fontSize: { xs: "12px", md: "16px" },
                  width: "fit-content",
                  borderColor: "#000000",
                  color: "#000000",
                  ":hover": {
                    backgroundColor: "rgba(0,0,0,0.1)",
                    borderColor: "#000000",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Backoffice App
              </Button>
            </Link>
          </Box>
        </Box>
      </Slide>

      <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={1000}>
        <Box
          sx={{
            width: { xs: 400, md: 700 },
            height: { xs: 400, md: 700 },
            overflow: "hidden",
            zIndex: 1,
            position: "relative",
          }}
        >
          <Image src="/heroVector.png" alt="header-image" layout="responsive" width={500} height={700} />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        </Box>
      </Slide>
    </Box>
  )
}

export default Hero

