export type StorageLocation = 'fridge' | 'freezer' | 'pantry';
export type Category = 'Veg' | 'Non-Veg' | 'Dairy' | 'Fruits' | 'Snacks' | 'Other';
export type UrgencyLevel = 'critical' | 'warning' | 'safe';

export interface FoodItem {
  id: string;
  name: string;
  category: Category;
  expiryDate: string;
  purchaseDate?: string;
  storage: StorageLocation;
  quantity: number;
  unit: string;
  urgency: UrgencyLevel;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  usedItems: string[];
  expiringItemCount: number;
  cookTime: string;
  difficulty: 'easy' | 'medium' | 'hard';
  vegetarian: boolean;
  budgetFriendly: boolean;
}

export interface CommunityPost {
  id: string;
  itemName: string;
  quantity: string;
  expiryDate: string;
  note: string;
  building: string;
  postedBy: string;
  postedAt: string;
  status?: 'pending' | 'accepted' | 'rejected';
  interestedUser?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  achieved: boolean;
}

export interface UserSettings {
  darkMode: boolean;
  vegetarianOnly: boolean;
  budgetFriendly: boolean;
  showDifficulty: boolean;
  familySize: 'single' | 'couple' | 'family';
  dietaryPreference: 'veg' | 'nonveg';
}

export interface User {
  id?: string;
  name?: string;
  email: string;
  token: string;
  isAuthenticated: boolean;
}