// themes/theme.js
'use client';
import { createTheme, PaletteOptions } from "@mui/material/styles";

declare module '@mui/material/styles' {
  interface Palette {
    customColors: {
      hoverBg: string;
      activeBg: string;
    };
  }
  interface PaletteOptions {
    customColors?: {
      hoverBg: string;
      activeBg: string;
    };
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#FFCA40", // Your custom primary color
      contrastText: "#000000", // Text color for better contrast
    },
    secondary: {
      main: "#DDE6ED", // Example secondary color
    },
    customColors: {
      hoverBg: "#FFCA40", // Custom hover background color
      activeBg: "#FFB200", // Custom active background color
    },
  },
});

export default theme;