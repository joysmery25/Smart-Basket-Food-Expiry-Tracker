const http = require('http');

// Helper to base64url encode
const base64url = (source) => Buffer.from(JSON.stringify(source)).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

// Create a fake JWT
const header = { alg: 'HS256', typ: 'JWT' };
const payload = {
    email: 'testgoogleuser@example.com',
    name: 'Test Google User',
    sub: '1234567890',
    picture: 'http://example.com/photo.jpg'
};
const fakeToken = `${base64url(header)}.${base64url(payload)}.signatureignored`;

const data = JSON.stringify({
    tokenId: fakeToken
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/google',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => console.log(`BODY: ${body}`));
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
