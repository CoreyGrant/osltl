const {default: RedisStore} = require("connect-redis");
const {createClient} = require("redis")
const redisUrl = process.env["osltl_redis_connectionstring"]
const redisUsername = process.env["osltl_redis_username"]
const redisPassword = process.env["osltl_redis_password"]
const redisPort = process.env["osltl_redis_port"] || 6379;

// console.log("redis")
// console.log(redisUsername)
// console.log(redisUrl)
// console.log(redisPassword)
// console.log(redisPort);
const url = `rediss://${redisUsername}:${redisPassword}@${redisUrl}:${redisPort}`;
console.log(url);
let redisClient = createClient({
    url: url
});
redisClient.on('error', (err) => console.error(err));
redisClient.connect().catch(console.error)
// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "osltl:",
  serializer: {
    parse(val){
      console.log("parsing", val);
      return JSON.parse(val);
    },
    stringify(val){
      console.log("stringifying", val);
      return JSON.stringify(val);
    }
  }
})

module.exports = redisStore;