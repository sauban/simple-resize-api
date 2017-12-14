module.exports = {
    jwtSecretKey: process.env.JWT_SECRET || '21822343-1233-ABEE-3133-A9318493EEFD',
    tokenExpiry: process.env.EXPIRY || '366d'
};