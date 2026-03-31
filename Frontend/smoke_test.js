const fetch = require('node-fetch'); // You might need to install this if not available, or use native fetch in Node 18+

const BASE_URL = 'http://localhost:5000/api';
const EMAIL = `smoke_${Date.now()}@test.com`;
const PASSWORD = 'password123';
let TOKEN = '';

async function run() {
    console.log('🔥 Starting Smoke Test for Auth System...');

    // 1. Register
    console.log(`\n1. Registering user ${EMAIL}...`);
    try {
        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Smoke Test', email: EMAIL, password: PASSWORD })
        });
        const data = await res.json();
        if (res.ok) {
            console.log('✅ Register Success');
            TOKEN = data.token;
        } else {
            console.error('❌ Register Failed:', data);
            process.exit(1);
        }
    } catch (e) {
        console.error('❌ Register Network Error:', e.message);
        process.exit(1);
    }

    // 2. Login
    console.log(`\n2. Logging in...`);
    try {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: EMAIL, password: PASSWORD })
        });
        const data = await res.json();
        if (res.ok) {
            console.log('✅ Login Success');
            if (data.token !== TOKEN) console.log('ℹ️ New token received');
            TOKEN = data.token;
        } else {
            console.error('❌ Login Failed:', data);
        }
    } catch (e) { console.error(e.message); }

    // 3. Get Profile
    console.log(`\n3. Fetching Profile...`);
    try {
        const res = await fetch(`${BASE_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${TOKEN}` }
        });
        const data = await res.json();
        if (res.ok) {
            console.log(`✅ Profile: ${data.user.email}`);
        } else {
            console.error('❌ Profile Failed:', data);
        }
    } catch (e) { console.error(e.message); }

    // 4. Update Profile
    console.log(`\n4. Updating Profile...`);
    try {
        const res = await fetch(`${BASE_URL}/auth/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TOKEN}`
            },
            body: JSON.stringify({ name: 'Smoke Updated' })
        });
        const data = await res.json();
        if (res.ok) {
            console.log(`✅ Update Success: ${data.user.name}`);
        } else {
            console.error('❌ Update Failed:', data);
        }
    } catch (e) { console.error(e.message); }

    // 5. Get Login History
    console.log(`\n5. Fetching Login History...`);
    try {
        const res = await fetch(`${BASE_URL}/users/me/logins`, {
            headers: { 'Authorization': `Bearer ${TOKEN}` }
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data.history)) {
            console.log(`✅ History Fetched. Count: ${data.history.length}`);
            console.log('Last Login:', data.history[0]);
        } else {
            console.error('❌ History Failed:', data);
        }
    } catch (e) { console.error(e.message); }

    console.log('\n✨ Smoke Test Complete!');
}

run();
