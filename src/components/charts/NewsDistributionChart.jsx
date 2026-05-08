import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#6366f1'];

const NewsDistributionChart = ({ articles }) => {
  const data = useMemo(() => {
    if (!articles || articles.length === 0) return [];
    
    const authorCount = articles.reduce((acc, article) => {
      const authorName = article.author || 'Unknown';
      acc[authorName] = (acc[authorName] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(authorCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [articles]);

  return (
    <div className="glass rounded-2xl p-6 w-full flex flex-col" style={{ minHeight: '340px' }}>
      <h3 className="text-base font-bold mb-1 text-slate-800 dark:text-slate-200 tracking-tight">Author Distribution</h3>
      <p className="text-xs text-slate-400 mb-4">Articles by author</p>
      <div className="flex-1 min-h-0">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  fontFamily: 'Inter',
                  fontSize: '13px'
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '11px', paddingTop: '8px', fontFamily: 'Inter' }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <span className="text-sm">No data to display</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsDistributionChart;
