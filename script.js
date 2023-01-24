//Declared variables
var start = document.querySelector('#start');
var clear = document.querySelector('#clear');
var enter = document.querySelector('#enter');
var api = 'http://api.mathjs.org/v4/?expr=';
const input = document.getElementById('inputField')

//Variables for timer
var timeLeft = 91;
var timeIndex = 0;
var timePenalty = 5;
var timer = document.querySelector('#timer');

//Initializes timer
start.addEventListener('click', function () {
    if (timeIndex === 0) {
        timeIndex = setInterval(function () {
            timeLeft--;
            timer.textContent = timeLeft + ' Seconds Left';
            if (timeLeft <= 0) {
                clearInterval(timeIndex);
                timer.textContent = 'OUT OF TIME!';
                finished();
            }
        }, 1000);
    }
    var x = document.getElementById("toggle");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
    question();
});

//Input values from num buttons
function inputVal(x) {
    input.value += x;
}

//Clear button for input field
clear.addEventListener('click', function () {
    input.value = '';
})

//Fetch api data
enter.addEventListener('click', function () {
    getNum();
});

async function getNum() {
    let response = await fetch(api + a + encodeURIComponent(operator) + b);
    let data = await response.text();
    console.log(data);
    displayAnswer(data);
    question();
}

//Variables for answer check
var score = 0;
var totalScore = document.querySelector('#score');
var comment = document.querySelector('#comment');

//Function to check user answer with api data
function displayAnswer(data) {
    const correctAnswer = data;
    if (input.value == correctAnswer) {
        console.log('true');
        comment.textContent = 'Nice!';
        score += 1;
        totalScore.textContent = 'Score: ' + score;
    }
    else {
        console.log('false');
        comment.textContent = 'Wrong. ' + a + ' ' + operator + ' ' + b + ' is ' + correctAnswer + '.';
        timeLeft = timeLeft - timePenalty;
    }
    input.value = '';
}

//Variables for question function
var a, b;
var operator;
const operations = {
    '+': ['+'],
    '-': ['-'],
    '*': ['*'],
    '/': ['/']
}
const operationType = Object.keys(operations);

//Function to generate questions
var wholeNum = [0,1,2,3,4,5,6,7,8,9,10,11,12];
function question() {
    a = Math.ceil(Math.random() * 12); //generates first random integer
    b = Math.ceil(Math.random() * 12); //generates second random integer  //need to account for negatives
    operator = operationType[Math.floor(Math.random() * operationType.length)]; //generates random operator from array
    if(a % b === 0) {
        document.getElementById('questions').textContent = a + ' ' + operator + ' ' + b;
    } else {
        question();
    }
    
    //This is to make sure the answer won't be a negative number
    // if(operator == '+') {
    //     document.getElementById('questions').textContent = a + ' ' + operator + ' ' + b;
    // } else if(a >= b && operator == '-') {
    //     document.getElementById('questions').textContent = a + ' ' + operator + ' ' + b;
    // } else if(operator == '*') {
    //     document.getElementById('questions').textContent = a + ' ' + operator + ' ' + b;
    // } else if(a >= b && operator == '/' && wholeNum.includes(c)) {
    //     document.getElementById('questions').textContent = a + ' ' + operator + ' ' + b;
    // }
    // else {
    //     question();
    // }
    // if(a >= b && operator == '/' && wholeNum.includes(c)) {
    //      document.getElementById('questions').textContent = a + ' ' + operator + ' ' + b;
    // } else {
    //     question();
    // }
}

//Function for finish page
function finished() {
    var questions = document.querySelector('#questions');
    questions.innerHTML = '';
    timer.innerHTML = '';
    comment.innerHTML = '';
    totalScore.innerHTML = '';
    document.getElementById('toggle').style.display = 'none';
    //Header finish
    var head = document.createElement('h1');
    head.textContent = 'FINISH!'
    questions.appendChild(head);
    //Paragraph for score 
    var para = document.createElement('p');
    questions.appendChild(para);
    para.textContent = 'Your score is ' + score + '!';
    //Input form for name 
    var label = document.createElement('label');
    label.textContent = 'Please enter your name ';
    questions.appendChild(label);
    var newName = document.createElement('input');
    newName.textContent = '';
    questions.appendChild(newName);
    var sub = document.createElement('button');
    sub.setAttribute('id', 'submit');
    sub.textContent = 'Submit';
    questions.appendChild(sub);
    //Adding new name to local storage
    sub.addEventListener('click', function () {
        var username = newName.value;
        //Alert user if name is left blank
        if (username.length <= 0) {
            window.alert('Please enter your name!');
            return false;
        }
        //Puts names in array
        else {
            var userScore = {
                username: username.toUpperCase(),
                score: score
            }
            //Retrieve highscores
            var savedScore = localStorage.getItem('savedScore');
            //Clears array if there are no local highscores
            if (savedScore === null) {
                savedScore = [];
            //Score as object
            } else {
                savedScore = JSON.parse(savedScore);
            }
            savedScore.push(userScore);
            //Sets score into string
            var newScore = JSON.stringify(savedScore);
            localStorage.setItem('savedScore', newScore);
            //Retrieve local storage
            var savedScore = localStorage.getItem('savedScore');
            savedScore = JSON.parse(savedScore);
            document.querySelector('#questions').style.display = 'none';
            //Lists scores
            if (savedScore !== null) {
                for (var i = 0; i < savedScore.length; i++) {
                    var newLi = document.createElement('li');
                    newLi.textContent = savedScore[i].username + ' // ' + savedScore[i].score + ' points';
                    highScoreList.appendChild(newLi);                   
                }
            }
            //Clears scores if more than 10 entries
            if (savedScore.length > 10) {
                window.alert('Memory Overload! Clearing Highscores...');
                localStorage.clear();
                location.reload();
            }
            return show('container2', 'container');
        }
    });
}

//Variables for leaderboard
var highscores = document.querySelector('#leaderboard');
var clearHS = document.querySelector('#clearHS');
var back = document.querySelector('#back');

//Toggle for leaderboard display
function show(shown, hidden) {
    document.getElementById(shown).style.display = 'block';
    document.getElementById(hidden).style.display = 'none';
    return false;
}

//Clear leaderboard
clearHS.addEventListener('click', function () {
    localStorage.clear();
    location.reload();
});

//Return to main page
back.addEventListener('click', function () {
    window.location.replace('./index.html');
});








