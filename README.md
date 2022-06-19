#Basic Users System
Another application that you can do for training is a Basic User System. It’s a basic project, but it will help you to practice very useful skills because the user is a part of almost every application. 

In this example, you will learn:  - how to set up the database and do migrations,  - how to create a new user by the registration,  - how to build login endpoint,  - how to authenticate user,  - how to get the user’s data.

In the case of registration and login, you should generate a JWT token for the user that will be returned from the API.

Besides that, remember to hash the password before you save it in the database.

If you’d like to look at how I was doing user registration, login, and authentication in our NodeJS Course.

#Config 
Holds all the server configurations.

#Routes
Here you define all your routes for your api. It doesn't matter how you structure them. By default they are mapped on privateRoutes and publicRoutes. You can define as much routes files as you want e.g. for every model or for specific use cases, e.g. normal user and admins.


#Controller
Note: those request are asynchronous, we use async await syntax.
Note: As we don't use import statements inside the api we also use the require syntax for tests
To test a Controller we create fake requests to our api routes.
Example GET /user from last example with prefix prefix:

#models
Are usually automatically tested in the integration tests as the Controller uses the Models, but you can test them separatly.