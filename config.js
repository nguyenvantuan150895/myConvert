module.exports = {
    REDIS_URI: process.env.REDIS_URI || "redis://localhost:6379",
    DOC_PATH: process.env.DOC_PATH || "/tmp",
    CONCURRENT_JOB: parseInt(process.env.CONCURRENT_JOB || "6"),
    USING_RSVG_PNG: process.env.USING_RSVG_PNG || true
}