const { db } = require('./server/database');

console.log("--- Users ---");
const users = db.prepare('SELECT * FROM users').all();
console.log(users);

console.log("\n--- items ---");
const items = db.prepare('SELECT * FROM food_items').all();
console.log(items);

console.log("\n--- Stats ---");
const stats = db.prepare('SELECT * FROM user_stats').all();
console.log(stats);
