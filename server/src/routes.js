/**
 * All server routes
 */

module.exports = function (app) {
  const _ = require('lodash');
  const utils = require('./utils');
  const bodyParser = require('body-parser');

  // Constants
  const usersJSONpath = './data/users.json';
  const loggedInUserJSONpath = './data/loggedInUser.json';

  const defaultUser = {
    history: {
      "1": 0,
      "2": 0,
      "3": 0
    },
    level: "1",
    color: "green"
  }


  // create application/json parser - for being able to parse jsons
  var jsonParser = bodyParser.json()

  // create application/x-www-form-urlencoded parser - for being able to parse url-encoded params
  var urlencodedParser = bodyParser.urlencoded({ extended: false })

  // Load the users json
  const users = utils.getJSONfromFile(usersJSONpath);
  const loggedInUser = utils.getJSONfromFile(loggedInUserJSONpath);


  // status
  app.get('/status', function (req, res) {
    res.send('OK');
  });

  // Sign up new user
  app.post('/sign-up', jsonParser, function (req, res) {
    const user = req.body;
    const exists = _.find(users, { username: user.username });

    if (!exists) {
      let newUser = {
        ...user,
        ...defaultUser
      };
      users.push(newUser);
      utils.saveJSONtoFile(usersJSONpath, users);
      res.send(newUser)
    }
    else {
      res.status(400).send('User is already exist!')
    }
  })

  // POST method route
  app.post('/login', jsonParser, function (req, res) {
    const user = req.body;
    const exists = _.find(users, { username: user.username });
    if (!exists) {
      res.status(401).send('Invalid username');
    }
    else if (exists.password === user.password) {
      utils.saveJSONtoFile(loggedInUserJSONpath, exists);
      res.send(exists);
    }
    else {
      res.status(401).send('Invalid password');
    }
  });

  // GET method route
  app.get('/logout', jsonParser, function (req, res) {
    utils.saveJSONtoFile(loggedInUserJSONpath, {});
    res.send('OK');
  });

  // Get all the users
  app.get('/users', jsonParser, function (req, res) {
    res.send(users);
  });
 
  // Get logged-in user
  app.get('/logged-in-user', jsonParser, function (req, res) {
    res.send(loggedInUser);
  });

  // Update user data
  app.post('/update-user-score', jsonParser, function (req, res) {
    const { user, equation, result, level, color } = req.body;

    let correct = eval(eval(equation) == result);

    if(correct){
      user.history[level] += 1
    }
    else{
      user.history[level] -= 1
    }

    user.level = level;
    user.color = color;

    // Find item index using _.findIndex
    const index = _.findIndex(users, { username: user.username });

    if (index < 0) {
      res.status(400);
      res.status(400).send(`Couldn't find user! Are you messing with me?`)
    }

    const newUser = { ...users[index], ...user };
    // Replace item at index using native splice
    users.splice(index, 1, newUser);

    // Saving new user to file
    utils.saveJSONtoFile(usersJSONpath, users);
    
    correct ? res.send(newUser) : res.status(500).send(newUser);
  });
  
  // Update user data
  app.post('/update-user-data', jsonParser, function (req, res) {
    const { user, level, color } = req.body;

    user.level = level;
    user.color = color;

    // Find item index using _.findIndex
    const index = _.findIndex(users, { username: user.username });

    if (index < 0) {
      res.status(400);
      res.status(400).send(`Couldn't find user! Are you messing with me?`)
    }

    const newUser = { ...users[index], ...user };
    // Replace item at index using native splice
    users.splice(index, 1, newUser);

    // Saving new user to file
    utils.saveJSONtoFile(usersJSONpath, users);
    
    res.send(newUser);
  });



}