import React, { useState } from "react";
import { Container, Grid, Button, Divider, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Salidzini() {
  const [lastClicked, setLastClicked] = useState(-1);

  const buttonGroups = [
    ["Exploit DB", "Piedāvāt rīkus datu bāzu izpētei,analīzei un vizualizēšanai.", "saistīta ar kiberdrošību vai ētisku uzlaušanu"],
    ["Rapid7", "Piedāvā risinājumus ievainojamības pārvaldībai, kas palīdz organizācijām identificēt.", "Noteikt prioritātes un novērst drošības ievainojamības visā IT infrastruktūrā."],
    ["Vulnerability Lab", "Kiberdrošības platforma vai organizācija, kas koncentrējas uz programmatūras", "Sistēmu un tīklu ievainojamību identificēšanu, izpēti un atklāšanu."],
    ["Oday", "Izmantošanu kiberdrošības jomā, Ievainojamību datubāzi, sniedzot informāciju, piemēram, ietekmēto programmatūru, izmantošanas paņēmienus un iespējamo ietekmi.", ""],
    ["SecurityFocus", "Piedāvā jaunākos ziņu rakstus, brīdinājumus un analīzi par jaunākajiem kiberdrošības draudiem", "Informēt drošības speciālistus, pētniekus un entuziastus par jaunām tendencēm"],
    ["Packet Storm Security", "Uztur visaptverošu datubāzi ar drošības ieteikumiem", "Ievainojamību un ļaunprātīgu izmantošanu dažādām programmatūras, sistēmām un tīkliem."],
  ];
  
  const routes = [
    ['/ExplotandRapid','/ExploitandVulnerabilityLab','/ExploitdbAndOday','/ExploitdbAndSecurityFocus','/ExplotdbAndPacketStormSecurity' ],
    ['/ExplotandRapid','/Rapid7andVulnerabilityLab','/Rapid7andOday','/Rapid7andSecurityFocus','/Rapid7andPacketStormSecurity'],
    ['/ExploitandVulnerabilityLab','/Rapid7andVulnerabilityLab','/VulnerabilityLabAndOday','/VulnerabilityLabAndSecurityFocus','/VulnerabilityLabAndPacketStormSecurity'],
    ['/ExploitdbAndOday','/Rapid7andOday','/VulnerabilityLabAndOday','/OdayandSecurityFocus','/OdayandPacketStormSecurity'],
    ['/ExploitdbAndSecurityFocus','/Rapid7andSecurityFocus','/VulnerabilityLabAndSecurityFocus','/OdayandSecurityFocus','/SecurityFocusAndPacketStormSecurity'],
    ['/ExplotdbAndPacketStormSecurity','/Rapid7andPacketStormSecurity','/VulnerabilityLabAndPacketStormSecurity','/OdayandPacketStormSecurity','/SecurityFocusAndPacketStormSecurity'],
  ];

  const buttonTexts = [
    ['Rapid7', 'Vulnerability Lab', 'Oday', 'SecurityFocus', 'Packet Storm Security'],
    ['Exploit DB', 'Vulnerability Lab', 'Oday', 'SecurityFocus', 'Packet Storm Security'],
    ['Exploit DB', 'Rapid7', 'Oday', 'SecurityFocus', 'Packet Storm Security'],
    ['Exploit DB', 'Rapid7', 'Vulnerability Lab', 'SecurityFocus', 'Packet Storm Security'],
    ['Exploit DB', 'Rapid7', 'Vulnerability Lab', 'Oday', 'Packet Storm Security'],
    ['Exploit DB', 'Rapid7', 'Vulnerability Lab', 'Oday', 'SecurityFocus'],
  ];

  const handleButtonClick = (index) => {
    setLastClicked(index);
  };

  const renderButtonOptions = () => (
    <Grid container spacing={2} justifyContent="center" style={{ marginTop: 20 }}>
      {buttonTexts[lastClicked].map((text, index) => (
        <Grid item key={index}>
          <Link to={routes[lastClicked][index]}>
            <Button variant="outlined" color="primary">
              {text}
            </Button>
          </Link>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <>
      <Container maxWidth="xl" sx={{ display: "flex", height: "100px" }}></Container>
      <Divider>Kopējā Salīdzināšana</Divider>
      <Container maxWidth="xl">
        <Grid container mt={2} justifyContent="center" spacing={5}>
          {buttonGroups.map((group, index) => (
            <Grid item xs={6} mt={2} key={index}>
              {group.map((line, lineIndex) => (
                <Typography key={lineIndex}>{line}</Typography>
              ))}
              <Button variant="contained" color="secondary"fullWidth onClick={() => handleButtonClick(index)} >
                Salīdzini
              </Button>
            </Grid>
          ))}
        </Grid>
        {lastClicked !== -1 && renderButtonOptions()}
      </Container>
    </>
  );
}

