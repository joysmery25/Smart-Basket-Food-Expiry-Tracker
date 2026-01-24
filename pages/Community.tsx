import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Share2, MessageCircle, MapPin, Clock, Plus, Check, X } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { CommunityPost } from '../types';

export const Community: React.FC = () => {
  const { communityPosts, addCommunityPost } = useApp();
  const [showShareForm, setShowShareForm] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<{ [key: string]: string }>({});
  const [postStatuses, setPostStatuses] = useState<{ [key: string]: 'accepted' | 'rejected' | 'pending' }>({});

  const [shareFormData, setShareFormData] = useState({
    itemName: '',
    quantity: '',
    expiryDate: '',
    note: '',
    building: 'Block A',
  });

  const handleShare = (e: React.FormEvent) => {
    e.preventDefault();

    const newPost: CommunityPost = {
      id: Date.now().toString(),
      itemName: shareFormData.itemName,
      quantity: shareFormData.quantity,
      expiryDate: shareFormData.expiryDate,
      note: shareFormData.note,
      building: shareFormData.building,
      postedBy: 'You',
      postedAt: 'Just now',
      status: 'pending',
    };

    addCommunityPost(newPost);
    toast.success('Your item has been shared with the community! 🤝', { duration: 1500 });

    // Reset form
    setShareFormData({
      itemName: '',
      quantity: '',
      expiryDate: '',
      note: '',
      building: 'Block A',
    });
    setShowShareForm(false);
  };

  const handleInterested = (postId: string, postedBy: string) => {
    setPendingRequests({ ...pendingRequests, [postId]: 'Joys' });
    toast.success(`Interest sent to ${postedBy}!`, { duration: 1500 });
  };

  const handleAccept = (postId: string, interestedUser: string, building: string) => {
    setPostStatuses({ ...postStatuses, [postId]: 'accepted' });
    toast.success(
      <div>
        <div>Request accepted! ✓</div>
        <div className="text-sm">You can pick it up from {building}</div>
      </div>,
      { duration: 2000 }
    );
  };

  const handleReject = (postId: string) => {
    setPostStatuses({ ...postStatuses, [postId]: 'rejected' });
    toast.error('Request declined. Maybe next time!', { duration: 1500 });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-gray-800 mb-2">Share & Rescue</h1>
        <p className="text-gray-600 mb-6">
          Connect with neighbors to share food and reduce waste together
        </p>
      </motion.div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 mb-8"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-gray-800 mb-1">Community Food Sharing</h3>
            <p className="text-gray-600 text-sm">
              Share excess food with neighbors before it expires. Help others while reducing waste in your community!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Share Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-white rounded-2xl shadow-lg border-2 border-green-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-800">Share What You Have</h2>
              {!showShareForm && (
                <button
                  onClick={() => setShowShareForm(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Share
                </button>
              )}
            </div>

            {showShareForm ? (
              <form onSubmit={handleShare} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2 text-sm">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={shareFormData.itemName}
                    onChange={(e) => setShareFormData({ ...shareFormData, itemName: e.target.value })}
                    placeholder="e.g., Biryani, Pesarattu, Idli..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 text-sm">
                    Quantity
                  </label>
                  <input
                    type="text"
                    value={shareFormData.quantity}
                    onChange={(e) => setShareFormData({ ...shareFormData, quantity: e.target.value })}
                    placeholder="e.g., 2 portions, 4 pieces..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 text-sm">
                    Best Before
                  </label>
                  <input
                    type="text"
                    value={shareFormData.expiryDate}
                    onChange={(e) => setShareFormData({ ...shareFormData, expiryDate: e.target.value })}
                    placeholder="e.g., Today 9 PM, Tomorrow..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 text-sm">
                    Building/Block
                  </label>
                  <select
                    value={shareFormData.building}
                    onChange={(e) => setShareFormData({ ...shareFormData, building: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  >
                    <option>Block A</option>
                    <option>Block B</option>
                    <option>Block C</option>
                    <option>Block D</option>
                    <option>Block E</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 text-sm">
                    Note (optional)
                  </label>
                  <textarea
                    value={shareFormData.note}
                    onChange={(e) => setShareFormData({ ...shareFormData, note: e.target.value })}
                    placeholder="Any additional details..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowShareForm(false)}
                    className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Item
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Share2 className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Have excess food? Share it with your neighbors!
                </p>
                <button
                  onClick={() => setShowShareForm(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Create Sharing Post
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right: Available Items */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-gray-800 mb-4">Available Near You</h2>
          <div className="space-y-4">
            {communityPosts.map((post, index) => {
              const hasPendingRequest = pendingRequests[post.id];
              const status = postStatuses[post.id] || 'pending';

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-gray-800">{post.itemName}</h3>
                      <p className="text-gray-500 text-sm">{post.quantity}</p>
                    </div>
                    <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs">
                      {post.expiryDate}
                    </div>
                  </div>

                  {post.note && (
                    <p className="text-gray-600 text-sm mb-3 italic">&quot;{post.note}&quot;</p>
                  )}

                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{post.building}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.postedAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-gray-600 text-sm">By {post.postedBy}</span>

                    {/* Show different UI based on post ownership and status */}
                    {post.postedBy === 'You' ? (
                      hasPendingRequest ? (
                        status === 'pending' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAccept(post.id, hasPendingRequest, post.building)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                            >
                              <Check className="w-4 h-4" />
                              Accept
                            </button>
                            <button
                              onClick={() => handleReject(post.id)}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
                            >
                              <X className="w-4 h-4" />
                              Reject
                            </button>
                          </div>
                        ) : status === 'accepted' ? (
                          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            Accepted
                          </div>
                        ) : (
                          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                            <X className="w-4 h-4" />
                            Declined
                          </div>
                        )
                      ) : (
                        <div className="text-gray-500 text-sm">Waiting for interest...</div>
                      )
                    ) : (
                      !hasPendingRequest ? (
                        <button
                          onClick={() => handleInterested(post.id, post.postedBy)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
                        >
                          <MessageCircle className="w-4 h-4" />
                          I&apos;m Interested
                        </button>
                      ) : (
                        status === 'pending' ? (
                          <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm">
                            Request sent...
                          </div>
                        ) : status === 'accepted' ? (
                          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            Accepted – Pick up from {post.building}
                          </div>
                        ) : (
                          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm">
                            Declined
                          </div>
                        )
                      )
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
