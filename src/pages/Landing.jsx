import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, DEMO_ROLES } from '../context/AuthContext';
import {
  ShieldAlert,
  BrainCircuit,
  Map,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Building2,
  Landmark,
  Scale,
  FileText,
  UserPlus,
  LogIn,
  Layers,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Globe,
  BellRing,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building,
  UserCheck,
  Cpu,
  BarChart3,
  GitBranch,
  ArrowDownRight,
  Database,
  SlidersHorizontal,
  Zap,
  Check,
  X,
  FileSearch,
  Clock,
  PieChart,
  GitCommit,
  GitMerge,
  Workflow,
  AlertCircle,
  FileCheck,
  Coins,
  Compass
} from 'lucide-react';

export const Landing = () => {
  const navigate = useNavigate();
  const { user, login, switchDemoRole } = useAuth();
  const [activeShapFactor, setActiveShapFactor] = useState(0);
  const [selectedTreeStage, setSelectedTreeStage] = useState(3); // Default Stage 4 (Section 11)

  // 10 Statutory Stages Dataset with Tree Branching Logic
  const statutoryStagesTree = [
    {
      id: 1,
      num: '01',
      title: 'Pre-Notification Proposal',
      section: 'Section 4(1) Pre-Survey',
      authority: 'Requiring Body & District Collector',
      sla: '60 Days Max',
      deliverable: 'Land Alignment & Geo-Tagged Survey Report',
      phase: 'Phase 1: SIA & Survey',
      phaseColor: 'bg-blue-100 text-blue-900 border-blue-300',
      nodeColor: 'bg-blue-600',
      description: 'Project authority submits proposal detailing minimum land requirement, baseline maps, and public purpose justification.',
      aiWatch: 'Verifies overlap with forest/tribal Schedule V lands to predict initial legal complexity.'
    },
    {
      id: 2,
      num: '02',
      title: 'Section 4 SIA Study & Hearing',
      section: 'Section 4 Social Impact Study',
      authority: 'State SIA Agency & Gram Sabha',
      sla: '6 Months Limit',
      deliverable: 'Approved Social Impact Assessment (SIA) Report',
      phase: 'Phase 1: SIA & Survey',
      phaseColor: 'bg-blue-100 text-blue-900 border-blue-300',
      nodeColor: 'bg-blue-600',
      description: 'Mandatory SIA study evaluating affected families, displacement count, and public hearing in Gram Sabha.',
      aiWatch: 'Monitors public objection volume to flag high-contestation villages.'
    },
    {
      id: 3,
      num: '03',
      title: 'Expert Group Evaluation',
      section: 'Section 7 Independent Review',
      authority: 'Multidisciplinary Expert Committee',
      sla: '60 Days Limit',
      deliverable: 'Expert Recommendation Report',
      phase: 'Phase 1: SIA & Survey',
      phaseColor: 'bg-blue-100 text-blue-900 border-blue-300',
      nodeColor: 'bg-blue-600',
      description: 'Independent expert panel evaluates if SIA report proves legitimate public purpose and minimal displacement.',
      isBranchPoint: true,
      branchLabel: 'Branch Fork: SIA Approval Gate',
      branchPass: 'Approved -> Proceed to Section 11 Gazette',
      branchFail: 'Rejected -> Project Abandoned / Re-Survey',
      aiWatch: 'Automated check for environmental clearance prerequisites.'
    },
    {
      id: 4,
      num: '04',
      title: 'Section 11 Preliminary Notification',
      section: 'Section 11(1) Gazette Publication',
      authority: 'District Collector & State Gazette',
      sla: '12 Months Expiration Watch',
      deliverable: 'Official Gazette Notification (Form 3)',
      phase: 'Phase 2: Gazette & Objections',
      phaseColor: 'bg-amber-100 text-amber-900 border-amber-300',
      nodeColor: 'bg-amber-600',
      description: 'Official Gazette publication prohibiting land transfers. Triggers the critical 12-month statutory expiration clock.',
      isBranchPoint: true,
      branchLabel: 'CRITICAL STATUTORY WATCHDOG',
      branchPass: 'Sec 19 Issued <= 12 Months -> Valid',
      branchFail: 'Sec 19 > 12 Months -> EXPIRATION & FULL RESTART',
      aiWatch: 'CRITICAL: 6-hourly background cron scanner alerts Collector at 90, 60, 45 days before lapse.'
    },
    {
      id: 5,
      num: '05',
      title: 'Section 15 Objections Hearing',
      section: 'Section 15(1) Landowner Hearing',
      authority: 'CALA / District Land Acquisition Officer',
      sla: '60 Days Statutory Window',
      deliverable: 'CALA Objection Resolution Report',
      phase: 'Phase 2: Gazette & Objections',
      phaseColor: 'bg-amber-100 text-amber-900 border-amber-300',
      nodeColor: 'bg-amber-600',
      description: '60-day window for affected landowners to file formal written objections regarding land boundary or public purpose.',
      aiWatch: 'SHAP Engine quantifies unresolved objection ratio to predict court stay likelihood.'
    },
    {
      id: 6,
      num: '06',
      title: 'Section 16 R&R Scheme Approval',
      section: 'Section 16 & 17 R&R Report',
      authority: 'Commissioner of Rehabilitation & Resettlement',
      sla: '6 Months Limit',
      deliverable: 'Approved R&R Package & Resettlement Layout',
      phase: 'Phase 3: R&R & Declaration',
      phaseColor: 'bg-purple-100 text-purple-900 border-purple-300',
      nodeColor: 'bg-purple-600',
      description: 'Preparation of comprehensive R&R plan detailing alternative housing, job quotas, and displacement compensation.',
      aiWatch: 'Detects R&R vs Possession conflict (triggers alert if possession advances ahead of R&R).'
    },
    {
      id: 7,
      num: '07',
      title: 'Section 19 Final Declaration',
      section: 'Section 19(1) Acquisition Declaration',
      authority: 'State Govt / Central Ministry Gazette',
      sla: 'Within 12 Months of Sec 11',
      deliverable: 'Final Declaration Gazette Notification',
      phase: 'Phase 3: R&R & Declaration',
      phaseColor: 'bg-purple-100 text-purple-900 border-purple-300',
      nodeColor: 'bg-purple-600',
      description: 'Final government declaration specifying precise survey numbers to be acquired. Resets Section 11 lapse threat.',
      aiWatch: 'Logs milestone completion timestamp and verifies total land area consistency.'
    },
    {
      id: 8,
      num: '08',
      title: 'Section 21 Compensation Notice',
      section: 'Section 21 Public Notice',
      authority: 'District Collector Office',
      sla: '30 Days Notice',
      deliverable: 'Public Notice for Claim Submissions',
      phase: 'Phase 4: Valuation & Possession',
      phaseColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      nodeColor: 'bg-emerald-600',
      description: 'Public notice inviting all titleholders, tenants, and interested parties to state compensation & ownership claims.',
      aiWatch: 'Tracks documentation backlog (num_pending_documents) across LAO dockets.'
    },
    {
      id: 9,
      num: '09',
      title: 'Section 23 Collector Award',
      section: 'Section 23 & 26 Compensation Award',
      authority: 'District Collector / CALA',
      sla: '12 Months from Sec 19',
      deliverable: 'Final Collector Compensation Award Summary',
      phase: 'Phase 4: Valuation & Possession',
      phaseColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      nodeColor: 'bg-emerald-600',
      description: 'Collector determines final market value multiplier (1.25x-2.0x), solatium (+100%), and individual award amounts.',
      isBranchPoint: true,
      branchLabel: 'Branch Fork: Valuation Reference',
      branchPass: 'Accepted -> Direct Disbursement',
      branchFail: 'Disputed -> Sec 64 LARR Authority Reference Court',
      aiWatch: 'Compares offered compensation ratio against current market rates.'
    },
    {
      id: 10,
      num: '10',
      title: 'Section 38 Physical Possession',
      section: 'Section 38 Land Handover',
      authority: 'District Collector & Project Authority',
      sla: 'Post 100% Disbursement',
      deliverable: 'Physical Possession Certificate & Handover',
      phase: 'Phase 4: Valuation & Possession',
      phaseColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      nodeColor: 'bg-emerald-600',
      description: 'Full compensation disbursement into bank accounts followed by legal takeover of unencumbered land possession.',
      aiWatch: 'Verifies 100% PFMS disbursement before marking project as successfully completed.'
    }
  ];

  // Top 2D Delay Risk Factor Dataset
  const shapFactors = [
    {
      factor: 'Legal Disputes & High Court Stays',
      weight: '35% Impact',
      category: 'Legal Complexity',
      color: 'bg-rose-500',
      borderColor: 'border-rose-300',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-900',
      description: 'Pending writ petitions, CALA award challenges, and boundary disputes freeze project possession indefinitely.',
      cagStat: 'Documented in 72% of CAG delayed project samples (Avg 418 extra delay days).'
    },
    {
      factor: 'Section 11 Expiration Deadline Proximity',
      weight: '28% Impact',
      category: 'Statutory Limits',
      color: 'bg-orange-500',
      borderColor: 'border-orange-300',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-900',
      description: 'Lapsing of 12-month limit between Sec 11 & Sec 19 forces complete process restart under RFCTLARR 2013.',
      cagStat: 'Over ₹1,200 Crore wasted nationwide due to notification lapses.'
    },
    {
      factor: 'Compensation Disbursement Stall',
      weight: '20% Impact',
      category: 'Financial Flow',
      color: 'bg-amber-500',
      borderColor: 'border-amber-300',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-900',
      description: 'Slow fund disbursement by Land Acquisition Officers (LAO) blocks physical land possession by authorities.',
      cagStat: 'PFMS audit shows 38% average disbursement delay across major state highways.'
    },
    {
      factor: 'R&R Resettlement vs Possession Lag',
      weight: '17% Impact',
      category: 'Social Impact',
      color: 'bg-blue-500',
      borderColor: 'border-blue-300',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-900',
      description: 'Physical possession advancing faster than rehabilitation triggers court stay orders and local public protests.',
      cagStat: 'Tribal & forest areas experience 2.4x higher R&R displacement litigation.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* 1. Official GOI Top Utility Bar */}
      <div className="goi-tricolor-bar" />
      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 sm:px-8 flex flex-wrap justify-between items-center border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <span className="font-bold text-slate-200">भारत सरकार | GOVERNMENT OF INDIA</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 hidden sm:inline">Department of Land Resources (DoLR), Ministry of Rural Development</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-slate-400 font-medium">SIH 2024 Solution PS-25017</span>
          <span className="text-slate-600">|</span>
          <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold text-[10px]">
            RFCTLARR Act 2013 Compliant
          </span>
        </div>
      </div>

      {/* 2. Main Navigation Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo & Emblem */}
            <Link to="/" className="flex items-center space-x-3 group">
              <img src="/emblem.svg" alt="National Emblem" className="h-12 w-12 object-contain transition group-hover:scale-105" />
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-amber-800 tracking-wider uppercase">भूमि अधिग्रहण पूर्वानुमान प्रणाली</span>
                </div>
                <h1 className="text-base sm:text-lg font-black text-slate-900 leading-none tracking-tight">
                  LandGuard AI Portal
                </h1>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Land Acquisition Delay Early Warning & Mitigation Platform
                </p>
              </div>
            </Link>

            {/* Middle Nav Links */}
            <nav className="hidden lg:flex items-center space-x-6 text-xs font-bold text-slate-700">
              <a href="#overview" className="hover:text-amber-700 transition">Overview</a>
              <a href="#pipeline" className="hover:text-amber-700 transition">Data Pipeline Flow</a>
              <a href="#statutory-tree" className="hover:text-amber-700 transition">10-Stage Tree Graph</a>
              <a href="#comparison" className="hover:text-amber-700 transition">Benchmark Matrix</a>
              <a href="#gis-section" className="hover:text-amber-700 transition">GIS Analytics</a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              {user ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center space-x-2 px-5 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm transition"
                >
                  <Building2 className="w-4 h-4 text-white" />
                  <span>Go to Officer Portal</span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-300 hover:bg-slate-100 rounded-xl transition"
                  >
                    <LogIn className="w-4 h-4 text-amber-600" />
                    <span>Officer Login</span>
                  </Link>

                  <Link
                    to="/signup"
                    className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition"
                  >
                    <UserPlus className="w-4 h-4 text-amber-400" />
                    <span>Officer Register (OTP)</span>
                  </Link>
                </>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* 3. Official Announcement Ticker */}
      <div className="bg-amber-500/10 border-b border-amber-200 py-2 px-4 text-xs font-medium text-amber-900 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center space-x-3 overflow-hidden">
          <span className="flex-shrink-0 bg-amber-700 text-white font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase flex items-center gap-1">
            <BellRing className="w-3 h-3 animate-pulse" /> Official Notice
          </span>
          <p className="truncate text-slate-800 font-semibold">
            RFCTLARR Act 2013 Section 11 lapse scanner active. Automated alert engine running 24/7 for 140+ National Infrastructure Projects.
          </p>
        </div>
      </div>

      {/* 4. Main Hero Section */}
      <section id="overview" className="bg-gradient-to-b from-white via-slate-50 to-slate-100 border-b border-slate-200 py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center space-x-2 bg-amber-100/90 border border-amber-300 text-amber-900 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
              <BrainCircuit className="w-4 h-4 text-amber-700" />
              <span>AI-Powered Decision Support & Delay Prediction System</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Early Warning & Predictive Analytics for <span className="text-amber-700 underline decoration-amber-400 decoration-wavy">Land Acquisition</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
              Empowering <strong className="text-slate-900 font-extrabold">District Collectors, SLAOs, State Administrators, and Central Ministries</strong> with Machine Learning delay risk scoring, SHAP explainable factor attribution, RFCTLARR 2013 statutory timeline tracking, and interactive GIS digital heatmaps.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition"
              >
                <UserPlus className="w-4 h-4 text-amber-400" />
                <span>Register New Officer Account</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-800 font-bold rounded-xl text-xs sm:text-sm border border-slate-300 shadow-xs transition"
              >
                <LogIn className="w-4 h-4 text-amber-600" />
                <span>Officer Login</span>
              </Link>

              <button
                onClick={() => {
                  switchDemoRole(DEMO_ROLES[3]);
                  login('admin@landguard.gov.in', 'password');
                  navigate('/dashboard');
                }}
                className="inline-flex items-center justify-center space-x-2 px-5 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition"
              >
                <span>Instant Executive Demo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Stat Counters with Bold Cards */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-200">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-0.5">
                <p className="text-2xl font-black text-slate-900">140+</p>
                <p className="text-[11px] text-slate-600 font-bold">Monitored Infra Projects</p>
              </div>
              <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200 shadow-xs space-y-0.5">
                <p className="text-2xl font-black text-amber-800">10 Stages</p>
                <p className="text-[11px] text-amber-900 font-bold">RFCTLARR 2013 Lifecycle</p>
              </div>
              <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200 shadow-xs space-y-0.5">
                <p className="text-2xl font-black text-emerald-800">92.4%</p>
                <p className="text-[11px] text-emerald-900 font-bold">Prediction Accuracy</p>
              </div>
            </div>

          </div>

          {/* Hero Right Image Frame (100% Fully Visible Image) */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-slate-200 bg-white group p-2">
              <img
                src="/hero_banner.png"
                alt="Government Infrastructure Monitoring"
                className="w-full h-auto rounded-xl object-contain shadow-xs transform group-hover:scale-[1.02] transition duration-500"
              />
              
              {/* Clean Status Badge Bar below image (zero overlap) */}
              <div className="mt-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4 text-amber-700" />
                  </div>
                  <div>
                    <p className="font-extrabold text-slate-900 text-xs">DoLR National Infrastructure Portal</p>
                    <p className="text-[10px] text-slate-600 font-medium">Real-time Statutory Compliance Watch</p>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-300">
                  SYSTEM ACTIVE
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. 2D Data Pipeline & Intelligence Flow Diagram */}
      <section id="pipeline" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 bg-white border-b border-slate-200">
        
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <span className="text-xs font-extrabold text-amber-700 uppercase tracking-widest bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300">
            2D System Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            How LandGuard AI Predicts & Mitigates Delays
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Seamless end-to-end data pipeline connecting government data sources, ML feature extraction, SHAP risk scoring, and officer directives.
          </p>
        </div>

        {/* 2D Interactive Flow Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          
          <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 relative hover:border-amber-500 transition shadow-xs group">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 font-black text-xs flex items-center justify-center mb-3">
              01
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-600" />
              <span>Multi-Source Ingestion</span>
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
              Fetches authentic data from <strong className="text-slate-900 font-bold">Bhumi Rashi, NHAI Portals, CAG Audits, eCourts, and PFMS</strong> APIs.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>Real-Time Sync</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
          </div>

          <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 relative hover:border-amber-500 transition shadow-xs group">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 font-black text-xs flex items-center justify-center mb-3">
              02
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-600" />
              <span>ML & Rule Scoring Engine</span>
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
              Calculates 0-100 delay risk scores using <strong className="text-slate-900 font-bold">RFCTLARR 2013 stage durations, legal stays, and compensation ratios</strong>.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>Weighted Features</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
          </div>

          <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-5 relative hover:border-amber-500 transition shadow-xs group">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 font-black text-xs flex items-center justify-center mb-3">
              03
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-600" />
              <span>SHAP XAI Factor Attribution</span>
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
              Breaks down delay probability into transparent factor contributions (<strong className="text-slate-900 font-bold">e.g. Compensation Stall +32%</strong>).
            </p>
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>Explainable AI</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
          </div>

          <div className="bg-amber-500/10 border-2 border-amber-300 rounded-2xl p-5 relative hover:border-amber-600 transition shadow-xs group">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white font-black text-xs flex items-center justify-center mb-3">
              04
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-700" />
              <span>Automated Directives & Alerts</span>
            </h3>
            <p className="text-xs text-slate-700 mt-2 leading-relaxed font-medium">
              Dispatches targeted corrective directives to <strong className="text-slate-900 font-extrabold">District Collectors & SLAOs</strong> before deadlines lapse.
            </p>
            <div className="mt-4 pt-3 border-t border-amber-200 flex items-center justify-between text-[11px] font-bold text-amber-900">
              <span>Mitigation Active</span>
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            </div>
          </div>

        </div>

      </section>

      {/* 6. REDESIGNED COMPONENT: 2D Interactive Tree Graph & Flowchart for RFCTLARR 2013 10 Statutory Stages (STRICTLY WHITE BACKGROUND) */}
      <section id="statutory-tree" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 bg-white text-slate-900 rounded-3xl my-8 border-2 border-slate-200 shadow-xl relative overflow-hidden">
        
        <div className="relative z-10 text-center space-y-2 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-900 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <Workflow className="w-4 h-4 text-amber-700" />
            <span>Interactive 2D Statutory Flowchart & Decision Tree</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            RFCTLARR Act 2013 Statutory 10-Stage Lifecycle Tree
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold">
            Sequential statutory legal pipeline with automated decision gates, SLA limits, and Section 11 lapse watchdog triggers.
          </p>
        </div>

        {/* 2D Horizontal Tree Node Stepper Canvas */}
        <div className="relative z-10 overflow-x-auto pb-6 pt-2">
          
          {/* Phase Headers Strip */}
          <div className="min-w-[1000px] grid grid-cols-4 gap-2 mb-4 text-center">
            <div className="bg-blue-50 border border-blue-200 text-blue-900 py-1.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider">
              Phase 1: Pre-Notification & SIA
            </div>
            <div className="bg-amber-50 border border-amber-200 text-amber-900 py-1.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider">
              Phase 2: Gazette & Objections
            </div>
            <div className="bg-purple-50 border border-purple-200 text-purple-900 py-1.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider">
              Phase 3: R&R & Declaration
            </div>
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 py-1.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider">
              Phase 4: Award & Possession
            </div>
          </div>

          {/* Connected Stepper Line + Nodes */}
          <div className="min-w-[1000px] relative py-6">
            
            {/* Horizontal Connecting Branch Line */}
            <div className="absolute top-[42px] left-[40px] right-[40px] h-1.5 bg-slate-200 z-0 rounded-full" />
            <div
              className="absolute top-[42px] left-[40px] h-1.5 bg-gradient-to-r from-blue-500 via-amber-500 to-emerald-500 z-0 transition-all duration-500 rounded-full"
              style={{ width: `${(selectedTreeStage / 9) * 92}%` }}
            />

            {/* 10 Node Circle Buttons */}
            <div className="grid grid-cols-10 gap-2 relative z-10">
              {statutoryStagesTree.map((stage, idx) => {
                const isSelected = selectedTreeStage === idx;
                return (
                  <button
                    key={stage.id}
                    onClick={() => setSelectedTreeStage(idx)}
                    className="flex flex-col items-center group focus:outline-none"
                  >
                    {/* Node Dot */}
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs transition-all duration-300 shadow-md ${
                        isSelected
                          ? 'bg-amber-600 text-white scale-125 ring-4 ring-amber-300 font-mono shadow-amber-500/30'
                          : 'bg-white text-slate-700 border-2 border-slate-300 hover:border-amber-500 hover:text-amber-800'
                      }`}
                    >
                      {stage.num}
                    </div>

                    {/* Stage Short Title */}
                    <span className={`text-[10px] font-bold text-center mt-3 leading-tight line-clamp-2 px-1 transition ${
                      isSelected ? 'text-amber-900 font-black' : 'text-slate-600 group-hover:text-slate-900'
                    }`}>
                      {stage.title.split(' ')[0]} {stage.title.split(' ')[1] || ''}
                    </span>

                    {/* SLA Badge */}
                    <span className="mt-1 text-[9px] font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                      {stage.sla}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>

        </div>

        {/* Selected Stage 2D Statutory Milestone Card (STRICTLY WHITE BG) */}
        <div className="relative z-10 bg-white border-2 border-amber-300 rounded-2xl p-6 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          <div className="lg:col-span-8 space-y-4">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black border ${statutoryStagesTree[selectedTreeStage].phaseColor}`}>
                {statutoryStagesTree[selectedTreeStage].phase}
              </span>

              <span className="bg-slate-100 text-amber-900 border border-slate-300 font-mono font-extrabold text-xs px-3 py-1 rounded-full flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>{statutoryStagesTree[selectedTreeStage].section}</span>
              </span>

              <span className="bg-slate-100 text-slate-800 border border-slate-300 font-mono font-extrabold text-xs px-3 py-1 rounded-full flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>SLA Limit: {statutoryStagesTree[selectedTreeStage].sla}</span>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span className="text-amber-800 font-mono font-black">Stage {statutoryStagesTree[selectedTreeStage].num}:</span>
              <span>{statutoryStagesTree[selectedTreeStage].title}</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              {statutoryStagesTree[selectedTreeStage].description}
            </p>

            {/* Statutory Branch Decision Box (if applicable) */}
            {statutoryStagesTree[selectedTreeStage].isBranchPoint && (
              <div className="p-3.5 bg-amber-50 border-2 border-amber-300 rounded-xl space-y-2 text-xs">
                <div className="flex items-center space-x-2 font-black text-amber-900">
                  <GitBranch className="w-4 h-4 text-amber-700" />
                  <span>{statutoryStagesTree[selectedTreeStage].branchLabel}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-bold">
                  <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{statutoryStagesTree[selectedTreeStage].branchPass}</span>
                  </div>
                  <div className="p-2.5 bg-rose-50 border border-rose-300 text-rose-900 rounded-lg flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
                    <span>{statutoryStagesTree[selectedTreeStage].branchFail}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Responsible Authority</span>
                <span className="font-extrabold text-amber-900">{statutoryStagesTree[selectedTreeStage].authority}</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Statutory Deliverable</span>
                <span className="font-extrabold text-slate-800">{statutoryStagesTree[selectedTreeStage].deliverable}</span>
              </div>
            </div>

          </div>

          {/* Right: AI Watchdog Trigger Card */}
          <div className="lg:col-span-4 bg-slate-900 text-white border border-slate-800 p-5 rounded-xl space-y-3 shadow-md">
            <div className="flex items-center space-x-2 text-amber-400 font-black text-xs uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>AI Watchdog & SHAP Trigger</span>
            </div>

            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              {statutoryStagesTree[selectedTreeStage].aiWatch}
            </p>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-bold">
              <span>Compliance Scan</span>
              <span className="text-emerald-400 font-mono">ACTIVE 24/7</span>
            </div>
          </div>

        </div>

      </section>

      {/* 7. SIH Evaluation Quick Role Selection Bar */}
      <section id="roles" className="bg-slate-900 text-white py-10 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider">
                SIH Hackathon Evaluation — Instant Role Persona Switching:
              </h3>
              <p className="text-xs text-slate-300 font-medium">Select any official jurisdiction persona to explore tailored dashboard views:</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {DEMO_ROLES.map((r) => (
              <button
                key={r.role}
                onClick={() => {
                  switchDemoRole(r);
                  login(r.role + '@landguard.gov.in', 'password123');
                  navigate('/dashboard');
                }}
                className="p-3.5 bg-slate-800/90 hover:bg-amber-600/20 border border-slate-700 hover:border-amber-500 rounded-xl text-left shadow-xs transition group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-100 group-hover:text-amber-300 capitalize">{r.role.replace('_', ' ')}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">{r.state || 'National Jurisdiction'}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 8. 2D Interactive SHAP Delay Risk Factor Breakdown Explorer */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 bg-slate-50">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-black text-amber-800 uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              CAG Audit & AI Analytics
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              National Delay Drivers & SHAP Attribution Matrix
            </h2>
            <p className="text-xs text-slate-600 font-semibold mt-1">
              Top delay drivers quantified across 140+ infrastructure projects using real government audit records.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: 2D Progress Bar Selector */}
          <div className="lg:col-span-6 space-y-3">
            {shapFactors.map((item, idx) => (
              <div
                key={idx}
                onClick={() => setActiveShapFactor(idx)}
                className={`p-4 rounded-xl border-2 transition cursor-pointer ${
                  activeShapFactor === idx
                    ? `${item.borderColor} ${item.bgColor} shadow-sm`
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">{item.factor}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                    activeShapFactor === idx ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {item.weight}
                  </span>
                </div>

                {/* 2D Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-2 mt-3 overflow-hidden">
                  <div
                    className={`h-full ${item.color} transition-all duration-500`}
                    style={{ width: item.weight }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Right: 2D Detail Insight Card */}
          <div className="lg:col-span-6">
            <div className={`p-6 rounded-2xl border-2 ${shapFactors[activeShapFactor].borderColor} ${shapFactors[activeShapFactor].bgColor} shadow-sm space-y-4`}>
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Category: {shapFactors[activeShapFactor].category}
                </span>
                <span className="text-xs font-black px-3 py-1 bg-slate-900 text-amber-400 rounded-lg">
                  SHAP Factor Impact: {shapFactors[activeShapFactor].weight}
                </span>
              </div>

              <h3 className="text-lg font-black text-slate-900">
                {shapFactors[activeShapFactor].factor}
              </h3>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {shapFactors[activeShapFactor].description}
              </p>

              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-900">
                  <FileSearch className="w-4 h-4 text-amber-600" />
                  <span>Comptroller & Auditor General (CAG) Audit Benchmark:</span>
                </div>
                <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                  {shapFactors[activeShapFactor].cagStat}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-extrabold text-amber-900">
                <span>LandGuard Mitigation Protocol: Automated Alert Triggered</span>
                <ArrowRight className="w-4 h-4" />
              </div>

            </div>
          </div>

        </div>

      </section>

      {/* 9. 2D Side-by-Side Benchmark Matrix (Traditional vs LandGuard AI) */}
      <section id="comparison" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 bg-white border-y border-slate-200">
        
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <span className="text-xs font-black text-amber-800 uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            Quantitative System Benchmark
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Manual Land Acquisition vs. LandGuard AI Platform
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold">
            How predictive analytics and statutory automation transform federal land acquisition management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Traditional Manual Approach */}
          <div className="bg-rose-50/50 border-2 border-rose-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center space-x-3 border-b border-rose-200 pb-3">
              <div className="w-9 h-9 rounded-xl bg-rose-200 text-rose-800 flex items-center justify-center font-black">
                <X className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Traditional Manual Monitoring</h3>
                <p className="text-[11px] text-slate-500 font-bold">Paper-Based & Reactive</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start space-x-2">
                <X className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 font-bold">480 Days Average Identification Delay:</strong> Bottlenecks discovered after construction stops.</span>
              </li>
              <li className="flex items-start space-x-2">
                <X className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 font-bold">34% Section 11 Expiration Rate:</strong> Expiration deadlines missed due to tracking oversights.</span>
              </li>
              <li className="flex items-start space-x-2">
                <X className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 font-bold">Opaque Risk Assessment:</strong> No quantitative breakdown of why a project is delayed.</span>
              </li>
              <li className="flex items-start space-x-2">
                <X className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 font-bold">Manual Paper Reporting:</strong> Fragmented monthly physical submissions across tehsils.</span>
              </li>
            </ul>
          </div>

          {/* LandGuard AI Platform */}
          <div className="bg-emerald-50/50 border-2 border-emerald-300 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center space-x-3 border-b border-emerald-200 pb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">LandGuard AI Platform</h3>
                <p className="text-[11px] text-emerald-800 font-bold">Predictive & Statutory Automated</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-slate-800">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 font-bold">Real-Time 1-Day Warning:</strong> AI detects delay drivers months before physical stoppage.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 font-bold">0% Section 11 Expiration:</strong> 24/7 automated 90-day countdown watch scanner.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 font-bold">100% SHAP Explainability:</strong> Transparent risk scoring for every factor.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span><strong className="text-slate-900 font-bold">Automated Officer Directives:</strong> Actionable directives sent directly to SLAOs.</span>
              </li>
            </ul>
          </div>

        </div>

      </section>

      {/* 10. AI System Capabilities Grid */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <span className="text-xs font-black text-amber-800 uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            Comprehensive Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Key AI System Components & Capabilities</h2>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold">
            End-to-end intelligence platform built specifically for Indian land acquisition legal procedures under RFCTLARR 2013.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm hover:border-amber-400 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Explainable AI (SHAP) Factor Scoring</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Decomposes complex machine learning delay predictions into human-readable risk contributions (e.g. Legal Disputes +28%, Compensation Stall +24%) for administrative transparency.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm hover:border-emerald-400 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
              <Landmark className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">10-Stage LARR Statutory Lifecycle</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Monitors progress step-by-step from Pre-Notification through Section 4, SIA Report, Section 11, R&R Scheme, Section 19, Award, and Final Possession.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm hover:border-blue-400 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-black">
              <Map className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">GIS Digital Map & Spatial Heatmaps</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Interactive Leaflet digital spatial visualization mapping project coordinates, state/district choropleth heatmaps, and spatial risk clusters.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm hover:border-rose-400 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-black">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Section 11 Statutory Lapse Watchdog</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              6-hourly background cron scanner calculating Section 11 expiration limits (&lt; 45 days limit) to prevent statutory invalidation of notifications.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm hover:border-purple-400 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-black">
              <Lightbulb className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Actionable Directive Engine</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Translates risk drivers into corrective directives assigned to responsible departments (e.g. State Legal Dept, SLAO) with strict resolution deadlines.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 shadow-sm hover:border-slate-400 transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-black">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">Role-Based Security & Audit Trail</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              5-tier access control (District Officer, Collector, State Admin, Central Admin, Ministry) backed by complete audit logs for accountability.
            </p>
          </div>

        </div>
      </section>

      {/* 11. GIS Spatial Analytics Section */}
      <section id="gis-section" className="bg-white border-y border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-black text-amber-800 uppercase tracking-wider bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              Spatial Intelligence
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Interactive GIS Digital Spatial Heatmap & Corridor Mapping
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold">
              Geospatial analysis allows officers to identify regional bottleneck clusters, corridor-wide land acquisition risks, and district-level performance across India.
            </p>
            <ul className="space-y-2 text-xs text-slate-800 font-bold">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Color-coded risk markers (High Risk, Medium Risk, On Track)</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Direct integration with OpenStreetMap & Bhuvan GIS services</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Detailed popups showing project stage, land area (ha), and SLAO officer</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                to="/signup"
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-xs transition shadow-sm"
              >
                <span>Access Interactive GIS Map</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border-2 border-slate-300 shadow-xl bg-white group p-2">
              <img
                src="/gis_preview.png"
                alt="GIS Analytics Preview"
                className="w-full h-auto rounded-xl object-contain shadow-xs transform group-hover:scale-[1.02] transition duration-500"
              />
              <div className="mt-2.5 p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-black text-white">National Land Acquisition GIS Spatial Grid</p>
                  <p className="text-[10px] text-amber-300 font-medium">Department of Land Resources (DoLR) • NITI Aayog</p>
                </div>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold px-2 py-1 rounded">
                  LIVE SPATIAL MAP
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 12. Official Government Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-xs border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <img src="/emblem.svg" alt="Emblem" className="h-10 w-10 object-contain" />
                <div>
                  <p className="font-black text-slate-200 text-sm">DoLR LandGuard AI</p>
                  <p className="text-[10px] text-slate-400 font-semibold">Government of India</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                Department of Land Resources (DoLR), Ministry of Rural Development, NITI Aayog Infrastructure Monitoring Initiative.
              </p>
            </div>

            <div>
              <h4 className="font-black text-slate-200 mb-3 text-xs uppercase tracking-wider">Quick Navigation</h4>
              <ul className="space-y-2 text-[11px] font-semibold">
                <li><Link to="/login" className="hover:text-amber-400 transition">Officer Sign In</Link></li>
                <li><Link to="/signup" className="hover:text-amber-400 transition">Officer Registration (OTP)</Link></li>
                <li><a href="#pipeline" className="hover:text-amber-400 transition">2D System Architecture</a></li>
                <li><a href="#statutory-tree" className="hover:text-amber-400 transition">10-Stage Tree Graph</a></li>
                <li><a href="#comparison" className="hover:text-amber-400 transition">System Comparison Matrix</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-slate-200 mb-3 text-xs uppercase tracking-wider">Statutory Framework</h4>
              <ul className="space-y-2 text-[11px] font-semibold">
                <li><span>RFCTLARR Act 2013</span></li>
                <li><span>Section 11 Expiration Rules</span></li>
                <li><span>Rehabilitation & Resettlement (R&R)</span></li>
                <li><span>Land Acquisition SLAO Workflow</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-slate-200 mb-3 text-xs uppercase tracking-wider">Technical Support</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                Managed by National Informatics Centre (NIC) Support Team for SIH Solution PS-25017.
              </p>
              <div className="mt-3 inline-block bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-[10px] font-mono font-bold text-amber-300">
                Helpdesk: dolr-sih@nic.in
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-medium">
            <p>© {new Date().getFullYear()} Department of Land Resources, Ministry of Rural Development. All rights reserved.</p>
            <div className="flex items-center space-x-4 font-bold">
              <a href="#" className="hover:text-slate-300">Terms of Service</a>
              <span>•</span>
              <a href="#" className="hover:text-slate-300">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-slate-300">Accessibility Statement</a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
