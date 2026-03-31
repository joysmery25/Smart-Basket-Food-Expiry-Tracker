const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const BASE_URL = 'http://localhost:5000/api';
let TOKEN = '';
let USER_ID = '';

async function runTest() {
    console.log('🚀 Starting Backend Smoke Test...');

    // 1. Register User
    console.log('\n1. Registering new user...');
    const email = `test${Date.now()}@example.com`;
    const password = 'password123';

    try {
        const regRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Test User', email, password })
        });
        const regData = await regRes.json();

        if (!regRes.ok) throw new Error(regData.message);
        console.log('✅ Registration successful:', regData.user.email, "ID:", regData.user.id);
        TOKEN = regData.token;
        USER_ID = regData.user.id;
    } catch (e) {
        console.error('❌ Registration failed:', e.message);
        return;
    }

    // 2. Get Profile
    console.log('\n2. Fetching Profile...');
    try {
        const res = await fetch(`${BASE_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${TOKEN}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        console.log('✅ Profile fetched:', data.user.name);
    } catch (e) {
        console.error('❌ Profile fetch failed:', e.message);
    }

    // 3. Add Item
    console.log('\n3. Adding Food Item...');
    let itemId = '';
    try {
        const item = {
            name: 'Milk',
            category: 'Dairy',
            expiryDate: '2025-12-31',
            quantity: 1,
            unit: 'L',
            storage: 'fridge',
            urgency: 'safe'
        };
        const res = await fetch(`${BASE_URL}/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            },
            body: JSON.stringify(item)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        console.log('✅ Item added:', data.item.name);
        itemId = data.item.id;
    } catch (e) {
        console.error('❌ Add item failed:', e.message);
    }

    // 4. Get Items
    console.log('\n4. Fetching Items...');
    try {
        const res = await fetch(`${BASE_URL}/items`, {
            headers: { 'Authorization': `Bearer ${TOKEN}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        console.log(`✅ Items fetched: ${data.items.length} item(s)`);
    } catch (e) {
        console.error('❌ Get items failed:', e.message);
    }

    // 5. Create Community Post
    console.log('\n5. Creating Community Post...');
    try {
        const post = {
            itemName: 'Extra Milk',
            quantity: '500ml',
            expiryDate: 'Tomorrow',
            note: 'Unopened',
            building: 'Block A'
        };
        const res = await fetch(`${BASE_URL}/community`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            },
            body: JSON.stringify(post)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        console.log('✅ Post created:', data.post.itemName);
    } catch (e) {
        console.error('❌ Create post failed:', e.message);
    }

    // 6. Get Stats
    console.log('\n6. Fetching Stats...');
    try {
        const res = await fetch(`${BASE_URL}/stats`, {
            headers: { 'Authorization': `Bearer ${TOKEN}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        console.log(`✅ Stats fetched: Food Saved: ${data.foodSaved}kg`);
    } catch (e) {
        console.error('❌ Get stats failed:', e.message);
    }

    // 7. Update Stats
    console.log('\n7. Updating Stats (Saving 1kg)...');
    try {
        const res = await fetch(`${BASE_URL}/stats`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            },
            body: JSON.stringify({ foodSaved: 1 })
        });
        const text = await res.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            throw new Error(`Invalid JSON: ${text.substring(0, 1000)}...`);
        }

        if (!res.ok) throw new Error(JSON.stringify(data));
        console.log(`✅ Stats updated: Food Saved: ${data.foodSaved}kg`);
    } catch (e) {
        console.error('❌ Update stats failed:', e.message);
    }

    console.log('\n✨ Smoke Test Completed');
}

runTest();
