import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Plus, BookOpen, Users, TrendingUp, Settings, Leaf, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useApp();
  const isLanding = location.pathname === '/';
  const isDark = settings.darkMode;

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/add', icon: Plus, label: 'Add Item' },
    { path: '/recipes', icon: BookOpen, label: 'Recipes' },
    { path: '/community', icon: Users, label: 'Share & Rescue' },
    { path: '/impact', icon: TrendingUp, label: 'Impact' },
  ];

  const handleBack = () => {
    navigate(-1);
  };

  const handleForward = () => {
    navigate(1);
  };

  if (isLanding) {
    return <>{children}</>;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-green-50 via-orange-50 to-green-50'
    }`}>
      {/* Desktop Top Nav */}
      <nav className={`hidden md:block sticky top-0 z-50 shadow-sm transition-colors duration-300 ${
        isDark 
          ? 'bg-gray-800 border-b border-gray-700' 
          : 'bg-white border-b border-green-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              {/* Back/Forward Buttons */}
              <div className="flex gap-1">
                <button
                  onClick={handleBack}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark 
                      ? 'text-gray-400 hover:bg-gray-700' 
                      : 'text-gray-600 hover:bg-green-50'
                  }`}
                  aria-label="Go back"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleForward}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark 
                      ? 'text-gray-400 hover:bg-gray-700' 
                      : 'text-gray-600 hover:bg-green-50'
                  }`}
                  aria-label="Go forward"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              
              <Link to="/dashboard" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <span className={isDark ? 'text-white' : 'text-green-800'}>SmartBasket</span>
              </Link>
            </div>
            <div className="flex gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    location.pathname === item.path
                      ? isDark
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-700'
                      : isDark
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-600 hover:bg-green-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <Link
                to="/settings"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  location.pathname === '/settings'
                    ? isDark
                      ? 'bg-green-600 text-white'
                      : 'bg-green-100 text-green-700'
                    : isDark
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-green-50'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Back/Forward Navigation - Top Bar */}
      <div className={`md:hidden sticky top-0 z-50 shadow-sm transition-colors duration-300 ${
        isDark 
          ? 'bg-gray-800 border-b border-gray-700' 
          : 'bg-white border-b border-green-100'
      }`}>
        <div className="flex items-center justify-between px-4 h-14">
          <button
            onClick={handleBack}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'text-gray-400 hover:bg-gray-700' 
                : 'text-gray-600 hover:bg-green-50'
            }`}
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className={isDark ? 'text-white' : 'text-green-800'}>SmartBasket</span>
          </Link>
          
          <button
            onClick={handleForward}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'text-gray-400 hover:bg-gray-700' 
                : 'text-gray-600 hover:bg-green-50'
            }`}
            aria-label="Go forward"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="pb-20 md:pb-8">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 shadow-lg z-50 transition-colors duration-300 ${
        isDark 
          ? 'bg-gray-800 border-t border-gray-700' 
          : 'bg-white border-t border-green-100'
      }`}>
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                location.pathname === item.path
                  ? 'text-green-600'
                  : isDark
                  ? 'text-gray-400'
                  : 'text-gray-500'
              }`}
            >
              <item.icon className={`w-6 h-6 ${
                location.pathname === item.path ? 'scale-110' : ''
              } transition-transform`} />
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};
