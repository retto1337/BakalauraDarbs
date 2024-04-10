import React from "react";
import { Container } from "@mui/system";
import Grid from "@mui/material/Grid";
import { Button, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";

export default function Profile() {
  return (
    <>
      <Container maxWidth="xl" sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <Grid container xs={12} justifyContent="center">
          <Grid item xs={12} justifyContent="center" mt={5}>
            <Typography variant="h2" align="center" gutterBottom>
              Par Datu aizsardzību Web Lietotnēs
            </Typography>
            <Divider />
          </Grid>
          <Grid container xs={12} mt={5} justifyContent="center">
            <Grid item xs={12} md={8}>
              <Typography variant="body1" align="center">
                

              Rezumējot, interneta drošība un paroles aizsardzība ir neatņemamas kiberdrošības sastāvdaļas, kurām nepieciešama daudzpusīga pieeja, kas ietver tehnisko kontroli, labāko praksi, lietotāju izglītošanu un pastāvīgu modrību, lai mazinātu riskus un aizsargātos pret kiberdraudiem.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

