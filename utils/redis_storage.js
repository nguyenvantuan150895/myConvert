const debug = require('debug')('storage::redis')
const redis = require("redis");
const { promisify } = require('util');

function buildRedisAsync(client) {
    return {
        del: promisify(client.del).bind(client),
        hmset: promisify(client.hmset).bind(client),
        hmget: promisify(client.hmget).bind(client),
    }
}

class RedisStorage {
    constructor(redis_url = 'redis://localhost:6379') {
        debug("Init RedisStorage with %s", redis_url);
        this.redis_url = redis_url;
    }

    connect() {
        debug("Connect RedisStorage");
        return new Promise((resolve, reject) => {
            this.client = redis.createClient({url: this.redis_url});
            this.clientAsync = buildRedisAsync(this.client);

            this.client.on("error", function (err) {
                debug("Connect RedisStorage error: %s", err.toString());
                reject(err);
            });

            this.client.on("connect", function () {
                debug("Connect RedisStorage Success");
                resolve();
            });
        });
    }

    async delete(key) {
        debug("Delete %s", key);
        await this.clientAsync.del(key);
    }

    async set(key, value) {
        let args = [];
        Object.keys(value).map((_key) => {
            if(typeof _key != undefined && typeof value[_key] != undefined) {
                args.push(_key);
                args.push(value[_key]);
            }
        });
        debug("Set %s %o", key, args);
        await this.clientAsync.hmset(key, args);
    }

    async get(key, fields) {
        let res = await this.clientAsync.hmget(key, fields);
        debug("Get %s %o", key, res);
        return res;
    }
}

module.exports = RedisStorage;