import React,{useState} from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import IndexPage from "./IndexPage";
import AdminSignup from './AdminSignup'
import Wastedisplay from './Wastedisplay'
import Login from './Login'
import Uploadwaste from "./Uploadwaste";
import AdminDashboard from "./AdminDashboard";
import History from "./History";



function App() {
  const [pcount, setpcount] = useState(0);
  const [comp,setdel]=useState(0);
 
  return (
    <Router>
        {/* Navigation Bar */}
        <nav className="navbar" style={{backgroundColor:"#3b8b22d6",color:"white",padding:"15px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <img src="https://media.istockphoto.com/id/1384532150/vector/recycle-symbol-inside-circle-with-leaves-zero-waste-concept.jpg?s=612x612&w=0&k=20&c=lQPT8cj_dpkQBxa1G4Y6RzDz5vLog6OmWERx-vGpF_Y=" alt="app-logo"/>
        <h1 style={{marginRight:"40%"}}>  StreetClean Connect</h1>
      </nav>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/Signup" element={<AdminSignup />} />
        
        <Route path="/uploadwaste" element={<Uploadwaste/>} />
        <Route path="/Login" element={<Login/>} />
        <Route path="/reports" element={<Wastedisplay pcount={pcount}   setpcount={setpcount} comp = {comp} setdel={setdel}/>}/>
        <Route path="/Login/dashboard" element={<AdminDashboard count ={pcount} completed={comp}/>}/>
        <Route path="/history" element={<History/>} />
        {/* <Route path="/wastedisplay" element={<Wastedisplay />} /> */}
      </Routes>
    </Router>
  );
}

export default App;