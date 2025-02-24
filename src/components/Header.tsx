"use client"

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemText,
  ListItemButton,
} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import CloseIcon from "@mui/icons-material/Close"
import { useState } from "react"
import { Link } from "react-scroll"

const navigationLinks = [
  { title: "Home", to: "hero" },
  { title: "Testimonial", to: "testimonials" },
  { title: "Feature", to: "features" },
  { title: "Contact", to: "contact" },
]

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open)
  }

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "#FFCA40",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          borderBottom: "2px solid #FFB200",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            color: "#000000",
          }}
        >
          <Typography
            component="div"
            sx={{
              fontWeight: "bold",
              fontSize: "30px",
              marginLeft: { xs: 0, md: 14 },
              fontFamily: "'Pacifico', cursive",
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            }}
            style={{ cursor: "pointer" }}
          >
            FoodiePOS
          </Typography>

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton color="inherit" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              gap: "1rem",
              alignItems: "center",
            }}
          >
            {navigationLinks.map((link) => (
              <Button
                key={link.to}
                sx={{
                  color: "#000000",
                  fontSize: "16px",
                  fontWeight: 500,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                    transform: "translateY(-2px)",
                    transition: "all 0.3s ease",
                  },
                }}
              >
                <Link activeClass="active" to={link.to} spy={true} smooth={true} offset={-70} duration={500}>
                  <Typography sx={{ fontSize: "20px" }}>{link.title}</Typography>
                </Link>
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        sx={{ display: { xs: "flex", md: "none" } }}
        PaperProps={{
          sx: {
            height: "60%",
            maxHeight: "200px",
            backgroundColor: "#FFCA40",
            color: "#000000",
          },
        }}
        onClose={toggleDrawer(false)}
      >
        <List sx={{ width: 250 }}>
          {navigationLinks.map((link) => (
            <ListItemButton
              key={link.to}
              component={Link}
              to={link.to}
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              onClick={toggleDrawer(false)}
            >
              <ListItemText primary={link.title} />
            </ListItemButton>
          ))}
        </List>

        <IconButton
          sx={{
            position: "absolute",
            top: 10,
            right: 15,
            ":hover": { backgroundColor: "rgba(0,0,0,0.1)" },
          }}
          onClick={toggleDrawer(false)}
        >
          <CloseIcon />
        </IconButton>
      </Drawer>
    </>
  )
}

export default Header

