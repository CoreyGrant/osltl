const { userDb } = require("../database/userDb");
const {passwordHelper} = require('../../shared/password');
const {logDebug, logProd} = require('../logger');

module.exports = {
    register(req, res){
        const {emailAddress, password} = req.body;
        // validate password
        if(!password || !password.length){
            res.status(401).send();
            return;
        }
        const passwordErrors = passwordHelper.validate(password);
        if(passwordErrors.length){
            res.status(401).send();
            return;
        }
        userDb.createUser(emailAddress.toLowerCase(), password).then(x => {
            res.status(200).send({result: x});
        }).catch(x => res.status(401).send({result: false}));
    }
}