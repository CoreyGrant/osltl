const {userDb} = require("../database/userDb");
const {logDebug} = require('../logger');

module.exports = { 
    getUserDetails(req, res){
        if(!req.session.userId){res.status(500).send({}); return;}
        userDb.getUserDetails(req.session.userId)
            .then(x => {
                //console.log("getting user details", x);
                res.status(200).send(x);
            });
    }
}