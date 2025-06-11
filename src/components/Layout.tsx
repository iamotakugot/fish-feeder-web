import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

import Sidebar from "./Sidebar";

const Layout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed' : 'relative'} 
        ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
        transition-transform duration-300 ease-in-out z-30
        ${isMobile ? 'w-64' : 'w-64 lg:w-72'}
        h-full
      `}>
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header with hamburger menu */}
        {isMobile && (
          <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 px-4 py-3 flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">🐟 Fish Feeder</h1>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        )}

        {/* Main content area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
