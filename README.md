# Steps

- Initialize project
- Install dependencies ( express, jwt, bcrypt, zod...)
- Make skeleton routes
- Create DB schemas and export their models
- For sign up:
    Do input validation using zod,
    Check if the user already exists,
    Hash the password and store all the user data in the DB
- For sign in:
    Do input validation using zod,
    Find a user with the given email,
    Then match its password with the user found using compare method if you have used bcrypt for password hashing