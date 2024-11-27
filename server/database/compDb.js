const uuid = require('uuid')
const connection = require('./connection');

class CompDb{
    async createComp(users, tasks){
        const id = uuid.v4();
        try{
            await connection.execute(
                'INSERT INTO comp (id, tasks, users) VALUES (?, ?, ?)',
                [
                    id,
                    JSON.stringify(tasks),
                    JSON.stringify(users)
                ]
            );
        }catch{

        }
        return id;
    }
    async getComp(id){
        const [rows, fields] = await connection.execute(
            'SELECT * FROM comp where id = ?', [id]
        );
        const row = rows[0];
        return {
            id: row["id"],
            tasks: JSON.parse(row["tasks"]),
            users: JSON.parse(row["users"])
        }
    }
}

module.exports = { compDb: new CompDb()}