import React from 'react';
import { ExternalLink, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

const NewsCard = ({ article }) => {
  return (
    <div className="glass glass-hover rounded-2xl overflow-hidden flex flex-col h-full group">
      {/* Image */}
      <div className="relative h-44 sm:h-48 bg-slate-200 dark:bg-slate-700 overflow-hidden">
        {article.image ? (
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
            No Image Available
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Author badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600/90 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-lg">
            {article.author || 'Unknown Author'}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-base leading-snug mb-2 line-clamp-2 text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" title={article.title}>
          {article.title}
        </h3>
        
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-2">
          {article.description || 'No description available for this article.'}
        </p>
        
        <div className="flex flex-col gap-3 mt-auto pt-3 border-t border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center justify-end text-[11px] font-medium text-slate-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(article.published, false)}</span>
            </div>
          </div>
          
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 text-blue-600 dark:text-blue-400 font-semibold text-sm rounded-xl transition-all duration-200 active:scale-[0.98]"
          >
            Read More
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
