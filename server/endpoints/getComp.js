const { compDb } = require("../database/compDb");

function getComp(request, response){
    const id = request.query.id;
    compDb.getComp(id).then(x => {
        response.status(200).send(x);
    });
}

module.exports = {
    getComp
};