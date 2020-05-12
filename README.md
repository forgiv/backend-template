# Backend Template

This template is written in [TypeScipt](https://www.typescriptlang.org/)

Included Packages:
 - [CORS](https://github.com/expressjs/cors): CORS middleware
 - [dotenv](https://github.com/motdotla/dotenv): Processing .env files
 - [ExpressJS](https://expressjs.com/): Server framework
 - [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken): JWT signing/verifying
 - [MIKRO-ORM](https://github.com/mikro-orm/mikro-orm): Mongo ORM
 - [MongoDB](http://mongodb.github.io/node-mongodb-native/): Database driver
 - [Morgan](https://github.com/expressjs/morgan): Logging middleware
 - [PassportJS](http://www.passportjs.org/): Auth layer

Required environment variables:  
 * JWT_SECRET

Optional environment variables:
 * PORT  
 * MONGODB_NAME  
 * JWT_EXPIRY  
 * MONGODB_URI
 * NODE_ENV = [development, test, production]
 * CLIENT_ORIGIN - Only needed if setting up CORS
 
