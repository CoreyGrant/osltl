export class UserDb{
    pepper;
    constructor(){
        this.pepper = process.env.pepper || 'osltlpepper';
    }
    
    hashPassword(password, salt){
        var thingToBeHashed = salt + password + this.pepper;
        var hashed = '';
        return hashed;
    }
}