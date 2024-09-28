const {userDb} = require("../database/userDb");
const {logDebug, logProd} = require('../logger');

module.exports = { 
    getUserDetails(req, res){
        logProd("Getting user details", req.session);
        if(!req.session.userId){
            logProd("No user id")
            res.status(500).send({}); 
            return;
        }
        logProd("User id: " + req.session.userId);
        userDb.getUserDetails(req.session.userId)
            .then(x => {
                res.status(200).send(x);
            });
    }
}