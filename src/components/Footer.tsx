"use client";
import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Restaurant,
} from "@mui/icons-material";

const footerLinks = [
  {
    title: "Product",
    links: ["Features", "Pricing", "Integrations", "Updates"],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Press", "Contact"],
  },
  {
    title: "Resources",
    links: ["Blog", "Help Center", "Guides", "API Docs"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR"],
  },
];

const socialIcons = [
  { icon: <Facebook />, url: "https://facebook.com" },
  { icon: <Twitter />, url: "https://twitter.com" },
  { icon: <Instagram />, url: "https://instagram.com" },
  { icon: <LinkedIn />, url: "https://linkedin.com" },
];

export default function Footer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#FFFEFE",
        borderColor: "divider",
        pt: 4,
      }}
      id="contact"
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Restaurant sx={{ mr: 1, color: "primary.main" }} />
              <Typography
                variant="h6"
                color="text.primary"
                sx={{ fontWeight: "bold" }}
              >
                Foodie POS
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Revolutionizing restaurant management with our cutting-edge POS
              system. Streamline operations, boost efficiency, and enhance
              customer experiences.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {socialIcons.map((social, index) => (
                <IconButton
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "text.secondary",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Footer Links */}
          {footerLinks.map((column, index) => (
            <Grid item xs={6} sm={3} md={2} key={index}>
              <Typography
                variant="subtitle1"
                color="text.primary"
                sx={{ fontWeight: "bold" ,fontSize: { xs: "18px", md: "25px" } }}
                gutterBottom
              >
                {column.title}
              </Typography>
              <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }}>
                {column.links.map((link, linkIndex) => (
                  <Box component="li" key={linkIndex} sx={{ mb: 0.5 }}>
                    <Link
                      href="#Feature"
                      color="grey.600"
                      sx={{
                        textDecoration: "none",
                        "&:hover": { color: "primary.main" },
                      }}
                    >
                      {link}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Bottom Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "center",
            alignItems: isMobile ? "center" : "flex-start",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            © {new Date().getFullYear()} Foodie POS. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
