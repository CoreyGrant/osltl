const { userDb } = require("../database/userDb");
const {logDebug} = require('../logger');

module.exports = {
    register(req, res){
        console.log(req.body);
        const {emailAddress, password} = req.body;
        userDb.createUser(emailAddress, password).then(x => {
            res.status(200).send({result: x});
        }).catch(x => res.status(401).send({result: false}));
    }
}