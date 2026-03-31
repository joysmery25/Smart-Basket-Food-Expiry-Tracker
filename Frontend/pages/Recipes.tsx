import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { mockRecipes } from '../data/mockData';
import { ChefHat, Clock, TrendingUp, Check, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export const Recipes: React.FC = () => {
  const { updateFoodItemQuantity, incrementFoodSaved, incrementRecipesCooked, settings } = useApp();
  const [cookedRecipes, setCookedRecipes] = useState<string[]>([]);
  const isDark = settings.darkMode;

  // Show toast when budget-friendly mode is toggled
  useEffect(() => {
    if (settings.budgetFriendly) {
      toast.success('💰 Showing budget-friendly recipes', { duration: 1500 });
    }
  }, [settings.budgetFriendly]);

  // Filter recipes based on settings
  const filteredRecipes = mockRecipes.filter(recipe => {
    if (settings.vegetarianOnly && !recipe.vegetarian) return false;
    if (settings.budgetFriendly && !recipe.budgetFriendly) return false;
    return true;
  });

  const handleMarkAsCooked = (recipeId: string, recipeName: string, usedItems: string[]) => {
    setCookedRecipes([...cookedRecipes, recipeId]);
    incrementFoodSaved(0.5);
    incrementRecipesCooked();

    toast.success(
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Check className="w-5 h-5 text-green-600" />
          <span>Nice! You just saved food from being wasted 🎉</span>
        </div>
        <p className="text-sm text-gray-600">Recipe: {recipeName}</p>
      </div>,
      { duration: 2000 }
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return isDark ? 'bg-green-900/30 text-green-400 border border-green-700' : 'bg-green-100 text-green-700';
      case 'medium':
        return isDark ? 'bg-orange-900/30 text-orange-400 border border-orange-700' : 'bg-orange-100 text-orange-700';
      case 'hard':
        return isDark ? 'bg-red-900/30 text-red-400 border border-red-700' : 'bg-red-100 text-red-700';
      default:
        return isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className={isDark ? 'text-white' : 'text-gray-800'}>Recipe Ideas</h1>
        <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Delicious meals using ingredients that are expiring soon
        </p>
      </motion.div>

      {/* Budget-Friendly Mode Banner */}
      <AnimatePresence>
        {settings.budgetFriendly && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`rounded-xl p-4 mb-6 border-2 transition-colors duration-300 ${isDark
                ? 'bg-green-900/20 border-green-700'
                : 'bg-green-50 border-green-300'
              }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-green-800' : 'bg-green-200'
                }`}>
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className={isDark ? 'text-green-400' : 'text-green-800'}>
                  Budget-Friendly Mode
                </h3>
                <p className={`text-sm ${isDark ? 'text-green-500' : 'text-green-700'}`}>
                  Showing only affordable recipes that save money
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl border-2 p-6 mb-8 transition-colors duration-300 ${isDark
            ? 'bg-gradient-to-r from-orange-900/20 to-red-900/20 border-orange-700'
            : 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200'
          }`}
      >
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-orange-800' : 'bg-orange-100'
            }`}>
            <TrendingUp className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className={isDark ? 'text-white' : 'text-gray-800'}>
              Save Food, Save Money
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              These recipes use ingredients from your basket that are expiring soon. Cook them today to prevent waste!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredRecipes.map((recipe, index) => {
            const isCooked = cookedRecipes.includes(recipe.id);

            return (
              <motion.div
                key={recipe.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className={`rounded-2xl shadow-lg border-2 overflow-hidden hover:shadow-xl transition-all duration-300 ${isCooked
                    ? isDark
                      ? 'border-green-600 bg-green-900/20'
                      : 'border-green-300 bg-green-50'
                    : isDark
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-white border-gray-100'
                  }`}
              >
                {/* Recipe Image/Emoji */}
                <div className={`h-32 flex items-center justify-center text-6xl transition-colors duration-300 ${isDark
                    ? 'bg-gradient-to-br from-gray-700 to-gray-600'
                    : 'bg-gradient-to-br from-orange-100 to-red-100'
                  }`}>
                  {recipe.image}
                </div>

                {/* Recipe Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className={`flex-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>
                      {recipe.name}
                    </h3>
                    {isCooked && (
                      <div className="bg-green-500 text-white rounded-full p-1">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {recipe.description}
                  </p>

                  {/* Recipe Meta */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 transition-colors duration-300 ${isDark
                        ? 'bg-red-900/30 text-red-400 border border-red-700'
                        : 'bg-red-100 text-red-700'
                      }`}>
                      <TrendingUp className="w-3 h-3" />
                      Uses {recipe.expiringItemCount} expiring {recipe.expiringItemCount === 1 ? 'item' : 'items'}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs flex items-center gap-1 transition-colors duration-300 ${isDark
                        ? 'bg-blue-900/30 text-blue-400 border border-blue-700'
                        : 'bg-blue-100 text-blue-700'
                      }`}>
                      <Clock className="w-3 h-3" />
                      {recipe.cookTime}
                    </div>
                    {settings.showDifficulty && (
                      <div className={`px-3 py-1 rounded-full text-xs capitalize ${getDifficultyColor(recipe.difficulty)}`}>
                        {recipe.difficulty}
                      </div>
                    )}
                    {recipe.vegetarian && (
                      <div className={`px-3 py-1 rounded-full text-xs transition-colors duration-300 ${isDark
                          ? 'bg-green-900/30 text-green-400 border border-green-700'
                          : 'bg-green-100 text-green-700'
                        }`}>
                        🌱 Vegetarian
                      </div>
                    )}
                    {recipe.budgetFriendly && (
                      <div className={`px-3 py-1 rounded-full text-xs transition-colors duration-300 ${isDark
                          ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-700'
                          : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        💰 Budget
                      </div>
                    )}
                  </div>

                  {/* Used Items */}
                  <div className="mb-4">
                    <div className={`text-sm mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Uses:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {recipe.usedItems.map((item, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-1 rounded text-xs transition-colors duration-300 ${isDark
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  {!isCooked ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleMarkAsCooked(recipe.id, recipe.name, recipe.usedItems)}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <ChefHat className="w-5 h-5" />
                      <span>Mark as Cooked</span>
                    </motion.button>
                  ) : (
                    <div className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-colors duration-300 ${isDark
                        ? 'bg-green-900/30 text-green-400 border border-green-700'
                        : 'bg-green-100 text-green-700'
                      }`}>
                      <Check className="w-5 h-5" />
                      <span>Already Cooked!</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredRecipes.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
            <ChefHat className={`w-10 h-10 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
          </div>
          <h3 className={isDark ? 'text-white' : 'text-gray-700'}>
            No recipes available
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Try adjusting your preferences in settings
          </p>
        </motion.div>
      )}
    </div>
  );
};
