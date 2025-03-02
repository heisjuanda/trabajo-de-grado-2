import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/signin/SignIn";
import SignUp from "./components/signup/SignUp";
import Dashboard from "./components/dashboard/Dashboard";
import Course from "./components/course/Course";
import Activity from "./components/activity/Activity";
import MentalMap from "./components/customactivities/mentalmap/MentalMap";
import Debate from "./components/customactivities/debate/Debate";
import DecitionMaking from "./components/customactivities/decisionMaking/DecisionMaking";
import JigSaw from "./components/customactivities/jigsaw/JigSaw";
import Muñeca from "./components/customactivities/FitnessMuñeca/FitnessMuñeca";
import Espalda from "./components/customactivities/FitnessEspalda/FitnessEspalda";
import Hercules from "./components/customactivities/mindsetHercules/Hercules";
import DebateIA from "./components/customactivities/pensamientoCritico/DebateIA";
import DebateStart from "./components/customactivities/pensamientoCritico/views/DebateStart/DebateStart";
import DebateReport from "./components/customactivities/pensamientoCritico/components/DebateReport/DebateReport";
import DebateVideosList from "./components/customactivities/pensamientoCritico/views/DebateVIdeosList/DebateVideosList";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses/:id" element={<Course />} />
        <Route path="/activity/:id" element={<Activity />} />
        
        <Route path="/activity/mentalmap" element={<MentalMap />} />
        <Route path="/activity/debate" element={<Debate />} />
        <Route path="/activity/jigsaw" element={<JigSaw />} />
        <Route path="/activity/decisionmaking" element={<DecitionMaking />} />
        <Route path="/activity/fitnessmuñeca" element={<Muñeca />} />
        <Route path="/activity/fitnessespalda" element={<Espalda />} />
        <Route path="/activity/GameMindset" element={<Hercules />} />
        <Route path="/activity/debate-ia" element={<DebateIA />} />
        <Route path="/activity/debate-ia/topic-start" element={<DebateStart />} />
        <Route path="/activity/debate-ia/reports" element={<DebateReport />} />
        <Route path="/activity/debate-ia/media" element={<DebateVideosList />} />
      </Routes>
    </Router>
  );
}

export default App;