const users = require('./account');
const shops = require('./shop');
const orders = require('./order');

module.exports = app => {
    app.use('/account', users.router);
    app.use('/shops', shops.router);
    app.use("/order", orders);
}