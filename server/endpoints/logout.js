
const {logDebug} = require('../logger');

module.exports = { 
    logout(req, res){
        req.session.userId = undefined;
        res.status(200).send();
    }
}