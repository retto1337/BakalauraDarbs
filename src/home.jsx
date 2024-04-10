import React from "react";
import { Container } from "@mui/system";
import Grid from "@mui/material/Grid";
import { Button, Typography } from "@mui/material";
import { Link } from "react-router-dom"; 

export default function Profile() {
  return (
    <>
      <Container maxWidth="xl">
        <Grid container spacing={1} justifyContent="center" alignItems="center" style={{ minHeight: "80vh" }}>
          <Grid item xs={12}>
            <Typography variant="h3" align="center" gutterBottom>
            Laipni lūdzam Datu aizsardzība Web Lietotnes
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" align="center" paragraph>
              Šeit tiek apskatīts kopējas datu bāzes efektivitāte kā arī to labas un sliktās puses.
              <Typography> Kā ari ka sevi pasargāt sērfošanu internetā un savu paroļu aizsardzība.</Typography>
             
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1" align="center" paragraph>
              Spied pogu lai sākt iedziļinātos Datu aizsardzībā un to vajadzībā.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <Link to="/salidzini" style={{ textDecoration: "none" }}>
              <Button variant="contained" color="primary" fullWidth>
                Sākt
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

