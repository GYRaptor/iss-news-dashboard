import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom ISS Icon
const issIcon = new L.Icon({
  iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg',
  iconSize: [50, 50],
  iconAnchor: [25, 25],
});

// Component to recenter map when position changes
const RecenterAutomatically = ({ lat, lon }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon]);
  }, [lat, lon, map]);
  return null;
};

const ISSMap = ({ currentPosition, path }) => {
  if (!currentPosition) return (
    <div className="w-full h-[400px] lg:h-[420px] glass rounded-2xl animate-pulse flex items-center justify-center text-slate-400">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">Loading Map…</span>
      </div>
    </div>
  );

  const positions = path.map(pos => [pos.lat, pos.lon]);

  return (
    <div className="w-full h-[400px] lg:h-[420px] rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-700/40 shadow-lg z-0">
      <MapContainer 
        center={[currentPosition.lat, currentPosition.lon]} 
        zoom={4} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={positions} color="#3b82f6" weight={3} opacity={0.7} />
        <Marker position={[currentPosition.lat, currentPosition.lon]} icon={issIcon}>
          <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent>
            <div className="text-center font-semibold text-slate-800">
              ISS<br/>
              {currentPosition.lat.toFixed(4)}, {currentPosition.lon.toFixed(4)}
            </div>
          </Tooltip>
        </Marker>
        <RecenterAutomatically lat={currentPosition.lat} lon={currentPosition.lon} />
      </MapContainer>
    </div>
  );
};

export default ISSMap;
