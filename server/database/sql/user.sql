CREATE TABLE user(
    id MEDIUMINT NOT NULL AUTO_INCREMENT,
    emailAddress VARCHAR(100),
    passwordHash VARCHAR(60) NOT NULL,
    salt VARCHAR(30) NOT NULL,
    fpwExp DATE,
    fpwToken VARCHAR(24),
    PRIMARY KEY(id)
)