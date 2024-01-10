API Endpoints
-----------------------------------------------------------------------------------------------------------------
User Registration: POST /api/register
User Login: POST /api/login
Generate Referral Link: POST /api/referral/generate
Expire Referral Link: POST /api/referral/expire
-----------------------------------------------------------------------------------------------------------------

API Technologies and Database Stack
-----------------------------------------------------------------------------------------------------------------
Node.js: The backend server is built using Node.js.

Express.js: Express.js is utilized as the web application framework to streamline the development of robust APIs.

ORM (Object-Relational Mapping):

Mongoose: As the ORM, Mongoose is employed to interact with the MongoDB database..
Database:

MongoDB: The chosen database is MongoDB, a scalable NoSQL solution to store and manage data for the application.
-----------------------------------------------------------------------------------------------------------------

About the functions->
-----------------------------------------------------------------------------------------------------------------
The user controller file encompasses two key functions for user registration (register) and login (login).

The register function securely handles the creation of new user accounts,
employing bcrypt for password hashing and validator for email validation.
Additionally, it rewards referrers with 5000 credits if a valid referral token is provided during registration.

The login function facilitates user authentication, verifying the provided credentials and returning
essential user details upon successful login.

An auxiliary function, checkIfValidToken, validates referral tokens, considering expiration and usage attempts.

The generateToken function in this controller is responsible for creating unique referral tokens for users based on their userId.
It ensures that the userId is provided, generates a unique token using the crypto library, 
and saves the token in the database along with relevant details such as creation time and validity status. 
The function then associates the generated token with the user and responds with a success message along with 
the newly generated token. 

The expireToken function handles the expiration of a specified token by marking it as invalid in the database. 
It verifies the existence of the token, updates its validity status, and responds with a confirmation message. 
-----------------------------------------------------------------------------------------------------------------