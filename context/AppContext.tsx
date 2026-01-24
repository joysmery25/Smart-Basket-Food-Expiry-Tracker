import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FoodItem, UserSettings, CommunityPost, User } from '../types';
import { mockFoodItems, mockCommunityPosts } from '../data/mockData';

interface AppContextType {
  foodItems: FoodItem[];
  addFoodItem: (item: FoodItem) => void;
  updateFoodItemQuantity: (id: string, quantity: number) => void;
  removeFoodItem: (id: string) => void;
  communityPosts: CommunityPost[];
  addCommunityPost: (post: CommunityPost) => void;
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
  user: User | null;
  updateProfile: (data: { name: string; email: string }) => Promise<void>;
  login: (userData: { email: string; name?: string; id?: string }, token: string) => void;
  logout: () => void;
  foodSaved: number;
  co2Saved: number;
  incrementFoodSaved: (kg: number) => void;
  currentStreak: number;
  recipesCooked: number;
  incrementRecipesCooked: () => void;
  getLoginHistory: () => Promise<any[]>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [settings, setSettings] = useState<UserSettings>({
    darkMode: false,
    vegetarianOnly: false,
    budgetFriendly: false,
    showDifficulty: true,
    familySize: 'couple',
    dietaryPreference: 'veg',
  });
  const [foodSaved, setFoodSaved] = useState(0);
  const [co2Saved, setCo2Saved] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [recipesCooked, setRecipesCooked] = useState(0);

  const fetchCurrentUser = async (token: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUser({ ...data.user, token, isAuthenticated: true });

        // Fetch valid user data
        fetchUserData(token);
      } else {
        // Token invalid or expired
        logout();
      }
    } catch (error) {
      console.error("Failed to fetch current user", error);
      logout();
    }
  };

  const fetchUserData = async (token: string) => {
    // Items
    fetch('http://localhost:5000/api/items', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setFoodItems(data.items || []))
      .catch(err => console.error(err));

    // Community
    fetch('http://localhost:5000/api/community', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setCommunityPosts(data.posts || []))
      .catch(err => console.error(err));

    // Stats
    fetch('http://localhost:5000/api/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        setFoodSaved(data.foodSaved);
        setCo2Saved(data.co2Saved);
        setCurrentStreak(data.currentStreak);
        setRecipesCooked(data.recipesCooked);
      })
      .catch(err => console.error(err));
  };

  const updateProfile = async (data: { name: string; email: string }) => {
    if (!user?.token) return;
    try {
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        // Optimistically update local state
        setUser(prev => prev ? { ...prev, ...data } : null);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error("Failed to update profile", error);
      throw error;
    }
  };

  // Restore session on mount
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser(token);
    }
  }, []);

  const login = (userData: { email: string; name?: string; id?: string }, token: string) => {
    localStorage.setItem('token', token);
    setUser({ ...userData, token, isAuthenticated: true });
    fetchUserData(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    // Clear data
    setFoodItems([]);
    setCommunityPosts([]);
  };

  const addFoodItem = async (item: FoodItem) => {
    if (!user?.token) return;
    try {
      const res = await fetch('http://localhost:5000/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(item)
      });
      const data = await res.json();
      if (res.ok) {
        setFoodItems([...foodItems, data.item]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateFoodItemQuantity = (id: string, quantity: number) => {
    // Optimistic
    setFoodItems(foodItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
    ).filter(item => item.quantity > 0));

    // Backend sync could be added here
  };

  const removeFoodItem = (id: string) => {
    if (!user?.token) return;
    // Optimistic
    setFoodItems(foodItems.filter(item => item.id !== id));

    fetch(`http://localhost:5000/api/items/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user.token}` }
    });
  };

  const addCommunityPost = async (post: CommunityPost) => {
    if (!user?.token) return;
    try {
      const res = await fetch('http://localhost:5000/api/community', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(post)
      });
      const data = await res.json();
      if (res.ok) {
        setCommunityPosts([data.post, ...communityPosts]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings({ ...settings, ...newSettings });
  };

  const incrementFoodSaved = (kg: number) => {
    const newSaved = foodSaved + kg;
    const newCo2 = co2Saved + (kg * 2.5);

    setFoodSaved(newSaved);
    setCo2Saved(newCo2);

    if (user?.token) {
      fetch('http://localhost:5000/api/stats', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ foodSaved: kg }) // send incremental
      });
    }
  };

  const incrementRecipesCooked = () => {
    setRecipesCooked(prev => prev + 1);
    if (user?.token) {
      fetch('http://localhost:5000/api/stats', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ recipesCooked: 1 }) // send incremental
      });
    }
  };

  const getLoginHistory = async () => {
    if (!user?.token) return [];
    try {
      const response = await fetch('http://localhost:5000/api/users/me/logins', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        return data.history;
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch login history", error);
      return [];
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        updateProfile,
        login,
        logout,
        foodItems,
        addFoodItem,
        updateFoodItemQuantity,
        removeFoodItem,
        communityPosts,
        addCommunityPost,
        settings,
        updateSettings,
        foodSaved,
        co2Saved,
        incrementFoodSaved,
        currentStreak,
        recipesCooked,
        incrementRecipesCooked,
        getLoginHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
