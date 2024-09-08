const RedisStore = require("connect-redis");
const {createClient} = require("redis")
const redisUrl = process.env["osltl_redis_connectionstring"]


// Initialize client.
let redisClient = createClient({
    url: redisUrl
})
redisClient.connect().catch(console.error)

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "osltl:"
})

export default redisStore;