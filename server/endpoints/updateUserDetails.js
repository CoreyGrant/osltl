const { userDb } = require("../database/userDb");
const {logDebug, logProd} = require('../logger');

module.exports = { 
    updateUserDetails(req, res){
        if(!req.session.cookie.userId){
            res.status(500).send({result: false}); return;
        }
        logProd("Updating user details for user id " + req.session.cookie.userId);
        var body = req.body;
        //console.log("updating details", body);
        userDb.setUserDetails(body, req.session.cookie.userId)
            .then(() => {
                res.status(200).send({result: true});
            })
    }
}