export class UserEntity{
    id;
    emailAddress;
    passwordHash;
    salt;
    fpwExp;
    fpwToken;
    dataJson; // possibly split out based on performance
}