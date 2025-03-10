"use client"

import { useState } from "react"
import { Box, Container, Typography, IconButton, Avatar } from "@mui/material"
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material"

interface Testimonial {
  id: number
  name: string
  location: string
  text: string
  image: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Kelly Willium",
    location: "Khulna, Bangladesh",
    text: "Foodie POS transformed how we manage our restaurant. The seamless menu updates and mobile QR ordering system keep our customers engaged and satisfied. It's a game-changer for our business!",
    image: "/pic1.jpeg",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    location: "New York, USA",
    text: "Excellent service and attention to detail. The team went above and beyond my expectations. Would highly recommend to anyone.",
    image: "/pic2.jpeg",
  },
  {
    id: 3,
    name: "Mike Chen",
    location: "Singapore",
    text: "The mobile QR menu feature in Foodie POS is a hit with our customers. It's user-friendly, fast, and boosts our service efficiency. Plus, the support team is always there when we need them!",
    image: "/pic3.jpeg",
  },
]

export default function Testimonial() {
  const [activeIndex, setActiveIndex] = useState(0)

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <Box
      id="testimonials"
      sx={{
        bgcolor: "#FFCA40",
        my: 8,
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            position: "relative",
            gridTemplateColumns: { md: "1fr 1fr" },
            gap: 4,
            alignItems: "center",
          }}
        >
          {/* Left side - Titles */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: "#000000",
                mb: 2,
                fontWeight: 500,
              }}
            >
              Testimonials
            </Typography>
            <Typography
              variant="h2"
              sx={{
                color: "#000000",
                fontWeight: 700,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                lineHeight: 1.2,
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              What People Say
              <br />
              About Us.
            </Typography>

            {/* Navigation Dots */}
            <Box sx={{ display: "flex", gap: 1, mt: 4 }}>
              {testimonials.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: index === activeIndex ? "#000000" : "rgba(0,0,0,0.3)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Right side - Testimonial Slider */}
          <Box sx={{ position: "relative" }}>
            <Box
              sx={{
                position: "relative",
                bgcolor: "#FFFFFF",
                height: "300px",
                overflow: "hidden",
                boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                borderRadius: 4,
                py: 6,
              }}
            >
              {testimonials.map((testimonial, index) => (
                <Box
                  key={testimonial.id}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    opacity: index === activeIndex ? 1 : 0,
                    transform: `translateY(${(index - activeIndex) * 20}px)`,
                    transition: "all 0.5s ease",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    p: 4,
                    bgcolor: "background.paper",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      mb: 2,
                    }}
                  >
                    <Avatar
                      src={testimonial.image}
                      alt={testimonial.name}
                      sx={{
                        width: 80,
                        height: 80,
                        border: "4px solid",
                        borderColor: "#FFCA40",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                        zIndex: 3,
                      }}
                    />
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 3,
                      color: "#000000",
                      fontSize: "1.1rem",
                      lineHeight: 1.6,
                      maxWidth: "500px",
                      fontStyle: "italic",
                    }}
                  >
                    {`"${testimonial.text}"`}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, color: "#000000" }}>
                    {testimonial.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {testimonial.location}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Navigation Arrows */}
            <Box
              sx={{
                position: "absolute",
                right: { xs: 0, md: -60 },
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <IconButton
                onClick={prevTestimonial}
                sx={{
                  bgcolor: "#FFFFFF",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  "&:hover": { bgcolor: "#F5F5F5" },
                }}
              >
                <KeyboardArrowUp />
              </IconButton>
              <IconButton
                onClick={nextTestimonial}
                sx={{
                  bgcolor: "#FFFFFF",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  "&:hover": { bgcolor: "#F5F5F5" },
                }}
              >
                <KeyboardArrowDown />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

