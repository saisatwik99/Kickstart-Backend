const redis = require("redis");

let redisPort = 6379;  // Replace with your redis port
let redisHost = process.env.REDIS_HOST || "127.0.0.1";  // Replace with your redis host
const client = redis.createClient({
    socket: {
      port: redisPort,
      host: redisHost,
    }
  });

(async () => {
    // Connect to redis server
    await client.connect();
})();


console.log("Attempting to connect to redis");
console.log(redisHost);
client.on('connect', () => {
    console.log('Connected!');
});

// Log any error that may occur to the console
client.on("error", (err) => {
    // console.log(`Error:${err}`);
});

module.exports = client;