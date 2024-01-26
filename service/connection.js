const initOptions = {
    // global event notification;
    error(error, e) {
        if (e.cn) {
            // A connection-related error;
            //
            // Connections are reported back with the password hashed,
            // for safe errors logging, without exposing passwords.
            console.log('CN:', e.cn);
            console.log('EVENT:', error.message || error);
        }
    }
};

const Client = require('pg-promise')(initOptions);

const client = Client({
    user: "postgres",
    password: "1q2w3e",
    host: "localhost",
    port: 5432,
    database: "postgres"
})

module.exports = client;