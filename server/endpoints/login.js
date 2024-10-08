const { userDb } = require("../database/userDb");
const {logDebug, logProd} = require('../logger');

module.exports = { 
    login(req, res){
        // send credentials off to be verified, get back the user
        // store the id in session
        const {emailAddress, password} = req.body;
        logProd("Logging in for " + emailAddress);
        userDb.tryLogin(emailAddress.toLowerCase(), password).then(userId => {
            if(userId){
                logProd("Login succeeded with user id " + userId);
                req.session.userId = userId;
                res.status(200).send({
                    result: true,
                    userId
                });
            } else {
                logProd("Login failed");
                res.status(500).send({result: false});
            }
        });
        
    }
}