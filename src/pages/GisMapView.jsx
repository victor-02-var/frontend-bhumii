import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api, { gisService } from '../services/api';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import { 
  Map as MapIcon, 
  Search, 
  Filter, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Compass, 
  ExternalLink,
  RefreshCw,
  Building2,
  MapPin
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon URL issues in Vite bundler
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom glowing HTML markers for risk categories
const createCustomIcon = (color, isCritical = false) => new L.DivIcon({
  className: 'custom-leaflet-marker',
  html: `
    <div style="position: relative; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;">
      ${isCritical ? `<div class="marker-pulse-critical" style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background-color: ${color}; opacity: 0.4;"></div>` : ''}
      <div style="background-color: ${color}; width: 18px; height: 18px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 4px 12px ${color}80; z-index: 2;"></div>
    </div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -11]
});

const RATIONALE_ICONS = {
  Low: createCustomIcon('#10B981', false),
  Medium: createCustomIcon('#F59E0B', false),
  High: createCustomIcon('#F97316', false),
  Critical: createCustomIcon('#EF4444', true)
};

// Map Recenter Helper Component
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

export const GisMapView = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedRisk, setSelectedRisk] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [mapTileStyle, setMapTileStyle] = useState('osm'); // 'osm' | 'light'
  const [mapCenter, setMapCenter] = useState([22.5937, 78.9629]);
  const [mapZoom, setMapZoom] = useState(5);

  useEffect(() => {
    loadGisData();
  }, []);

  const loadGisData = async () => {
    try {
      setLoading(true);
      const res = await gisService.getGeoJSON().catch(() => null);
      
      if (res?.data?.features && res.data.features.length > 0) {
        setProjects(res.data.features);
      } else {
        // Fallback demo spatial data
        setProjects([
          { properties: { id: '1', project_id: 'NHAI-NE4-UP-001', project_name: 'Delhi-Mumbai Expressway (NE-4)', district: 'Gautam Buddha Nagar', state: 'Uttar Pradesh', project_type: 'Highway', risk_category: 'Critical', risk_score: 73.91, is_delayed: true, current_stage: 'Stage 5: Section 11 Notification', land_area_ha: 1450 }, geometry: { coordinates: [77.5501, 28.3587] } },
          { properties: { id: '2', project_id: 'NHAI-NE7-TN-002', project_name: 'Bengaluru-Chennai Expressway (NE-7)', district: 'Kanchipuram', state: 'Tamil Nadu', project_type: 'Highway', risk_category: 'High', risk_score: 66.92, is_delayed: true, current_stage: 'Stage 7: Section 19 Declaration', land_area_ha: 840 }, geometry: { coordinates: [79.7036, 12.8342] } },
          { properties: { id: '3', project_id: 'WDFC-MH-003', project_name: 'Western Freight Corridor Phase 2', district: 'Thane', state: 'Maharashtra', project_type: 'Railway', risk_category: 'High', risk_score: 63.57, is_delayed: true, current_stage: 'Stage 3: Section 4 Preliminary Notification', land_area_ha: 620 }, geometry: { coordinates: [72.8436, 19.3497] } },
          { properties: { id: '4', project_id: 'SUB-JH-004', project_name: 'Subernarekha Multipurpose Dam', district: 'Ranchi', state: 'Jharkhand', project_type: 'Dam', risk_category: 'High', risk_score: 64.19, is_delayed: true, current_stage: 'Stage 2: SIA & Public Hearing', land_area_ha: 1850 }, geometry: { coordinates: [85.3096, 23.3441] } },
          { properties: { id: '5', project_id: 'NHAI-DWK-HR-005', project_name: 'Dwarka Expressway (NH-248BB)', district: 'Gurugram', state: 'Haryana', project_type: 'Urban', risk_category: 'Medium', risk_score: 50.00, is_delayed: false, current_stage: 'Stage 9: Possession & Compensation', land_area_ha: 210 }, geometry: { coordinates: [77.0266, 28.4595] } }
        ]);
      }
    } catch (err) {
      console.error('Error fetching GIS map data:', err);
    } finally {
      setLoading(false);
    }
  };

  // State list derived from loaded data
  const availableStates = useMemo(() => {
    const states = new Set(projects.map(p => p.properties.state).filter(Boolean));
    return ['All', ...Array.from(states).sort()];
  }, [projects]);

  // Project Types derived from data
  const availableTypes = useMemo(() => {
    const types = new Set(projects.map(p => p.properties.project_type).filter(Boolean));
    return ['All', ...Array.from(types).sort()];
  }, [projects]);

  // Filtered project list
  const filteredProjects = useMemo(() => {
    return projects.filter(feature => {
      const p = feature.properties;
      const matchesSearch = 
        !searchQuery ||
        p.project_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.project_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.district?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.state?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesState = selectedState === 'All' || p.state === selectedState;
      const matchesRisk = selectedRisk === 'All' || p.risk_category === selectedRisk;
      const matchesType = selectedType === 'All' || p.project_type === selectedType;

      return matchesSearch && matchesState && matchesRisk && matchesType;
    });
  }, [projects, searchQuery, selectedState, selectedRisk, selectedType]);

  // Summary Metrics
  const stats = useMemo(() => {
    const total = filteredProjects.length;
    const critical = filteredProjects.filter(p => p.properties.risk_category === 'Critical').length;
    const high = filteredProjects.filter(p => p.properties.risk_category === 'High').length;
    const delayed = filteredProjects.filter(p => p.properties.is_delayed).length;
    const totalHa = filteredProjects.reduce((acc, p) => acc + (Number(p.properties.land_area_ha) || 0), 0);
    const avgRisk = total > 0 ? (filteredProjects.reduce((acc, p) => acc + (Number(p.properties.risk_score) || 0), 0) / total).toFixed(1) : 0;

    return { total, critical, high, delayed, totalHa, avgRisk };
  }, [filteredProjects]);

  const handleFocusProject = (feature) => {
    const [lng, lat] = feature.geometry.coordinates;
    setMapCenter([lat, lng]);
    setMapZoom(10);
  };

  const tileUrls = {
    osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    light: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
  };

  return (
    <div className="space-y-5">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-700 font-bold text-xs uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>Ministry of Land Resources & PM Gati Shakti Spatial Tracker</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center space-x-2">
            <span> जीआईएस डिजिटल मानचित्र एवं जिला-वार जोखिम मैपिंग</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time Spatial GIS Vector Map of National Highway, Railway & Infrastructure Land Acquisition Projects across India
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadGisData}
            disabled={loading}
            className="flex items-center space-x-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition border border-slate-300"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Spatial Layers</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Spatial Projects</div>
          <div className="text-2xl font-black text-slate-900 mt-1 flex items-baseline space-x-2">
            <span>{stats.total}</span>
            <span className="text-xs text-slate-500 font-normal">Mapped</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/30 shadow-xs">
          <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">High & Critical Risk</div>
          <div className="text-2xl font-black text-amber-900 mt-1 flex items-baseline space-x-2">
            <span>{stats.critical + stats.high}</span>
            <span className="text-xs text-amber-700 font-medium">({stats.critical} Critical)</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">National Avg Risk</div>
          <div className="text-2xl font-black text-slate-900 mt-1 flex items-baseline space-x-2">
            <span>{stats.avgRisk} / 100</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Land Mapped</div>
          <div className="text-2xl font-black text-slate-900 mt-1 flex items-baseline space-x-1">
            <span>{stats.totalHa.toLocaleString()}</span>
            <span className="text-xs text-slate-500 font-normal">Hectares</span>
          </div>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search project name, ID, state or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* State Filter */}
          <div className="flex items-center space-x-1">
            <label className="font-bold text-slate-600">State:</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white font-medium focus:ring-2 focus:ring-amber-500"
            >
              {availableStates.map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>

          {/* Risk Filter */}
          <div className="flex items-center space-x-1">
            <label className="font-bold text-slate-600">Risk:</label>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white font-medium focus:ring-2 focus:ring-amber-500"
            >
              <option value="All">All Risks</option>
              <option value="Critical">Critical (75%+)</option>
              <option value="High">High (55-74%)</option>
              <option value="Medium">Medium (35-54%)</option>
              <option value="Low">Low (&lt;35%)</option>
            </select>
          </div>

          {/* Project Type */}
          <div className="flex items-center space-x-1">
            <label className="font-bold text-slate-600">Type:</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs bg-white font-medium focus:ring-2 focus:ring-amber-500"
            >
              {availableTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Map Tile Style Toggle & Legend */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setMapTileStyle('osm')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition ${mapTileStyle === 'osm' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
            >
              Street Map
            </button>
            <button
              onClick={() => setMapTileStyle('light')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition ${mapTileStyle === 'light' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
            >
              Light Vector
            </button>
          </div>
        </div>
      </div>

      {/* Main Map View & Side Project Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* Left Side: Filtered Project List */}
        <div className="bg-white border border-slate-200 rounded-2xl p-3 h-[600px] flex flex-col shadow-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Spatial Layer Projects ({filteredProjects.length})</span>
            <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-full">Click to Focus</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredProjects.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No projects match your filter criteria.
              </div>
            ) : (
              filteredProjects.map((feature, idx) => {
                const p = feature.properties;
                const riskColor = 
                  p.risk_category === 'Critical' ? 'border-rose-300 bg-rose-50/40 text-rose-900' :
                  p.risk_category === 'High' ? 'border-orange-300 bg-orange-50/40 text-orange-900' :
                  p.risk_category === 'Medium' ? 'border-amber-300 bg-amber-50/40 text-amber-900' :
                  'border-emerald-300 bg-emerald-50/40 text-emerald-900';

                return (
                  <div
                    key={idx}
                    onClick={() => handleFocusProject(feature)}
                    className="p-3 border border-slate-200 rounded-xl hover:border-amber-500 hover:shadow-xs transition cursor-pointer bg-white group"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-bold font-mono text-slate-400">{p.project_id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${riskColor}`}>
                        {p.risk_category} ({p.risk_score}%)
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 mt-1 group-hover:text-amber-800 transition line-clamp-1">
                      {p.project_name}
                    </h4>

                    <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-1.5">
                      <span className="flex items-center"><MapPin className="w-3 h-3 mr-0.5 text-slate-400" />{p.district}, {p.state}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Leaflet Canvas */}
        <div className="lg:col-span-3 h-[600px] bg-slate-900 border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative">
          
          {loading && (
            <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-xs flex items-center justify-center space-x-3">
              <RefreshCw className="w-6 h-6 text-amber-600 animate-spin" />
              <span className="text-xs font-bold text-slate-700">Loading Interactive GeoJSON Spatial Canvas...</span>
            </div>
          )}

          {/* Floating Risk Legend Overlay */}
          <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-md border border-slate-200 p-2.5 rounded-xl shadow-md text-xs space-y-1.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Spatial Legend</div>
            <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-rose-500 shadow-xs"></span><span className="font-bold text-slate-700">Critical Delay Risk (&ge;75%)</span></div>
            <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-orange-500 shadow-xs"></span><span className="font-bold text-slate-700">High Risk (55 - 74%)</span></div>
            <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-amber-500 shadow-xs"></span><span className="font-bold text-slate-700">Medium Risk (35 - 54%)</span></div>
            <div className="flex items-center space-x-2"><span className="w-3 h-3 rounded-full bg-emerald-500 shadow-xs"></span><span className="font-bold text-slate-700">Low Risk (&lt;35%)</span></div>
          </div>

          <MapContainer center={mapCenter} zoom={mapZoom} className="w-full h-full">
            <ChangeView center={mapCenter} zoom={mapZoom} />
            
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & PM Gati Shakti'
              url={tileUrls[mapTileStyle]}
            />

            {filteredProjects.map((feature, idx) => {
              const coords = feature.geometry.coordinates;
              const props = feature.properties;
              const icon = RATIONALE_ICONS[props.risk_category] || RATIONALE_ICONS.Low;

              if (!coords || coords.length < 2) return null;

              return (
                <React.Fragment key={idx}>
                  {/* Point Marker */}
                  <Marker position={[coords[1], coords[0]]} icon={icon}>
                    <Popup>
                      <div className="p-3 bg-white rounded-xl space-y-2 text-slate-900">
                        <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                          <div>
                            <span className="text-[9px] font-mono font-bold text-slate-400 block">{props.project_id}</span>
                            <h3 className="font-bold text-xs text-slate-900 leading-snug">{props.project_name}</h3>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${
                            props.risk_category === 'Critical' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                            props.risk_category === 'High' ? 'bg-orange-100 text-orange-800 border-orange-300' :
                            props.risk_category === 'Medium' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                            'bg-emerald-100 text-emerald-800 border-emerald-300'
                          }`}>
                            {props.risk_category}
                          </span>
                        </div>

                        <div className="text-[11px] space-y-1 text-slate-600">
                          <div className="flex justify-between"><span className="text-slate-400">Location:</span><span className="font-bold">{props.district}, {props.state}</span></div>
                          <div className="flex justify-between"><span className="text-slate-400">Project Type:</span><span className="font-bold">{props.project_type || 'Infrastructure'}</span></div>
                          <div className="flex justify-between"><span className="text-slate-400">Risk Score:</span><span className="font-extrabold text-amber-700">{props.risk_score}%</span></div>
                          <div className="flex justify-between"><span className="text-slate-400">Stage:</span><span className="font-medium text-slate-800 text-[10px]">{props.current_stage || 'N/A'}</span></div>
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                          <Link
                            to={`/projects/${props.id || props.project_id}`}
                            className="w-full flex items-center justify-center space-x-1 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition"
                          >
                            <span>Open Project Dashboard</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Buffer Ring Circle */}
                  <Circle 
                    center={[coords[1], coords[0]]}
                    radius={props.risk_category === 'Critical' ? 45000 : props.risk_category === 'High' ? 30000 : 15000}
                    pathOptions={{
                      color: props.risk_category === 'Critical' ? '#ef4444' : props.risk_category === 'High' ? '#f97316' : props.risk_category === 'Medium' ? '#f59e0b' : '#10b981',
                      fillColor: props.risk_category === 'Critical' ? '#ef4444' : props.risk_category === 'High' ? '#f97316' : props.risk_category === 'Medium' ? '#f59e0b' : '#10b981',
                      fillOpacity: 0.15,
                      weight: 1.5
                    }}
                  />
                </React.Fragment>
              );
            })}
          </MapContainer>
        </div>

      </div>

    </div>
  );
};
