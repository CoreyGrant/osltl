const userEntityTable = "user";
const userDetailsEntityTable = "userDetails"

class UserEntity{
    id;
    emailAddress;
    passwordHash;
    salt;
    fpwExp;
    fpwToken;
    userDetailsId;
}

class UserDetailsEntity{
    personalTasks;
    currentUser;
    filters;
    simple;
    darkMode;
}

module.exports = { 
    userEntityTable,
    userDetailsEntityTable,
    UserEntity,
    UserDetailsEntity
}