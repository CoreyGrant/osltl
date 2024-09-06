const { userDb } = require("../database/userDb");
const {logDebug} = require('../logger');

module.exports = { 
    updateUserDetails(req, res){
        if(!req.session.userId){
            res.status(500).send({result: false}); return;
        }
        var body = req.body;
        console.log("updating details", body);
        userDb.setUserDetails(body, req.session.userId)
            .then(() => {
                res.status(200).send({result: true});
            })
    }
}