"use client";

import React, { useState } from "react";
import { Box, Typography, TextField, Button, Grid, CircularProgress } from "@mui/material";
import { Business } from "@mui/icons-material";
import { Company } from "@prisma/client";
import { updateCompanyData } from "./actions";
import toast from "react-hot-toast";
import { set } from "zod";

interface Props {
  company: Company | null;
}

export default function UpdateCompany({ company }: Props) {
  const [loading, setLoading] = useState(false);

  const handleUpdateCompany = async (formData: FormData) => {
    try {
      setLoading(true);
      const response = await updateCompanyData(formData);
      if (response?.error) {
        toast.error(response.error[0]);
      } else {
        toast.success("Company updated successfully!");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  // console.log(company);
  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Business sx={{ fontSize: 32, mr: 2, color: "primary.main" }} />
        <Typography variant="h4" component="h1">
          Update Your Company Information
        </Typography>
      </Box>

      <Box
        component={"form"}
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleUpdateCompany(formData);
        }}
      >
        <input type="hidden" name="id" defaultValue={company?.id} />
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              defaultValue={company?.name}
              label="Company Name"
              name="name"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              defaultValue={company?.streetAddress}
              label="Street Address"
              name="streetAddress"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              defaultValue={company?.city}
              label="City"
              name="city"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="State"
              defaultValue={company?.state}
              name="state"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              defaultValue={company?.phoneNumber}
              label="Phone Number"
              name="phoneNumber"
              variant="outlined"
              placeholder="+1 (555) 000-0000"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              defaultValue={company?.email}
              label="Email"
              name="email"
              type="email"
              variant="outlined"
            />
          </Grid>

          <Grid item xs={7}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
               {loading ? <CircularProgress color="inherit" /> : "Update Information"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
