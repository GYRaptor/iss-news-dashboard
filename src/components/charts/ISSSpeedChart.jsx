import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const ISSSpeedChart = ({ speedHistory }) => {
  return (
    <div className="glass rounded-2xl p-6 w-full">
      <h3 className="text-base font-bold mb-1 text-slate-800 dark:text-slate-200 tracking-tight">Velocity History</h3>
      <p className="text-xs text-slate-400 mb-4">Speed in km/h over time</p>
      <div className="w-full h-[240px]">
        {speedHistory && speedHistory.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={speedHistory} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.15} />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'Inter' }} 
                tickMargin={10}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                domain={['auto', 'auto']}
                tick={{ fontSize: 11, fill: '#94a3b8', fontFamily: 'Inter' }} 
                axisLine={false}
                tickLine={false}
              />
              <RechartsTooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                  fontFamily: 'Inter',
                  fontSize: '13px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="speed" 
                stroke="#3b82f6" 
                strokeWidth={2.5}
                fillOpacity={1} 
                fill="url(#colorSpeed)" 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium">Waiting for velocity data…</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ISSSpeedChart;
