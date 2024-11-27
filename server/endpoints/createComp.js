const { compDb } = require("../database/compDb");

function createComp(request, response){
    const {tasks, users} = request.body;
    compDb.createComp(users, tasks).then(id => {
        response.status(200).send({id});
    })
}

module.exports = {
    createComp
};