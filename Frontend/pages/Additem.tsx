import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Camera, Plus, Package, Calendar, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { FoodItem, Category, StorageLocation } from '../types';

export const AddItem: React.FC = () => {
  const { addFoodItem, settings } = useApp();
  const navigate = useNavigate();
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const isDark = settings.darkMode;

  const [formData, setFormData] = useState({
    name: '',
    category: 'Other' as Category,
    expiryDate: '',
    purchaseDate: '',
    storage: 'fridge' as StorageLocation,
    quantity: '',
    unit: 'pcs',
  });

  const commonItems = [
    'Chicken', 'Mutton', 'Fish', 'Prawns', 'Eggs', 'Rice', 'Curd', 'Tomatoes',
    'Onions', 'Brinjal', 'Gongura Leaves', 'Curry Leaves', 'Idli Batter', 'Tamarind'
  ];

  const categories: Category[] = ['Veg', 'Non-Veg', 'Dairy', 'Fruits', 'Snacks', 'Other'];
  const storageOptions: StorageLocation[] = ['fridge', 'freezer', 'pantry'];
  const units = ['pcs', 'g', 'kg', 'L', 'mL', 'cups', 'loaf', 'pack'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.expiryDate || !formData.quantity) {
      toast.error('Please fill in all required fields');
      return;
    }

    const getUrgency = (expiryDate: string) => {
      const today = new Date();
      const expiry = new Date(expiryDate);
      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 2) return 'critical' as const;
      if (diffDays <= 3) return 'warning' as const;
      return 'safe' as const;
    };

    const newItem: FoodItem = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      expiryDate: formData.expiryDate,
      purchaseDate: formData.purchaseDate || undefined,
      storage: formData.storage,
      quantity: parseFloat(formData.quantity),
      unit: formData.unit,
      urgency: getUrgency(formData.expiryDate),
    };

    addFoodItem(newItem);
    toast.success('Item added successfully! 🎉', { duration: 1500 });

    // Reset form
    setFormData({
      name: '',
      category: 'Other',
      expiryDate: '',
      purchaseDate: '',
      storage: 'fridge',
      quantity: '',
      unit: 'pcs',
    });

    // Navigate to dashboard after a short delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  const handleBarcodeScan = () => {
    setShowBarcodeModal(true);
  };

  const simulateScan = () => {
    const mockItem = {
      name: 'Organic Milk',
      category: 'Dairy' as Category,
      storage: 'fridge' as StorageLocation,
      quantity: '1',
      unit: 'L',
    };

    setFormData(prev => ({
      ...prev,
      ...mockItem,
    }));

    setShowBarcodeModal(false);
    toast.success('Barcode scanned! Auto-filled item details.');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-gray-800 mb-2">Add New Item</h1>
        <p className="text-gray-600 mb-6">Track your groceries to prevent waste</p>
      </motion.div>

      {/* Barcode Scan Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleBarcodeScan}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-6 mb-6 flex items-center justify-center gap-3 hover:shadow-lg transition-all"
      >
        <Camera className="w-6 h-6" />
        <span>Scan Barcode</span>
      </motion.button>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 sm:p-8"
      >
        {/* Item Name with Autocomplete Chips */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">
            Item Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Milk, Tomatoes, Bread..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {commonItems.map(item => (
              <button
                key={item}
                type="button"
                onClick={() => setFormData({ ...formData, name: item })}
                className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm hover:bg-green-100 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">
            Category
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setFormData({ ...formData, category: cat })}
                className={`px-4 py-2 rounded-lg border-2 transition-all ${formData.category === cat
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-600 hover:border-green-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Expiry Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              Purchase Date (optional)
            </label>
            <input
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Storage Location */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Storage Location
          </label>
          <div className="grid grid-cols-3 gap-3">
            {storageOptions.map(storage => (
              <button
                key={storage}
                type="button"
                onClick={() => setFormData({ ...formData, storage })}
                className={`px-4 py-3 rounded-lg border-2 capitalize transition-all ${formData.storage === storage
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-600 hover:border-green-200'
                  }`}
              >
                {storage}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity and Unit */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">
            <Package className="w-4 h-4 inline mr-1" />
            Quantity & Unit <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="Amount"
              step="0.1"
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
            <select
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {units.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tip */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 text-sm">
            💡 <strong>Tip:</strong> For leftovers, pick tomorrow or the next day as the expiry date to ensure you use them quickly.
          </p>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Item to Basket</span>
        </motion.button>
      </motion.form>

      {/* Barcode Scan Modal */}
      {showBarcodeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full"
          >
            <h2 className="text-gray-800 mb-4">Barcode Scanner</h2>
            <div className="bg-gray-100 rounded-xl p-8 mb-6 flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">
                  In the real app, this would open your camera and read the barcode automatically.
                </p>
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-6xl mb-2">|||||||||||</div>
                  <div className="text-gray-500 text-sm">Mock Barcode Preview</div>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBarcodeModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={simulateScan}
                className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Simulate Scan
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};