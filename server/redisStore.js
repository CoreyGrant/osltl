const {default: RedisStore} = require("connect-redis");
const {createClient} = require("redis")
const redisUrl = process.env["osltl_redis_connectionstring"]
const redisUsername = process.env["osltl_redis_username"]
const redisPassword = process.env["osltl_redis_password"]
const redisPort = process.env["osltl_redis_port"]
// Initialize client.
console.log("redis")
console.log(redisUsername)
console.log(redisUrl)
console.log(redisPassword)
console.log(redisPort);
let redisClient = createClient(redisPort, redisUrl, {
    host: redisUrl,
    port: redisPort,
    password: redisPassword
})
redisClient.connect().catch(console.error)

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "osltl:"
})

module.exports = redisStore;