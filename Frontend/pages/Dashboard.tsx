import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, Clock, Package, ChefHat, Archive, Box, Home, Lightbulb } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { foodItems, settings } = useApp();
  const [showSmartTip, setShowSmartTip] = useState(true);
  const isDark = settings.darkMode;

  // Calculate stats
  const criticalItems = foodItems.filter(item => item.urgency === 'critical');
  const warningItems = foodItems.filter(item => item.urgency === 'warning');
  const safeItems = foodItems.filter(item => item.urgency === 'safe');

  const totalItems = foodItems.length;
  const expiringIn3Days = criticalItems.length + warningItems.length;

  // Group items by urgency
  const groupedItems = [
    { label: 'Expires Today/Tomorrow', items: criticalItems, color: 'red' },
    { label: 'Expires in 3 Days', items: warningItems, color: 'orange' },
    { label: 'Fresh & Safe', items: safeItems, color: 'green' },
  ];

  const getStorageIcon = (storage: string) => {
    switch (storage) {
      case 'fridge':
        return <Archive className="w-4 h-4" />;
      case 'freezer':
        return <Box className="w-4 h-4" />;
      case 'pantry':
        return <Home className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const smartSuggestions = [
    { text: 'Make a smoothie with your bananas and strawberries', items: 2 },
    { text: 'Cook veggie stir-fry using carrots and peppers', items: 3 },
    { text: 'French toast for breakfast with bread and milk', items: 2 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className={isDark ? 'text-white' : 'text-gray-800'}>Hi, Joys!</h1>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Let&apos;s save some food today 🌱</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8" />
            <div className="text-3xl">{expiringIn3Days}</div>
          </div>
          <div className="text-red-100 text-sm">Items expiring in 3 days</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8" />
            <div className="text-3xl">{totalItems}</div>
          </div>
          <div className="text-green-100 text-sm">Total items tracked</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <ChefHat className="w-8 h-8" />
            <div className="text-3xl">5</div>
          </div>
          <div className="text-orange-100 text-sm">Meals you can cook now</div>
        </motion.div>
      </div>

      {/* Smart Chatbot Tip */}
      {showSmartTip && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-2xl border-2 p-6 mb-8 relative transition-colors duration-300 ${
            isDark
              ? 'bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border-blue-700'
              : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
          }`}
        >
          <button
            onClick={() => setShowSmartTip(false)}
            className={isDark ? 'absolute top-4 right-4 text-gray-500 hover:text-gray-300' : 'absolute top-4 right-4 text-gray-400 hover:text-gray-600'}
          >
            ✕
          </button>
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className={isDark ? 'text-white mb-2' : 'text-gray-800 mb-2'}>Smart Suggestion</h3>
              <p className={`mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                You could cook a stir-fry today using your carrots and bell peppers. They expire in 3 days!
              </p>
              <Link
                to="/recipes"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                See Recipe Ideas
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Expiry Radar */}
      <div className="mb-8">
        <h2 className="text-gray-800 mb-4">Expiry Radar</h2>
        
        {groupedItems.map((group, groupIndex) => (
          group.items.length > 0 && (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * groupIndex }}
              className="mb-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-3 h-3 rounded-full ${
                  group.color === 'red' ? 'bg-red-500' :
                  group.color === 'orange' ? 'bg-orange-500' :
                  'bg-green-500'
                }`} />
                <h3 className="text-gray-700">{group.label}</h3>
                <span className="text-gray-500 text-sm">({group.items.length})</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * index }}
                    className={`bg-white rounded-xl p-4 border-2 ${
                      group.color === 'red' ? 'border-red-200 hover:border-red-300' :
                      group.color === 'orange' ? 'border-orange-200 hover:border-orange-300' :
                      'border-green-200 hover:border-green-300'
                    } shadow-sm hover:shadow-md transition-all`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-gray-800">{item.name}</h4>
                        <p className="text-gray-500 text-sm">{item.category}</p>
                      </div>
                      <div className="text-gray-400">
                        {getStorageIcon(item.storage)}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        <span>{item.quantity} {item.unit}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(item.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>

                    <Link
                      to="/recipes"
                      className={`w-full text-center px-3 py-2 rounded-lg text-sm transition-colors ${
                        group.color === 'red' ? 'bg-red-50 text-red-600 hover:bg-red-100' :
                        group.color === 'orange' ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' :
                        'bg-green-50 text-green-600 hover:bg-green-100'
                      } block`}
                    >
                      Use in a recipe
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        ))}
      </div>

      {/* Smart Suggestions Strip */}
      <div className="mb-8">
        <h2 className="text-gray-800 mb-4">Quick Wins</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {smartSuggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="flex-shrink-0 w-80 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ChefHat className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 text-sm mb-2">{suggestion.text}</p>
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-200 text-purple-700 text-xs px-2 py-1 rounded-full">
                      Uses {suggestion.items} expiring items
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};