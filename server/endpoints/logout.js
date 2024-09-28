
const {logDebug, logProd} = require('../logger');

module.exports = { 
    logout(req, res){
        logProd("Logging out for user id " + req.session.cookie.userId);
        req.session.cookie.userId = undefined;
        res.status(200).send();
    }
}