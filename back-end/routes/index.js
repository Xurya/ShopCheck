const users = require('./account');

module.exports = app => {
    app.use('/account', users)
}