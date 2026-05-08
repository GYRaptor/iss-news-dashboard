import React from 'react';
import Header from './Header';
import FloatingChatbot from '../chatbot/FloatingChatbot';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <Header />
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {children}
      </main>
      {/* Decorative gradient blobs for premium feel */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-[400px] h-[400px] rounded-full bg-purple-500/5 dark:bg-purple-500/10 blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-[350px] h-[350px] rounded-full bg-cyan-500/5 dark:bg-cyan-500/8 blur-3xl" />
      </div>
      <FloatingChatbot />
    </div>
  );
};

export default DashboardLayout;
