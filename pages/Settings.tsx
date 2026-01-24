import React from 'react';
import { useApp } from '../context/AppContext';
import { Settings as SettingsIcon, Moon, Sun, DollarSign, Target, Users, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export const Settings: React.FC = () => {
  const { settings, updateSettings, user, updateProfile, getLoginHistory } = useApp();
  const isDark = settings.darkMode;

  const [name, setName] = React.useState(user?.name || '');
  const [email, setEmail] = React.useState(user?.email || '');
  const [isEditing, setIsEditing] = React.useState(false);
  const [loginHistory, setLoginHistory] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      getLoginHistory().then(setLoginHistory);
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({ name, email });
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleToggle = (key: keyof typeof settings, value: boolean) => {
    updateSettings({ [key]: value });

    // Special toast for dark mode
    if (key === 'darkMode') {
      toast.success(
        value ? '🌙 Dark mode enabled' : '☀️ Dark mode disabled',
        { duration: 1500 }
      );
    } else if (key === 'budgetFriendly') {
      toast.success(
        value ? '💰 Budget-friendly mode enabled' : 'Budget filter disabled',
        { duration: 1500 }
      );
    } else {
      toast.success('Settings updated', { duration: 1500 });
    }
  };

  const handleSelect = (key: keyof typeof settings, value: string) => {
    updateSettings({ [key]: value });
    toast.success('Preference updated', { duration: 1500 });
  };

  const ToggleSwitch = ({
    enabled,
    onChange
  }: {
    enabled: boolean;
    onChange: () => void;
  }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ${enabled
        ? 'bg-green-600'
        : isDark ? 'bg-gray-600' : 'bg-gray-300'
        }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
      />
    </button>
  );

  return (
    <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 transition-colors duration-300`}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className={isDark ? 'text-white' : 'text-gray-800'}>Settings</h1>
        <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Customize your SmartBasket experience
        </p>
      </motion.div>

      <div className="space-y-6">
        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl shadow-lg border-2 p-6 transition-colors duration-300 ${isDark
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-100'
            }`}
        >
          <h2 className={`mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            <Users className="w-6 h-6 text-purple-600" />
            Profile Settings
          </h2>

          {user ? (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className={`block mb-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors ${isDark
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                    : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-purple-500'
                    } ${!isEditing && 'opacity-60 cursor-not-allowed'}`}
                />
              </div>

              <div>
                <label className={`block mb-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 rounded-lg border transition-colors ${isDark
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                    : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-purple-500'
                    } ${!isEditing && 'opacity-60 cursor-not-allowed'}`}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setName(user.name || '');
                        setEmail(user.email || '');
                      }}
                      className={`px-4 py-2 rounded-lg ${isDark
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
          ) : (
            <div className={`text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Please log in to manage your profile.
            </div>
          )}
        </motion.div>

        {/* Login History Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl shadow-lg border-2 p-6 transition-colors duration-300 ${isDark
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-100'
            }`}
        >
          <h2 className={`mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            <Shield className="w-6 h-6 text-blue-600" />
            Recent Logins
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                <tr>
                  <th className="pb-3">Time</th>
                  <th className="pb-3">Method</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">IP Address</th>
                </tr>
              </thead>
              <tbody className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                {loginHistory.length > 0 ? (
                  loginHistory.map((login, idx) => (
                    <tr key={idx} className="border-t border-gray-700/10">
                      <td className="py-3">{new Date(login.timestamp).toLocaleString()}</td>
                      <td className="py-3 capitalize">{login.method}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${login.success
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                          {login.success ? 'Success' : 'Failed'}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-xs">{login.ip || 'Unknown'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-500">
                      No login history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Appearance Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl shadow-lg border-2 p-6 transition-colors duration-300 ${isDark
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-100'
            }`}
        >
          <h2 className={`mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            <SettingsIcon className="w-6 h-6 text-green-600" />
            Appearance
          </h2>

          <div className="space-y-4">
            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {settings.darkMode ? (
                  <Moon className="w-5 h-5 text-blue-400" />
                ) : (
                  <Sun className="w-5 h-5 text-orange-500" />
                )}
                <div>
                  <div className={isDark ? 'text-white' : 'text-gray-800'}>
                    Dark Mode
                  </div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Switch between light and dark theme
                  </div>
                </div>
              </div>
              <ToggleSwitch
                enabled={settings.darkMode}
                onChange={() => handleToggle('darkMode', !settings.darkMode)}
              />
            </div>
          </div>
        </motion.div>

        {/* Recipe Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`rounded-2xl shadow-lg border-2 p-6 transition-colors duration-300 ${isDark
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-100'
            }`}
        >
          <h2 className={`mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            <Target className="w-6 h-6 text-orange-600" />
            Recipe Preferences
          </h2>

          <div className="space-y-6">
            {/* Budget-Friendly Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <div className={isDark ? 'text-white' : 'text-gray-800'}>
                    Show Budget-Friendly Recipes
                  </div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Filter to show only affordable recipes
                  </div>
                </div>
              </div>
              <ToggleSwitch
                enabled={settings.budgetFriendly}
                onChange={() => handleToggle('budgetFriendly', !settings.budgetFriendly)}
              />
            </div>

            {/* Vegetarian Only */}
            <div className="flex items-center justify-between">
              <div>
                <div className={isDark ? 'text-white' : 'text-gray-800'}>
                  Vegetarian Only
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Show only vegetarian recipes
                </div>
              </div>
              <ToggleSwitch
                enabled={settings.vegetarianOnly}
                onChange={() => handleToggle('vegetarianOnly', !settings.vegetarianOnly)}
              />
            </div>

            {/* Show Difficulty */}
            <div className="flex items-center justify-between">
              <div>
                <div className={isDark ? 'text-white' : 'text-gray-800'}>
                  Show Recipe Difficulty
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Display difficulty level on recipes
                </div>
              </div>
              <ToggleSwitch
                enabled={settings.showDifficulty}
                onChange={() => handleToggle('showDifficulty', !settings.showDifficulty)}
              />
            </div>

            {/* Dietary Preference */}
            <div>
              <label className={`block mb-3 ${isDark ? 'text-white' : 'text-gray-700'}`}>
                Dietary Preference
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['veg', 'nonveg'] as const).map(diet => (
                  <button
                    key={diet}
                    onClick={() => handleSelect('dietaryPreference', diet)}
                    className={`px-4 py-3 rounded-lg border-2 capitalize transition-all ${settings.dietaryPreference === diet
                      ? isDark
                        ? 'border-green-500 bg-green-900/30 text-green-400'
                        : 'border-purple-500 bg-purple-50 text-purple-700'
                      : isDark
                        ? 'border-gray-600 text-gray-400 hover:border-gray-500'
                        : 'border-gray-200 text-gray-600 hover:border-purple-200'
                      }`}
                  >
                    {diet === 'veg' ? 'Vegetarian' : 'Non-Veg'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Family Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`rounded-2xl shadow-lg border-2 p-6 transition-colors duration-300 ${isDark
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-100'
            }`}
        >
          <h2 className={`mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            <Users className="w-6 h-6 text-blue-600" />
            Household
          </h2>

          <div>
            <label className={`block mb-3 ${isDark ? 'text-white' : 'text-gray-700'}`}>
              Family Size
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['single', 'couple', 'family'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => handleSelect('familySize', size)}
                  className={`px-4 py-3 rounded-lg border-2 capitalize transition-all ${settings.familySize === size
                    ? isDark
                      ? 'border-blue-500 bg-blue-900/30 text-blue-400'
                      : 'border-blue-500 bg-blue-50 text-blue-700'
                    : isDark
                      ? 'border-gray-600 text-gray-400 hover:border-gray-500'
                      : 'border-gray-200 text-gray-600 hover:border-blue-200'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`rounded-2xl shadow-lg border-2 p-6 text-center transition-colors duration-300 ${isDark
            ? 'bg-gray-800 border-gray-700'
            : 'bg-gradient-to-r from-green-50 to-orange-50 border-green-200'
            }`}
        >
          <div className="text-4xl mb-2">🌱</div>
          <h3 className={isDark ? 'text-white' : 'text-gray-800'}>SmartBasket – Food Saver</h3>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Version 1.0.0 • Made with ❤️ for reducing food waste
          </p>
        </motion.div>
      </div>
    </div>
  );
};
