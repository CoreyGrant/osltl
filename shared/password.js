class PasswordHelper{
    specialCharRegex = /[\.!#@\[\]\(\)\*\&\^%$£=+\-_\\\/{}?]+/
    upperCaseRegex = /[A-Z]+/
    lowerCaseRegex = /[a-z]+/
    numberRegex = /[0-9]+/
    validate(password){
        const errors = [];
        if(password.length < 8){
            errors.push("Password must be at least 8 characters");
        }
        if(!this.specialCharRegex.exec(password)){
            errors.push("Password must contain a special character");
        }
        if(!this.upperCaseRegex.exec(password)){
            errors.push("Password must contain an upper case character");
        }
        if(!this.lowerCaseRegex.exec(password)){
            errors.push("Password must contain a lower case character");
        }
        if(!this.numberRegex.exec(password)){
            errors.push("Password must contain a number");
        }
        return errors;
    }
}

const passwordHelper = new PasswordHelper();

module.exports = {
    PasswordHelper,
    passwordHelper
}