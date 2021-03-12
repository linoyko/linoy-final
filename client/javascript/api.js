
/**
 * Constants
 */

 const serverURL = 'http://localhost:8001';

var loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
var users;

/**
 * Get logged-in user
 */
function getUsers() {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      localStorage['users'] = this.responseText;
      users = JSON.parse(localStorage.getItem('users'));
      document.getElementById("users-ul").appendChild(makeUL(users));
    }
  };
  xhttp.open("GET", `${serverURL}/users`, true);
  xhttp.send();
}

/**
 * Get logged-in user
 */
function logout() {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if(this.status === 200){
        loggedInUser = null;
        localStorage.removeItem('loggedInUser');
        window.location.replace('../index.html');
      }
      else{
        alert(`Error on login: ${this.responseText}`)
      }
    }
  };

  xhttp.open("GET", `${serverURL}/users`, true);
  xhttp.send();
}

/**
 * Get logged-in user
 */
function login() {
  let username = document.getElementById('username').value;
  let password = document.getElementById('password').value;
  let user = {
    username,
    password
  }
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if(this.status === 200){
        localStorage['loggedInUser'] = this.responseText;
        window.location.replace('pages/home.html');
      }
      else{
        alert(`Error on login: ${this.responseText}`)
      }
    }
  };

  xhttp.open("POST", `${serverURL}/login`, true);
  
  // set `Content-Type` header
  xhttp.setRequestHeader('Content-Type', 'application/json');

  // send rquest with JSON payload
  xhttp.send(JSON.stringify(user));
}

function signUp() {
  let username = document.getElementById('username').value;
  let password = document.getElementById('password').value;
  let user = {
    username,
    password
  }
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if(this.status === 200){
        alert("Signed-up successfully!")
        localStorage['loggedInUser'] = this.responseText;
        window.location.replace('home.html');
      }
      else{
        alert(`Error on sign-up: ${this.responseText}`)
      }
    }
  };

  xhttp.open("POST", `${serverURL}/sign-up`, true);
  
  // set `Content-Type` header
  xhttp.setRequestHeader('Content-Type', 'application/json');

  // send rquest with JSON payload
  xhttp.send(JSON.stringify(user));
}

function getUserData(){
  let levelFormEl = document.getElementById("user-data-form").elements;
  let level = levelFormEl['level'].value;
  let color = levelFormEl['color'].value;

  return {
    user: loggedInUser,
    color,
    level
  }
}

function updateUserScore() {
  let data = {
    equation: document.getElementById('equation-label').innerText,
    result: document.getElementById('user-result-input').value,
    ...getUserData()
  }
  
  const xhttp = new XMLHttpRequest();
  
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if(this.status === 200){
        alert("Correct :)");

      }
      else{
        alert(`Worng :(`);
      }
      localStorage['loggedInUser'] = this.responseText;
      loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
      resetEquation();
    }
  };

  xhttp.open("POST", `${serverURL}/update-user-score`, true);
  
  // set `Content-Type` header
  xhttp.setRequestHeader('Content-Type', 'application/json');

  // send rquest with JSON payload
  xhttp.send(JSON.stringify(data));
}

function updateUserData() {
  let data = {
    ...getUserData()
  }
  
  const xhttp = new XMLHttpRequest();
  
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if(this.status === 200){
        alert("Updated :)");
      }
      else{
        alert(`Error on update: ${this.responseText}`);
      }
      localStorage['loggedInUser'] = this.responseText;
      loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    }
  };

  xhttp.open("POST", `${serverURL}/update-user-data`, true);
  
  // set `Content-Type` header
  xhttp.setRequestHeader('Content-Type', 'application/json');

  // send rquest with JSON payload
  xhttp.send(JSON.stringify(data));
}

function makeUL(array, label) {
  // Create the list element:
  var list = document.createElement('ul');
  for (var i = 0; i < array.length; i++) {

    let history = array[i].history;

    // Create the list item:
    var item = document.createElement('li');
    item.appendChild(document.createTextNode(`${array[i].username}`));

    Object.keys(history).map(i => {
      var nested = document.createElement('ul');
      var subitem = document.createElement('li');
      subitem.appendChild(document.createTextNode(`Level: ${i}, Score: ${history[i]}`));
      nested.appendChild(subitem);
      item.appendChild(nested);
    });

      // Add it to the list:
      list.appendChild(item);
  }

  // Finally, return the constructed list:
  return list;
}