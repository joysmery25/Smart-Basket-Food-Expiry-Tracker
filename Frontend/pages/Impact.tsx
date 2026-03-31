import React from 'react';
import { useApp } from '../context/AppContext';
import { TrendingUp, Award, Flame, Target, Leaf } from 'lucide-react';
import { motion } from 'motion/react';
import { mockBadges } from '../data/mockData';

export const Impact: React.FC = () => {
  const { foodSaved, co2Saved, currentStreak, recipesCooked } = useApp();

  const monthlyGoal = 5; // kg
  const progress = (foodSaved / monthlyGoal) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-gray-800 mb-2">Your Impact</h1>
        <p className="text-gray-600 mb-6">
          Track your positive impact on the environment
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <Leaf className="w-10 h-10 opacity-80" />
          </div>
          <div className="text-3xl mb-1">{foodSaved.toFixed(1)} kg</div>
          <div className="text-green-100 text-sm">Food Saved</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-10 h-10 opacity-80" />
          </div>
          <div className="text-3xl mb-1">{co2Saved.toFixed(1)} kg</div>
          <div className="text-blue-100 text-sm">CO₂ Reduced</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <Flame className="w-10 h-10 opacity-80" />
          </div>
          <div className="text-3xl mb-1">{currentStreak} days</div>
          <div className="text-orange-100 text-sm">Current Streak</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <Award className="w-10 h-10 opacity-80" />
          </div>
          <div className="text-3xl mb-1">{recipesCooked}</div>
          <div className="text-purple-100 text-sm">Recipes Cooked</div>
        </motion.div>
      </div>

      {/* Monthly Goal Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-lg border-2 border-green-100 p-6 sm:p-8 mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-gray-800">Monthly Goal</h2>
            <p className="text-gray-600 text-sm">Save {monthlyGoal} kg of food this month</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700">Progress</span>
            <span className="text-gray-800">{foodSaved.toFixed(1)} / {monthlyGoal} kg</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full"
            />
          </div>
          <p className="text-gray-500 text-sm mt-2">
            {progress >= 100 ? '🎉 Goal achieved! Amazing work!' : `${(monthlyGoal - foodSaved).toFixed(1)} kg to go!`}
          </p>
        </div>
      </motion.div>

      {/* Streak Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-6 sm:p-8 mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <Flame className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-gray-800">Waste-Free Streak</h2>
            <p className="text-gray-600 text-sm">Keep the momentum going!</p>
          </div>
        </div>

        <div className="text-center py-6">
          <div className="text-6xl mb-4">🔥</div>
          <div className="text-4xl text-orange-600 mb-2">{currentStreak} Days</div>
          <p className="text-gray-600">
            You&apos;ve had a <strong>{currentStreak}-day streak</strong> of zero food wasted!
          </p>
        </div>
      </motion.div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-2xl shadow-lg border-2 border-purple-100 p-6 sm:p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Award className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-gray-800">Achievement Badges</h2>
            <p className="text-gray-600 text-sm">Unlock badges as you save more food</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className={`rounded-xl p-6 border-2 transition-all ${
                badge.achieved
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 shadow-md'
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div className="text-center">
                <div className={`text-5xl mb-3 ${badge.achieved ? '' : 'grayscale'}`}>
                  {badge.icon}
                </div>
                <h3 className={`mb-2 ${badge.achieved ? 'text-gray-800' : 'text-gray-500'}`}>
                  {badge.name}
                </h3>
                <p className={`text-sm ${badge.achieved ? 'text-gray-600' : 'text-gray-400'}`}>
                  {badge.description}
                </p>
                {badge.achieved && (
                  <div className="mt-3 inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                    <Award className="w-3 h-3" />
                    Achieved
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Environmental Impact Context */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl p-6 sm:p-8"
      >
        <h3 className="text-gray-800 mb-4">What Your Impact Means</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl mb-2">🌍</div>
            <p className="text-gray-700 mb-1">Carbon Reduction</p>
            <p className="text-gray-600">
              {co2Saved.toFixed(1)} kg CO₂ is equivalent to driving {(co2Saved * 4).toFixed(0)} km less
            </p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl mb-2">💰</div>
            <p className="text-gray-700 mb-1">Money Saved</p>
            <p className="text-gray-600">
              Approximately ${(foodSaved * 3).toFixed(0)} saved from food that didn&apos;t go to waste
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
