import React, { useState, useMemo } from 'react';
import NewsCard from './NewsCard';
import NewsDistributionChart from '../charts/NewsDistributionChart';
import { Search, Filter, RefreshCw, Newspaper } from 'lucide-react';

const SkeletonCard = () => (
  <div className="glass rounded-2xl h-[380px] animate-pulse flex flex-col overflow-hidden">
    <div className="h-48 bg-slate-200/80 dark:bg-slate-700/60 w-full"></div>
    <div className="p-5 flex flex-col gap-3 flex-1">
      <div className="h-5 bg-slate-200/80 dark:bg-slate-700/60 rounded-lg w-3/4"></div>
      <div className="h-4 bg-slate-200/60 dark:bg-slate-700/40 rounded-lg w-full"></div>
      <div className="h-4 bg-slate-200/60 dark:bg-slate-700/40 rounded-lg w-5/6"></div>
      <div className="mt-auto h-10 bg-slate-200/60 dark:bg-slate-700/40 rounded-xl w-full"></div>
    </div>
  </div>
);

const NewsDashboard = ({ newsData }) => {
  const { articles, loading, error, refreshNews } = newsData;
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date' or 'author'

  const filteredAndSortedArticles = useMemo(() => {
    if (!articles) return [];
    
    // Filter by search term
    let result = articles.filter(article => 
      article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.published) - new Date(a.published);
      } else if (sortBy === 'author') {
        const authorA = a.author || '';
        const authorB = b.author || '';
        return authorA.localeCompare(authorB);
      }
      return 0;
    });

    return result;
  }, [articles, searchTerm, sortBy]);

  return (
    <div className="space-y-8 mb-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-white shadow-lg shadow-purple-500/20">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <h2 className="section-heading bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
              Global Headlines
            </h2>
            <p className="section-subtext">Top stories from around the world</p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search news…" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2.5 w-full sm:w-56 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-sm"
            />
          </div>

          <div className="relative">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-9 pr-8 py-2.5 appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-sm cursor-pointer"
            >
              <option value="date">Latest First</option>
              <option value="author">By Author</option>
            </select>
            <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <button 
            onClick={refreshNews}
            disabled={loading}
            className="p-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-all duration-200 disabled:opacity-50 active:scale-95"
            title="Refresh News"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl border border-red-200/60 dark:border-red-800/40 flex justify-between items-center animate-fade-in-up">
          <p className="text-sm font-medium">{error}</p>
          <button onClick={refreshNews} className="text-sm font-bold hover:underline underline-offset-2">Try Again</button>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Chart Sidebar */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <div className="lg:sticky lg:top-24">
            <NewsDistributionChart articles={filteredAndSortedArticles} />
          </div>
        </div>
        
        {/* News Cards Grid */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          {loading && (!articles || articles.length === 0) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filteredAndSortedArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredAndSortedArticles.map((article, index) => (
                <div key={`${article.url}-${index}`} className="animate-fade-in-up" style={{ animationDelay: `${index * 60}ms` }}>
                  <NewsCard article={article} />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass rounded-2xl p-16 text-center flex flex-col items-center justify-center">
              <Newspaper className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-slate-500 text-lg font-medium">No articles found matching your criteria.</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-5 px-5 py-2.5 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-400 rounded-xl font-semibold text-sm hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-900/50 dark:hover:to-pink-900/50 transition-all duration-200"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsDashboard;
