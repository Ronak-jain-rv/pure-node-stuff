
// define handlers
const handlers = {};
handlers.ping = (data, callback) => {
    callback(200);
};
handlers.notFound = (data, callback) => {
    callback(404);
};


// defining a default router
const router = {
    ping: handlers.ping
};

module.exports = {
    router,
    handlers
};