import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/header';
import Home from './home';
import Kopums from "./kopums";
import Sevi from './sevi';
import Salidzini from './salidzini';

import ExploitandVulnerabilityLab from './ExploitandVulnerabilityLab';
import ExploitdbAndOday from './ExploitdbAndOday';
import ExploitdbAndSecurityFocus from './ExploitdbAndSecurityFocus';
import ExplotandRapid from './ExplotandRapid';
import ExplotdbAndPacketStormSecurity from './ExplotdbAndPacketStormSecurity';
import Rapid7andOday from './Rapid7andOday';
import Rapid7andPacketStormSecurity from './Rapid7andPacketStormSecurity';
import Rapid7andSecurityFocus from './Rapid7andSecurityFocus';
import Rapid7andVulnerabilityLab from './Rapid7andVulnerabilityLab';
import VulnerabilityLabAndOday from './VulnerabilityLabAndOday';
import VulnerabilityLabAndPacketStormSecurity from './VulnerabilityLabAndPacketStormSecurity';
import VulnerabilityLabAndSecurityFocus from './VulnerabilityLabAndSecurityFocus';
import OdayandPacketStormSecurity from './OdayandPacketStormSecurity';
import OdayandSecurityFocus from './OdayandSecurityFocus';
import SecurityFocusAndPacketStormSecurity from './SecurityFocusAndPacketStormSecurity';
import { Sailing } from '@mui/icons-material';


function App(){
  return (
    <>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/kopums' element={<Kopums/>}></Route>
        <Route path='/sevi' element={<Sevi/>}></Route>
        <Route path='/salidzini' element={<Salidzini/>}></Route>

        <Route path='/ExploitandVulnerabilityLab' element={<ExploitandVulnerabilityLab/>}></Route>
        <Route path='/ExploitdbAndOday' element={<ExploitdbAndOday/>}></Route>
        <Route path='/ExploitdbAndSecurityFocus' element={<ExploitdbAndSecurityFocus/>}></Route>
        <Route path='/ExplotandRapid' element={<ExplotandRapid/>}></Route>
        <Route path='/ExplotdbAndPacketStormSecurity' element={<ExplotdbAndPacketStormSecurity/>}></Route>
        <Route path='/Rapid7andOday' element={<Rapid7andOday/>}></Route>
        <Route path='/Rapid7andPacketStormSecurity' element={<Rapid7andPacketStormSecurity/>}></Route>
        <Route path='/Rapid7andSecurityFocus' element={<Rapid7andSecurityFocus/>}></Route>
        <Route path='/Rapid7andVulnerabilityLab' element={<Rapid7andVulnerabilityLab/>}></Route>
        <Route path='/VulnerabilityLabAndOday' element={<VulnerabilityLabAndOday/>}></Route>
        <Route path='/VulnerabilityLabAndPacketStormSecurity' element={<VulnerabilityLabAndPacketStormSecurity/>}></Route>
        <Route path='/VulnerabilityLabAndSecurityFocus' element={<VulnerabilityLabAndSecurityFocus/>}></Route>
        <Route path='/OdayandPacketStormSecurity' element={<OdayandPacketStormSecurity/>}></Route>
        <Route path='/OdayandSecurityFocus' element={<OdayandSecurityFocus/>}></Route>
        <Route path='/SecurityFocusAndPacketStormSecurity' element={<SecurityFocusAndPacketStormSecurity/>}></Route>
      

        
     </Routes>
    </>
  );
  }

export default App;