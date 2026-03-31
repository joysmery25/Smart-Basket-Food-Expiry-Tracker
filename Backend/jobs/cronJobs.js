const cron = require('node-cron');
const GroceryItem = require('../models/GroceryItem');
const User = require('../models/User');

const initCronJobs = () => {
    // Run every day at 8:00 AM
    cron.schedule('0 8 * * *', async () => {
        console.log('Running daily expiry check...');

        try {
            const today = new Date();
            const threeDaysFromNow = new Date();
            threeDaysFromNow.setDate(today.getDate() + 3);

            // Find items expiring within the next 3 days
            // We want items where expiryDate is > today AND expiryDate <= threeDaysFromNow
            const expiringItems = await GroceryItem.find({
                expiryDate: {
                    $gte: today,
                    $lte: threeDaysFromNow
                },
                isConsumed: false
            }).populate('user', 'email name');

            if (expiringItems.length > 0) {
                console.log(`Found ${expiringItems.length} items expiring soon.`);

                // Group by user to send one notification per user (simulated)
                const userNotifications = {};

                expiringItems.forEach(item => {
                    const userId = item.user._id;
                    if (!userNotifications[userId]) {
                        userNotifications[userId] = {
                            email: item.user.email,
                            name: item.user.name,
                            items: []
                        };
                    }
                    userNotifications[userId].items.push(item.itemName);
                });

                // Simulate sending notifications
                for (const userId in userNotifications) {
                    const notif = userNotifications[userId];
                    console.log(`[NOTIFICATION] To: ${notif.email} (${notif.name})`);
                    console.log(`Your items are expiring soon: ${notif.items.join(', ')}`);
                    // Here you would integrate Email or Push Notification logic
                }
            } else {
                console.log('No items expiring soon today.');
            }

        } catch (error) {
            console.error('Error in daily expiry check:', error);
        }
    });

    console.log('Cron jobs initialized: Daily check at 8:00 AM');
};

module.exports = initCronJobs;
