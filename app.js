'use strict';
/* global $ */



// API Data Retrieval 
// ===============

/*Steps:
//Main Goal: Use a public API to fetch questions and have our app us that data set instead of our static data set.
          -questionList
          Mainly insterting the steps of fetching the data and decorating the data.
          -Grabbing current question, doing decoraiton piece, then render as normal
          -At this point, a refresh of the browser = new user for application, a restart is not a new session
          and we do retain that session token between quizzes.
          -Sequence id at beginning of application? , Need to do certain things in the callbacks before user

//Main Steps
1. Correctly fetch the default data - 10 questions randomized.
2. Insert that array of objects into the current system - where questionList is 
rendered, we render this query instead.
3. Once that works, build out each requirement:
  4. User should be asked a number of questions for quiz sessions before beginning
    -Add a button click listener in a form.
    -It's input type 'number', with a min of '1' and a max of '50', a value of '10'
    as default.  We capture that value and change the amount key value pair in query
  5. User should not receieve a duplicate question durin their entire session.
    -Confirm the session token we plugged in works as a key value pair in query.
  6. User can select a single category of questions
    -Click listener -> Grab ID Value -> insert into query -> decorate and generate
    query based on that ID.
    */

//Set URL Components 



const BASE_URL = 'https://opentdb.com/api.php?amount=10';
const MAIN_PATH = '/api_token.php?command=request';
const TOKEN_PATH = '/api.php';

$.getJSON('https://opentdb.com/api.php?amount=10', response => {
  console.log(response);
});

// Build the endpoint URL
// function buildBaseUrl() {}
// function buildTokenUrl() {}

// Fetch data
// function fetchToken() {}

// Fetch Question Data from API
function fetchQuestionDataFromApi(callback) {
  const query = {
    amount: 30,
  };
  $.getJSON(BASE_URL, query, callback);
}

//Test callback function fetchQuestionsData
fetchQuestionDataFromApi(decorateData);


let questionList = [];
// Set questions array equal to our retrieved data
function decorateData(data) {
  console.log('data is ', data);
  questionList = data.results;
  // console.log(results);
  console.log(questionList);
  // questionList.correct_answer = 
  console.log(questionList[0]);


}
// text: 'Capital of England?',
// answers: ['London', 'Paris', 'Rome', 'Washington DC'],
// correctAnswer: 'London'

console.log(questionList);

// console.log(QUESTIONS);
//Decorate questions array to represent our static array of objects with our key/value pairs (QUESTION)


//URL Builder section



// Grab data -> decorate data -> store as an array of objects -> 

// let QUESTIONS = [






// function displayQuestionData(data) {
//   console.log(data);
//   // const results = data.items.map((item, index) => renderResult(item));
//   // $('.js-search-results').html(results);
// }

// function decorateQuestion(response) {}

// // Add question to store
// function addQuestion() {}

// const fetchSessionToken = () {};

// const decorateQuestion = function(question) {
//   return {
//     text: question.question
//     answers: 
//   }
// }

//Use math
const TOP_LEVEL_COMPONENTS = [
  'js-intro', 'js-question', 'js-question-feedback', 'js-outro', 'js-quiz-status'
];

let QUESTIONS = [
  {
    text: 'Capital of England?',
    answers: ['London', 'Paris', 'Rome', 'Washington DC'],
    correctAnswer: 'London'
  },
  {
    text: 'How many kilometers in one mile?',
    answers: ['0.6', '1.2', '1.6', '1.8'],
    correctAnswer: '1.6'
  }
];

const getInitialStore = function() {
  return {
    page: 'intro',
    currentQuestionIndex: null,
    userAnswers: [],
    feedback: null
  };
};

let store = getInitialStore();

// Helper functions
// ===============
const hideAll = function() {
  TOP_LEVEL_COMPONENTS.forEach(component => $(`.${component}`).hide());
};

//Compare user answer to correct answer
const getScore = function() {
  return store.userAnswers.reduce((accumulator, userAnswer, index) => {
    const question = getQuestion(index);

    if (question.correctAnswer === userAnswer) {
      return accumulator + 1;
    } else {
      return accumulator;
    }
  }, 0);
};

//Returns object with the current question were on and total number of questions.
//total questions needs to change to the array of objects.
const getProgress = function() {
  return {
    current: store.currentQuestionIndex + 1,
    total: QUESTIONS.length
  };
};

const getCurrentQuestion = function() {
  return QUESTIONS[store.currentQuestionIndex];
};

const getQuestion = function(index) {
  return QUESTIONS[index];
};

// HTML generator functions
// ========================
const generateAnswerItemHtml = function(answer) {
  return `
    <li class="answer-item">
      <input type="radio" name="answers" value="${answer}" />
      <span class="answer-text">${answer}</span>
    </li>
  `;
};


//Grab all the answers out of the questions
const generateQuestionHtml = function(question) {
  const answers = question.answers
    .map((answer, index) => generateAnswerItemHtml(answer, index))
    .join('');

  return `
    <form>
      <fieldset>
        <legend class="question-text">${question.text}</legend>
          ${answers}
          <button type="submit">Submit</button>
      </fieldset>
    </form>
  `;
};

const generateFeedbackHtml = function(feedback) {
  return `
    <p>${feedback}</p>
    <button class="continue js-continue">Continue</button>
  `;
};

// Render function - uses `store` object to construct entire page every time it's run
// ===============
const render = function() {
  let html;
  hideAll(); //Hide all views first, then show what we need.

  const question = getCurrentQuestion();
  const { feedback } = store;
  const { current, total } = getProgress();

  $('.js-score').html(`<span>Score: ${getScore()}</span>`);
  $('.js-progress').html(`<span>Question ${current} of ${total}`);

  switch (store.page) {
  case 'intro':
    $('.js-intro').show();
    break;

  case 'question':
    html = generateQuestionHtml(question);
    $('.js-question').html(html);
    $('.js-question').show();
    $('.quiz-status').show();
    break;

  case 'answer':
    html = generateFeedbackHtml(feedback);
    $('.js-question-feedback').html(html);
    $('.js-question-feedback').show();
    $('.quiz-status').show();
    break;

  case 'outro':
    $('.js-outro').show();
    $('.quiz-status').show();
    break;

  default:
    return;
  }
};

// Event handler functions
// =======================
const handleStartQuiz = function() {
  store = getInitialStore();
  store.page = 'question';
  store.currentQuestionIndex = 0;
  render();
  console.log(myArray);  
};

const handleSubmitAnswer = function(e) {
  e.preventDefault();
  const question = getCurrentQuestion();
  const selected = $('input:checked').val();
  store.userAnswers.push(selected);

  if (selected === question.correctAnswer) {
    store.feedback = 'You got it!';
  } else {
    store.feedback = `Too bad! The correct answer was: ${question.correctAnswer}`;
  }

  store.page = 'answer';
  render();
};

const handleNextQuestion = function() {
  if (store.currentQuestionIndex === QUESTIONS.length - 1) {
    store.page = 'outro';
    render();
    return;
  }

  store.currentQuestionIndex++;
  store.page = 'question';
  render();
};

// On DOM Ready, run render() and add event listeners
$(() => {
  render();

  $('.js-intro, .js-outro').on('click', '.js-start', handleStartQuiz);
  $('.js-question').on('submit', handleSubmitAnswer);
  $('.js-question-feedback').on('click', '.js-continue', handleNextQuestion);
});
