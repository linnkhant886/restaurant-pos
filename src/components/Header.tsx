"use client";

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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { Link } from "react-scroll";
import Image from "next/image";

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };
  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: "primary.main" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            component="div"
            sx={{
              fontWeight: "bold",
              fontSize: "30px",
              marginLeft: { xs: 0, md: 14 },
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

          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Button color="inherit" sx={{ marginX: 1 }}>
              <Link
                activeClass="active"
                to="hero"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
              >
                Demo
              </Link>
            </Button>
            <Button color="inherit" sx={{ marginX: 1 }}>
              <Link
                activeClass="active"
                to="testimonials"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
              >
                Testimonial
              </Link>
            </Button>
            <Button color="inherit" sx={{ marginX: 1 }}>
              <Link
                activeClass="active"
                to="features"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
              >
                Feature
              </Link>
            </Button>
            <Button color="inherit" sx={{ marginX: 1 }}>
              <Link
                activeClass="active"
                to="contact"
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
              >
                Contact
              </Link>
            </Button>
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
          },
        }}
        onClose={toggleDrawer(false)}
      >
        <List sx={{ width: 250 }}>
          <ListItemButton component="a" href="#testimonial">
            <ListItemText primary="Testimonials" />
          </ListItemButton>
          <ListItemButton component="a" href="#demo">
            <ListItemText primary="Demo" />
          </ListItemButton>
          <ListItemButton component="a" href="#feature">
            <ListItemText primary="Feature" />
          </ListItemButton>
          <ListItemButton component="a" href="#contact">
            <ListItemText primary="Contact" />
          </ListItemButton>
        </List>

        <IconButton
          sx={{
            position: "absolute",
            top: 10,
            right: 15,
            ":hover": { backgroundColor: "grey.50" },
          }}
          onClick={toggleDrawer(false)}
        >
          <CloseIcon />
        </IconButton>
      </Drawer>
      <Box
        sx={{
          position: "absolute",
          right: 0,
          display: { xs: "none", md: "block" },
        }}
      >
        
      </Box>
    </>
  );
};

export default Header;
