import { Route, Routes } from "react-router-dom";

import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import FeedControl from "@/pages/FeedControl";
import FanTempControl from "@/pages/FanTempControl";
import MotorPWM from "@/pages/MotorPWM";
import Settings from "@/pages/Settings";

function App() {
  return (
    <Routes>
      <Route element={<Layout />} path="/">
        <Route index element={<Dashboard />} />
        <Route element={<FeedControl />} path="feed-control" />
        <Route element={<FanTempControl />} path="fan-temp-control" />
        <Route element={<MotorPWM />} path="motor-pwm" />
        <Route element={<Settings />} path="settings" />
      </Route>
    </Routes>
  );
}

export default App;
