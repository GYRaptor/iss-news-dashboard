import React from 'react';
import ISSMap from './ISSMap';
import Astronauts from './Astronauts';
import ISSSpeedChart from '../charts/ISSSpeedChart';
import { useISSData } from '../../hooks/useISSData';
import { RefreshCw, MapPin, Navigation, Activity, Zap } from 'lucide-react';

const StatCard = ({ icon: Icon, iconBg, iconColor, label, value, className = '' }) => (
  <div className={`glass glass-hover rounded-2xl p-5 flex items-center gap-4 animate-fade-in-up ${className}`}>
    <div className={`stat-icon ${iconBg}`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>
    <div className="min-w-0">
      <p className="stat-label">{label}</p>
      <p className="stat-value truncate">{value}</p>
    </div>
  </div>
);

const ISSTracker = ({ issData }) => {
  const { currentPosition, path, speed, speedHistory, locationName, astronauts, loading, refreshLocation } = issData;

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl text-white shadow-lg shadow-blue-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="section-heading bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
              Live Telemetry
            </h2>
            <p className="section-subtext">International Space Station tracking</p>
          </div>
        </div>
        <button 
          onClick={refreshLocation}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-all duration-200 disabled:opacity-50 active:scale-95"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="text-sm font-medium hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Navigation}
          iconBg="bg-blue-100 dark:bg-blue-900/30"
          iconColor="text-blue-600 dark:text-blue-400"
          label="Coordinates"
          value={currentPosition ? `${currentPosition.lat.toFixed(2)}°, ${currentPosition.lon.toFixed(2)}°` : '—'}
          className="delay-100"
        />
        <StatCard
          icon={Activity}
          iconBg="bg-rose-100 dark:bg-rose-900/30"
          iconColor="text-rose-600 dark:text-rose-400"
          label="Velocity"
          value={`${speed} km/h`}
          className="delay-200"
        />
        <StatCard
          icon={MapPin}
          iconBg="bg-emerald-100 dark:bg-emerald-900/30"
          iconColor="text-emerald-600 dark:text-emerald-400"
          label="Nearest Location"
          value={locationName}
          className="sm:col-span-2 delay-300"
        />
      </div>

      {/* Map + Chart + Astronauts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="animate-fade-in-up delay-300">
            <ISSMap currentPosition={currentPosition} path={path} />
          </div>
          <div className="animate-fade-in-up delay-400">
            <ISSSpeedChart speedHistory={speedHistory} />
          </div>
        </div>
        <div className="lg:col-span-1 lg:sticky lg:top-24 animate-fade-in-up delay-300" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
          <Astronauts astronauts={astronauts} />
        </div>
      </div>
    </div>
  );
};

export default ISSTracker;
