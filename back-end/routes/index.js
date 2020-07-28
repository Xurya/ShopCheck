const users = require('./account');
const orders = require('./order')

module.exports = app => {
    app.use('/account', users)
    app.use("/order", orders)
}