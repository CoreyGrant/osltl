
const {logDebug, logProd} = require('../logger');

module.exports = { 
    logout(req, res){
        logProd("Logging out for user id " + req.session.userId);
        req.session.userId = undefined;
        res.status(200).send();
    }
}