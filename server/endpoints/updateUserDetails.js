const { userDb } = require("../database/userDb");
const {logDebug, logProd} = require('../logger');

module.exports = { 
    updateUserDetails(req, res){
        if(!req.session.userId){
            res.status(500).send({result: false}); return;
        }
        logProd("Updating user details for user id " + req.session.userId);
        var body = req.body;
        //console.log("updating details", body);
        userDb.setUserDetails(body, req.session.userId)
            .then(() => {
                res.status(200).send({result: true});
            })
    }
}