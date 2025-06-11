import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

import Layout from "@/components/Layout";

// Lazy load components for better performance
const SimpleControl = lazy(() => import("@/pages/SimpleControl"));
const FeedControl = lazy(() => import("@/pages/FeedControl"));
const FanTempControl = lazy(() => import("@/pages/FanTempControl"));
const MotorPWM = lazy(() => import("@/pages/MotorPWM"));
const Settings = lazy(() => import("@/pages/Settings"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const FirebaseDashboard = lazy(() => import("@/pages/FirebaseDashboard"));
const Analytics = lazy(() => import("@/pages/Analytics"));
// const Rules = lazy(() => import("@/pages/Rules"));
// const FeedHistory = lazy(() => import("@/pages/FeedHistory"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
    <span className="ml-4 text-gray-600">Loading...</span>
  </div>
);

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route element={<Layout />} path="/">
          <Route index element={<FirebaseDashboard />} />
          <Route element={<FirebaseDashboard />} path="dashboard" />
          <Route element={<Dashboard />} path="pi-dashboard" />
          <Route element={<FeedControl />} path="feed-control" />
          <Route element={<FanTempControl />} path="fan-temp-control" />
          <Route element={<MotorPWM />} path="motor-pwm" />
          <Route element={<Analytics />} path="analytics" />
          {/* <Route element={<Rules />} path="rules" /> */}
          {/* <Route element={<FeedHistory />} path="feed-history" /> */}
          <Route element={<Settings />} path="settings" />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
