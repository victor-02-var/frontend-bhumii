import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { NationalRiskDashboard } from './pages/NationalRiskDashboard';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { Analytics } from './pages/Analytics';
import { GisMapView } from './pages/GisMapView';
import { Interventions } from './pages/Interventions';
import { WhatIfSimulator } from './pages/WhatIfSimulator';
import { Alerts } from './pages/Alerts';
import { Officers } from './pages/Officers';
import { AuditLogs } from './pages/AuditLogs';

// Protected Layout Route Component for Officer Portal
const ProtectedLayout = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/national-risk-dashboard" element={<NationalRiskDashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/gis-map" element={<GisMapView />} />
            <Route path="/simulator" element={<WhatIfSimulator />} />
            <Route path="/interventions" element={<Interventions />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/officers" element={<Officers />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
};


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
