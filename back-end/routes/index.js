const users = require('./account');
const shops = require('./shop');

module.exports = app => {
    app.use('/account', users.router);
    app.use('/shops', shops.router);
}