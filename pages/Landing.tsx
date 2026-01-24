import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Bell, ChefHat, Users, Leaf, TrendingDown, Recycle } from 'lucide-react';
import { motion } from 'motion/react';

export const Landing: React.FC = () => {
  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-orange-50 to-green-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Leaf className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-green-800 mb-4">
              SmartBasket – Food Saver
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Never let your groceries go to waste again. Track expiry dates, get smart recipe suggestions, and join a community that cares about reducing food waste.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
              >
                Try Demo
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={scrollToHowItWorks}
                className="bg-white text-green-600 px-8 py-4 rounded-xl border-2 border-green-200 hover:border-green-300 hover:shadow-md transition-all"
              >
                How it Works
              </button>
            </div>
            <div className="mt-8">
              <Link to="/login" className="text-green-700 font-medium hover:underline">
                Already have an account? Log in
              </Link>
            </div>
          </motion.div>

          {/* Impact Counter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 bg-white rounded-2xl shadow-lg p-6 sm:p-8 max-w-4xl mx-auto border border-green-100"
          >
            <h3 className="text-center text-gray-700 mb-6">
              Our Community Impact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-green-600 mb-2">🍎</div>
                <div className="text-gray-800 mb-1">2,400 kg</div>
                <div className="text-gray-500 text-sm">Food Saved</div>
              </div>
              <div className="text-center">
                <div className="text-orange-600 mb-2">🌍</div>
                <div className="text-gray-800 mb-1">6,000 kg</div>
                <div className="text-gray-500 text-sm">CO₂ Reduced</div>
              </div>
              <div className="text-center">
                <div className="text-green-600 mb-2">👥</div>
                <div className="text-gray-800 mb-1">1,250</div>
                <div className="text-gray-500 text-sm">Active Users</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-gray-800 mb-4">
              How SmartBasket Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Four simple steps to eliminate food waste and save money
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: ShoppingCart,
                title: 'Buy Groceries',
                description: 'Shop for your weekly groceries as usual',
                color: 'bg-blue-100 text-blue-600',
              },
              {
                icon: Bell,
                title: 'Add & Track',
                description: 'Scan or add items with expiry dates to your basket',
                color: 'bg-orange-100 text-orange-600',
              },
              {
                icon: ChefHat,
                title: 'Get Recipes',
                description: 'Receive smart recipe suggestions using expiring items',
                color: 'bg-green-100 text-green-600',
              },
              {
                icon: Users,
                title: 'Share & Save',
                description: 'Share leftovers with neighbors instead of throwing away',
                color: 'bg-purple-100 text-purple-600',
              },
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md hover:shadow-lg transition-all">
                  <div className={`w-14 h-14 ${step.color} rounded-xl flex items-center justify-center mb-4`}>
                    <step.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-gray-300">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Detail */}
      <div id="how-it-works" className="py-16 sm:py-24 bg-gradient-to-br from-green-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-gray-800 mb-4">
              Features That Make a Difference
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingDown,
                title: 'Smart Expiry Tracking',
                description: 'Color-coded urgency system helps you prioritize what to use first. Never miss an expiry date again.',
              },
              {
                icon: ChefHat,
                title: 'AI Recipe Suggestions',
                description: 'Get personalized recipe ideas that use your expiring ingredients. Turn waste into delicious meals.',
              },
              {
                icon: Recycle,
                title: 'Community Sharing',
                description: 'Connect with neighbors to share excess food. Build community while reducing waste together.',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-green-100 hover:border-green-200 transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 sm:py-24 bg-gradient-to-r from-green-500 to-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-white mb-4">
              Ready to Stop Wasting Food?
            </h2>
            <p className="text-green-50 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are saving money, reducing waste, and making a positive environmental impact.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-white text-green-600 px-8 py-4 rounded-xl hover:shadow-xl transition-all group"
            >
              Start Saving Food Today
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
