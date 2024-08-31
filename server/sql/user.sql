CREATE TABLE USER(
    Id int PRIMARY KEY,
    EmailAddress varchar(100),
    PasswordHash varchar(24),
    Salt varchar(12),
    FpwExp date,
    FpwToken varchar(30),
    DataJson blob 
)