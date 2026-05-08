import React from 'react';
import { Users } from 'lucide-react';

const Astronauts = ({ astronauts }) => {
  return (
    <div className="glass rounded-2xl p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="p-3 bg-gradient-to-br from-purple-100 to-fuchsia-100 dark:from-purple-900/30 dark:to-fuchsia-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-tight">People in Space</h2>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Currently aboard: <span className="text-purple-600 dark:text-purple-400 font-bold">{astronauts.count}</span>
          </p>
        </div>
      </div>
      
      {/* List */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-2">
        {astronauts.people.length > 0 ? (
          <ul className="space-y-2">
            {astronauts.people.map((person, index) => (
              <li 
                key={index} 
                className="flex items-center gap-3 bg-slate-50/80 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-700/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors duration-200"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {person.name.charAt(0)}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white dark:border-slate-800"></div>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{person.name}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{person.craft}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <div className="w-6 h-6 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm">Loading astronauts…</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Astronauts;
