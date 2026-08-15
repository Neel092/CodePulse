import Redis from "ioredis"

const redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
});

async function connectRedis() {

    try {

        await redis.connect();
        console.log("Redis connected");

    } catch (error) {
        console.log(error);
    }
}

async function getCache(key) {

    const data = await redis.get(key);

    if (!data)
        return null;

    return JSON.parse(data);

}

async function setCache(key, value, ttl = 1800) {
    await redis.set(
        key,
        JSON.stringify(value),
        "EX",
        ttl
    );
}

async function deleteCache(key) {
    await redis.del(key);
}

async function acquireLock(username) {
    const key = `lock:sync:${username}`;

    const result = await redis.set(
        key,
        "locked",
        "NX",
        "EX",
        60
    );

    return result === "OK";
}

async function releaseLock(username) {
    const key = `lock:sync:${username}`;

    await redis.del(key);
}

export {
    connectRedis,
    getCache,
    setCache,
    deleteCache,
    acquireLock,
    releaseLock
};
