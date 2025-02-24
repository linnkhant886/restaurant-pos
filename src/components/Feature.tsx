import ChecklistIcon from "@mui/icons-material/Checklist"
import LocationOn from "@mui/icons-material/LocationOn"
import MenuBookIcon from "@mui/icons-material/MenuBook"
import QrCode2Icon from "@mui/icons-material/QrCode2"
import SupportAgentIcon from "@mui/icons-material/SupportAgent"
import InsightsIcon from "@mui/icons-material/Insights"
import { Box, Typography, Zoom, CardContent, Card } from "@mui/material"

const features = [
  {
    icon: <MenuBookIcon sx={{ fontSize: "90px", color: "#FFCA40" }} />,
    text: "Easily manage your menus with Foodie POS",
    delay: "1000ms",
  },
  {
    icon: <QrCode2Icon sx={{ fontSize: "90px", color: "#FFCA40" }} />,
    text: "Scan and order. Quick and easy! Your customers will love it!",
    delay: "1300ms",
  },
  {
    icon: <LocationOn sx={{ fontSize: "90px", color: "#FFCA40" }} />,
    text: "Foodie POS supports multiple locations for your business.",
    delay: "1500ms",
  },
  {
    icon: <ChecklistIcon sx={{ fontSize: "90px", color: "#FFCA40" }} />,
    text: "Backoffice and order apps are included in every subscription.",
    delay: "1700ms",
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: "90px", color: "#FFCA40" }} />,
    text: "Dedicated customer support so that we are always here to help you.",
    delay: "2000ms",
  },
  {
    icon: <InsightsIcon sx={{ fontSize: "90px", color: "#FFCA40" }} />,
    text: "Detailed analytics for smarter decisions and optimized operations.",
    delay: "2200ms",
  },
]

const Features = () => {
  return (
    <Box sx={{  py: 8, backgroundColor: "#F5F5F5" }} id="features">
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Typography
          variant="overline"
          sx={{
            color: "#000000",
            fontWeight: 500,
            fontSize: { xs: "0.8rem", md: "1.2rem" },
            letterSpacing: 1.5,
            display: "block",
          }}
        >
          OUR SERVICES
        </Typography>
        <Typography
          variant="h2"
          component="h2"
          sx={{
            color: "#000000",
            fontWeight: 700,
            fontSize: { xs: "2rem", md: "3.5rem" },
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          We Offer Best Services
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 4,
        }}
      >
        {features.map((item) => {
          return (
            <Zoom
              key={item.text}
              in={true}
              style={{
                transitionDelay: item.delay,
                transitionDuration: "1000ms",
              }}
            >
              <Card
                sx={{
                  textAlign: "center",
                  maxWidth: 330,
                  position: "relative",
                  overflow: "visible",
                  p: 5,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 12px 20px rgba(0, 0, 0, 0.1)",
                    "& .icon": {
                      transform: "scale(1.1)",
                    },
                  },
                  backgroundColor: "#FFFFFF",
                  borderRadius: "15px",
                }}
              >
                <CardContent>
                  <Box className="icon" sx={{ transition: "all 0.3s ease" }}>
                    {item.icon}
                  </Box>
                  <Typography variant="h6" sx={{ mt: 2, color: "#000000" }}>
                    {item.text}
                  </Typography>
                </CardContent>
              </Card>
            </Zoom>
          )
        })}
      </Box>
    </Box>
  )
}

export default Features

