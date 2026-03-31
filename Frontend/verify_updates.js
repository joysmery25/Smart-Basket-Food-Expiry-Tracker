const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const BASE_URL = 'http://localhost:5000/api';

async function runVerification() {
    console.log('🚀 Starting Verification Script...');

    // 1. Register User
    const email = `verify${Date.now()}@test.com`;
    const password = 'password123';
    let token = '';

    try {
        const regRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Verify User', email, password })
        });

        if (!regRes.ok) {
            const text = await regRes.text();
            throw new Error(`Status: ${regRes.status}, Body: ${text}`);
        }

        const regData = await regRes.json();
        token = regData.token;
        console.log('✅ Registered user');
    } catch (e) {
        console.error('❌ Registration failed:', e.message);
        return;
    }

    // 2. Add Items with different expirations
    const today = new Date();

    // Critical (2 days from now)
    const criticalDate = new Date(today);
    criticalDate.setDate(today.getDate() + 2);

    // Warning (5 days from now)
    const warningDate = new Date(today);
    warningDate.setDate(today.getDate() + 5);

    // Safe (10 days from now)
    const safeDate = new Date(today);
    safeDate.setDate(today.getDate() + 10);

    const items = [
        { name: 'Critical Item', expiryDate: criticalDate.toISOString().split('T')[0], expected: 'critical' },
        { name: 'Warning Item', expiryDate: warningDate.toISOString().split('T')[0], expected: 'warning' },
        { name: 'Safe Item', expiryDate: safeDate.toISOString().split('T')[0], expected: 'safe' }
    ];

    console.log('\n--- Verifying Urgency ---');
    for (const item of items) {
        try {
            await fetch(`${BASE_URL}/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    name: item.name,
                    expiryDate: item.expiryDate,
                    quantity: 1,
                    unit: 'pcs'
                })
            });
        } catch (e) {
            console.error(`❌ Failed to add ${item.name}`);
        }
    }

    // Fetch items and check urgency
    try {
        const res = await fetch(`${BASE_URL}/items`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();

        for (const item of items) {
            const fetchedItem = data.items.find(i => i.name === item.name);
            if (fetchedItem) {
                if (fetchedItem.urgency === item.expected) {
                    console.log(`✅ ${item.name}: Expected ${item.expected}, got ${fetchedItem.urgency}`);
                } else {
                    console.error(`❌ ${item.name}: Expected ${item.expected}, got ${fetchedItem.urgency}`);
                }
            } else {
                console.error(`❌ ${item.name} not found`);
            }
        }
    } catch (e) {
        console.error('❌ Failed to fetch items');
    }

    // 3. Community Post Date Verification
    console.log('\n--- Verifying Community Post Date ---');
    try {
        const postRes = await fetch(`${BASE_URL}/community`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({
                itemName: 'Shared Item',
                quantity: '1',
                expiryDate: 'Tomorrow',
                building: 'A'
            })
        });
        const postData = await postRes.json();

        // Fetch posts to see formatted date
        const postsRes = await fetch(`${BASE_URL}/community`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const postsData = await postsRes.json();
        const myPost = postsData.posts.find(p => p.id === postData.post.id);

        if (myPost) {
            console.log(`✅ Posted At: "${myPost.postedAt}" (Expected "Just now" or similar)`);
        } else {
            console.error('❌ Post not found');
        }

    } catch (e) {
        console.error('❌ Community test failed:', e.message);
    }
}

runVerification();
