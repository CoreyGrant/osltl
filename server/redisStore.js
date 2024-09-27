const {default: RedisStore} = require("connect-redis");
const {createClient} = require("redis")
const redisUrl = process.env["osltl_redis_connectionstring"]
const redisUsername = process.env["osltl_redis_username"]
const redisPassword = process.env["osltl_redis_password"]
const redisPort = process.env["osltl_redis_port"] || 6379;
// Initialize client.
console.log("redis")
console.log(redisUsername)
console.log(redisUrl)
console.log(redisPassword)
console.log(redisPort);
const url = `redis://${redisUsername}:${redisPassword}@${redisUrl}:${redisPort}`;
console.log(url);
let redisClient = createClient({
    url: url
});
redisClient.connect().catch(console.error)

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "osltl:"
})

module.exports = redisStore;