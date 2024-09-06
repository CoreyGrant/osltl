const {logDebug} = require('../logger');

module.exports = {
    loggedIn(req, res){
        if(req.session && req.session.userId){
            logDebug("userId", req.session.userId);
            res.status(200).send({result: true});
        } else {
            res.status(200).send({result: false});
        }
    }
}