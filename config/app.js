module.exports = {
    // Server
    PORT: process.env.PORT || 3000,

    // Database
    MONGODB_NAME: process.env.MONGODB_NAME || 'backend',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017',

    // JWT
    JWT_EXPIRY: process.env.JWT_EXPIRY || '7d',
    JWT_SECRET: process.env.JWT_SECRET,

    // Environment
    NODE_ENV: process.env.NODE_ENV || 'development',

    // CORS
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
}