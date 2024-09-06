const { userDb } = require("../database/userDb");
const {logDebug} = require('../logger');

module.exports = { 
    login(req, res){
        // send credentials off to be verified, get back the user
        // store the id in session
        const {emailAddress, password} = req.body;
        userDb.tryLogin(emailAddress, password).then(userId => {
            if(userId){
                req.session.userId = userId;
                res.status(200).send({result: true});
            } else {
                res.status(500).send({result: false});
            }
        });
        
    }
}