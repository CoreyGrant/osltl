const {userDb} = require("../database/userDb");
const {logDebug, logProd} = require('../logger');

module.exports = { 
    getUserDetails(req, res){
        logProd("Getting user details" + JSON.stringify(req.session));
        if(!req.session.cookie.userId){
            logProd("No user id")
            res.status(500).send({}); 
            return;
        }
        logProd("User id: " + req.session.cookie.userId);
        userDb.getUserDetails(req.session.cookie.userId)
            .then(x => {
                res.status(200).send(x);
            });
    }
}