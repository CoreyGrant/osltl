const {logDebug, logProd} = require('../logger');

module.exports = {
    loggedIn(req, res){
        logProd("Checking if logged in");
        if(req.session && req.session.userId){
            logProd("User id: " + req.session.userId);
            res.status(200).send({result: true});
        } else {
            logProd("Not logged in");
            res.status(200).send({result: false});
        }
    }
}