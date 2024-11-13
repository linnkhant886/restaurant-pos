import ChecklistIcon from "@mui/icons-material/Checklist";
import LocationOn from "@mui/icons-material/LocationOn";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import InsightsIcon from "@mui/icons-material/Insights";
import { Box, Typography, Zoom, CardContent, Card } from "@mui/material";


interface SectionProps {
  refProp: React.RefObject<HTMLDivElement>;
}

const features = [
  {
    icon: <MenuBookIcon sx={{ fontSize: "90px", color: "#1B9C85" }} />,
    text: "Easily manage your menus with Foodie POS",
    delay: "1000ms",
  },
  {
    icon: <QrCode2Icon sx={{ fontSize: "90px", color: "#1B9C85" }} />,
    text: "Scan and order. Quick and easy! Your customers will love it!",
    delay: "1300ms",
  },
  {
    icon: <LocationOn sx={{ fontSize: "90px", color: "#1B9C85" }} />,
    text: "Foodie POS supports multiple locations for your business.",
    delay: "1500ms",
  },
  {
    icon: <ChecklistIcon sx={{ fontSize: "90px", color: "#1B9C85" }} />,
    text: "Backoffice and order apps are included in every subscription.",
    delay: "1700ms",
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: "90px", color: "#1B9C85" }} />,
    text: "Dedicated customer support so that we are awlays here to help you.",
    delay: "2000ms",
  },
  {
    icon: <InsightsIcon sx={{ fontSize: "90px", color: "#1B9C85" }} />,
    text: "Detailed analytics for smarter decisions and optimized operations.",
    delay: "2200ms",
  },
];



const Features = () => {
  return (
    <Box sx={{my: 8}} id="features" >
      <Box sx={{ textAlign: "center" ,mb: 8 }}>
        <Typography
          variant="overline"
          sx={{
            color: "grey.600",
            fontWeight: 500,
            fontSize: { xs: "0.8rem", md: "1.2rem" },
            letterSpacing: 1.5,
            display: "block",
          }}
        >
          CATEGORY
        </Typography>
        <Typography
          variant="h2"
          component="h2"
          sx={{
            color: "primary.dark",
            fontWeight: 700,
            fontSize: { xs: "2rem", md: "3.5rem" },
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
          cursor: "pointer",
          gap: 4,
        }}
      >
        {features.map((item) => {
          return (
            <Zoom
              key={item.text}
              in={true}
              style={{
                transitionDelay: true ? item.delay : "0ms",
                transitionDuration: "1000ms",
              }}
            >
              <Box
                sx={{
                  textAlign: "center",
                  maxWidth: 330,
                  position: "relative",
                  overflow: "visible",
                  p: 5,
                  cursor: "pointer",
                  ":hover": {
                    boxShadow: "0 6px 10px rgba(0, 0, 0, 0.3)",
                    borderRadius: "30px",
                  },
                }}
              >
                {item.icon}

                <Typography variant="h6">{item.text}</Typography>
              </Box>
            </Zoom>
          );
        })}
      </Box>
    </Box>
  );
};

export default Features;
