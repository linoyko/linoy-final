const constants = {
  operatorMap: {
    0: '+',
    1: '-',
    2: '*',
  }
};

var loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));


/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random operator:
 * 0: +
 * 1: -
 * 2: *
 * 3: /
 */
function getRandomOperator() {
  let min = Math.min(...Object.keys(constants.operatorMap));
  let max = Math.max(...Object.keys(constants.operatorMap));

  let rand = getRandomInt(min, max);

  return constants.operatorMap[rand];
}

function addInnerHTMLById(id, text) {
  document.getElementById(id).innerHTML += text;
}

function getRandomEquation(level) {
  let min = 0, max;
  if(level == "1"){
    max = 9;
  }
  else if(level == "2"){
    max = 99;
  }
  else if(level == "3"){
    max = 999;
  }

  return [(getRandomInt(min, max)).toString(), getRandomOperator(), (getRandomInt(min, max)).toString()].join(" ");
}

function resetEquation(){
  // reset input
  document.getElementById("user-result-input").value = 0;
  
  let levelFormEl = document.getElementById("user-data-form").elements;
  let level = levelFormEl['level'].value;
  let randomEquation = getRandomEquation(level);
  document.getElementById("equation-label").innerHTML = randomEquation;
  return;
}

function onHomeLoad() {
  if (loggedInUser) {

    // Set user history score
    document.getElementById("username-label").innerHTML = loggedInUser.username;
    document.getElementById("level-1-score").innerHTML = loggedInUser.history["1"];
    document.getElementById("level-2-score").innerHTML = loggedInUser.history["2"];
    document.getElementById("level-3-score").innerHTML = loggedInUser.history["3"];

    document.getElementById(`level${loggedInUser.level}-rb`).checked = true;
    document.getElementById(`color-${loggedInUser.color}-rb`).checked = true;

    // Get the modal
    var modal = document.getElementById("game-modal");

    // Get the button that opens the modal
    var btnStop = document.getElementById("stop-game-btn");

    // When the user clicks on <span> (x), close the modal
    btnStop.onclick = function () {
      modal.style.display = "none";
      window.location.reload();
    }
  }
  else {
    window.location.replace('../index.html');
  }
}

function startGame(){
    resetEquation();
    var modal = document.getElementById("game-modal");
    modal.style.display = "block";
}

function onIndexLoad() {
  if (loggedInUser) {
    window.location.replace('pages/home.html');
  }
}