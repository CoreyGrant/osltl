const connection =  require('./connection');
const bcrypt = require('bcrypt');

class UserDb{
    pepper;
    constructor(){
        this.pepper = process.env.pepper || 'osltlpepper';
    }
    async setUserDetails(details, userId){
        try{
            await connection.execute(
                'UPDATE userDetails SET personalTasks = ?, currentUser = ?, filters = ?, simple = ?, darkMode = ? where userId = ?',
                [
                    details.personalTasks,
                    details.currentUser, 
                    details.filters, 
                    +details.simple, 
                    +details.darkMode, 
                    userId
                ]
            );
        } catch{

        }
    }
    async getUserDetails(userId){
        try{
            const [rows, fields] = await connection.execute(
                'SELECT * FROM userDetails where userId = ?', [userId]
            );
            var row = rows[0];
            return {
                personalTasks: JSON.parse(row["personalTasks"] || {}),
                currentUser: row["currentUser"],
                filters: JSON.parse(row["filters"] || {"order":{},"skills":[],"areas":[],"difficulty":[]}),
                simple: !!row["simple"][0],
                darkMode: !!row["darkMode"][0]
            };
        } catch{

        }
    }
    async createUser(email, password){
        const [emailUniqueRows] = await connection.execute(
            'SELECT 1 FROM user where emailAddress = ?',
            [email]
        );
        if(emailUniqueRows[0]){
            return false;
        }
        var [hashedPassword, salt] = await this.hashPassword(password);
        const result = await connection.execute(
            'INSERT INTO user (emailAddress, passwordHash, salt) VALUES (?,?,?)',
            [email, hashedPassword, salt]
        );
        const udResult = await connection.execute(
            'INSERT INTO userDetails(userId) VALUES (?)',
            [result[0].insertId]
        )
        return true;
    }
    async tryLogin(email, password){
        // get the salt and hashed password
        // try to hash supplied password with salt, compare with hash
        const [rows, fields] = await connection.execute(
            'SELECT * FROM user WHERE emailAddress = ?', [email]
        );
        const row = rows[0];
        if(!row){return 0;}
        const passwordHash = row["passwordHash"];
        const salt = row["salt"];
        const userId = row["id"];
        const [hashedPassword] = await this.hashPassword(password, salt);
        //console.log("oldHash", passwordHash, "newHash", hashedPassword);
        if(passwordHash === hashedPassword){
            //console.log("password matched");
            return userId;
        } else {
            //console.log("password didnt match");
            return 0;
        }
    }
    getSalt(){
        return "";
    }
    async hashPassword(password, salt){
        salt = salt || await bcrypt.genSalt();
        var thingToBeHashed = password + this.pepper;
        var hashed = await bcrypt.hash(thingToBeHashed, salt);
        return [hashed, salt];
    }
}

const userDb = new UserDb();

module.exports = { 
    UserDb,
    userDb
}