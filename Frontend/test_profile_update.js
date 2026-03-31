
const http = require('http');

const data = JSON.stringify({
    name: "subbu",
    email: "subbu@gmail.com"
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/profile',
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': 'Bearer Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MzhmYWNmM2M1YjU4MDBlZWM5NmYyMiIsImlhdCI6MTc2NTUwMTMwMSwiZXhwIjoxNzY4MDkzMzAxfQ.Pmt1Xhx5GlqK9L3pOFcbwgaXaHd7K_g4YVj1PulnsaA'
    }
};

const req = http.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`);

    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(data);
req.end();
