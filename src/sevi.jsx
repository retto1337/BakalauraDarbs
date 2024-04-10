import React from "react";
import { Container, Divider, Grid, Typography } from "@mui/material";

export default function Sevi() {
  return (
    <>
      <Container maxWidth="xl" sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "150px", marginBottom: "20px" }}>
        <Divider sx={{ width: "100%" }}>Interneta drošība un paroles aizsardzība ir būtiski aspekti privātuma, konfidencialitātes un integritātes saglabāšanā digitālajā laikmetā.</Divider>
      </Container>

      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Kopējā aizsardzība 
            </Typography>
            <Typography paragraph>
              Kiberdraudu ainava: draudu ainava nepārtraukti attīstās, un kibernoziedznieki izmanto sarežģītas metodes, lai nozagtu sensitīvu informāciju, traucētu pakalpojumu darbību un kompromitētu sistēmas. Visbiežāk sastopamie draudi ir pikšķerēšanas uzbrukumi, ļaunprātīga programmatūra, izpirkuma programmatūra un sociālās inženierijas taktika. Šie draudi ir vērsti gan uz privātpersonām, gan uzņēmumiem un organizācijām.
            </Typography>
            <Typography paragraph>
              Paroļu aizsardzība: paroles kalpo kā pirmā aizsardzības līnija pret nesankcionētu piekļuvi kontiem un datiem. Tomēr uzbrucēji var viegli izmantot vājas vai apdraudētas paroles. Tāpēc ir ļoti svarīgi katram kontam izmantot spēcīgas, unikālas paroles un regulāri tās atjaunināt, lai samazinātu nesankcionētas piekļuves risku.
            </Typography>
            <Typography paragraph>
              Paroļu pārvaldības risinājumi: izplatoties tiešsaistes kontiem, var būt grūti atcerēties vairākas sarežģītas paroles. Paroļu pārvaldības risinājumi piedāvā ērtu veidu, kā droši uzglabāt un ģenerēt spēcīgas paroles dažādiem kontiem. Šie rīki bieži izmanto šifrēšanu un vairāku faktoru autentifikāciju, lai uzlabotu drošību.
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Datu mērogs
            </Typography>
            <Typography paragraph>
              Daudzfaktoru autentifikācija (MFA): MFA pievieno papildu drošības līmeni, pieprasot lietotājiem papildus parolei nodrošināt papildu verifikācijas veidus, piemēram, vienreizēju kodu, kas tiek nosūtīts uz viņu mobilo ierīci. Tas samazina nesankcionētas piekļuves risku, pat ja paroles ir apdraudētas.
            </Typography>
            <Typography paragraph>
              Drošības paraugprakse: lietotāju izglītošana par drošības paraugpraksi ir būtiska aizsardzībai pret izplatītiem draudiem. Tas ietver regulāru programmatūras un operētājsistēmu atjaunināšanu, piesardzību pret aizdomīgiem e-pastiem un saitēm, izvairīšanos no publiska Wi-Fi sensitīviem darījumiem un drošības protokolu, piemēram, HTTPS, ieviešanu.
            </Typography>
            <Typography paragraph>
              Datu šifrēšana: šifrēšana ir būtisks interneta drošības aspekts, kas nodrošina datu konfidencialitāti pārsūtīšanas un uzglabāšanas laikā. Tādas tehnoloģijas kā SSL/TLS šifrē internetā pārsūtītos datus, savukārt pilnīga šifrēšana aizsargā sakarus no pārtveršanas vai manipulācijām.
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Tehnoloģijas
            </Typography>
            <Typography paragraph>
              Nepārtraukta uzraudzība un reaģēšana uz incidentiem: neskatoties uz preventīvajiem pasākumiem, drošības incidenti joprojām var notikt. Tāpēc organizācijām ir jāievieš stabili uzraudzības rīki un incidentu reaģēšanas plāni, lai nekavējoties atklātu drošības apdraudējumus un reaģētu uz tiem. Tas ietver neparastu konta darbību uzraudzību, regulāru drošības novērtējumu veikšanu un procedūru ieviešanu incidentu ierobežošanai un atkopšanai.
            </Typography>
            <Typography paragraph>
              Lietotāju informētība un apmācība: cilvēka kļūdas joprojām ir nozīmīgs drošības pārkāpumu faktors. Tāpēc pastāvīgas lietotāju izpratnes apmācības ir ļoti svarīgas drošības kultūras veicināšanai organizācijās. Mācību programmās jāaptver tādas tēmas kā paroļu higiēna, pikšķerēšanas mēģinājumu atpazīšana un reaģēšana uz drošības incidentiem.
            </Typography>
            <Typography paragraph>
              Jaunās tehnoloģijas un draudi: tehnoloģijai turpinot attīstīties, parādās jauni drošības izaicinājumi un risinājumi. Tādas tendences kā lietu internets (IoT), mākslīgais intelekts (AI) un kvantu skaitļošana sniedz gan iespējas, gan riskus kiberdrošībai. Lai proaktīvi risinātu drošības problēmas, ir svarīgi būt informētam par jaunām tehnoloģijām un draudiem.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
