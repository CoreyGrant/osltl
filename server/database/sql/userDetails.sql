CREATE TABLE userDetails(
    id MEDIUMINT NOT NULL AUTO_INCREMENT,
    userId MEDIUMINT NOT NULL,
    personalTasks VARCHAR(8000),
    currentUser VARCHAR(12),
    filters VARCHAR(500),
    simple BIT,
    darkMode BIT,
    PRIMARY KEY (id),
    FOREIGN KEY (userId)
    REFERENCES user(id)
)