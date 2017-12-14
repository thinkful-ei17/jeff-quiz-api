'use strict';
/* global $ */

// API Data Retrieval 
// ===============

/* Main Steps
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

// $.getJSON('https://opentdb.com/api.php?amount=10', response => {
//   console.log(response);
// });

// Build the endpoint URL
// function buildBaseUrl() {}
// function buildTokenUrl() {}
// function fetchToken () {

//URL Builder section

// Fetch Question Data from API
function fetchQuestionDataFromApi(callback, questionCount) {
  const query = {
    amount: questionCount,
  };
  $.getJSON(BASE_URL, query, callback);
}

//Test callback function fetchQuestionsData

// Set questions array equal to our retrieved data
function decorateData(data) {
  QUESTIONS = data.results;
  console.log(QUESTIONS[0]);
  QUESTIONS.forEach((element) => {
    element.answer = [...element.incorrect_answers,
      element.correct_answer];
  });
  console.log(QUESTIONS);
}

// function decorateQuestion (question) {
//   const randomIndex = Math.floor(Math.random() * question.incorrect_answers);

//   newQuestion.answers.splice(randomIndex, 0, question.correct_answer);
// }



// // Add question to store
// function addQuestion() {}

// const fetchSessionToken = () {};


const TOP_LEVEL_COMPONENTS = [
  'js-intro', 'js-question', 'js-question-feedback', 'js-outro', 'js-quiz-status'
];

let QUESTIONS = [
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

    if (question.correct_answer === userAnswer) {
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

console.log(QUESTIONS);
// HTML generator functions
// ========================
const generateAnswerItemHtml = function(answer) {
  console.log(QUESTIONS[0]);
  return `
    <li class="answer-item">
      <input type="radio" name="answers" value="${answer}" />
      <span class="answer-text">${answer}</span>
    </li>
  `;
};

//Grab all the answers out of the questions
const generateQuestionHtml = function(question) {
  console.log(question);
  const answers = question.answer
    .map((answer, index) => generateAnswerItemHtml(answer, index))
    .join('');

  return `
    <form>
      <fieldset>
        <legend class="question-text">${question.question}</legend>
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
  let questionCount = $('#question_amount').find(':selected').text();
  console.log(questionCount);
  render();
  // return questionCount;
};


const handleQuestionAmt = function (e) {
  e.preventDefault();
  // let questionCount = $('option').val();
  let x = $('#question_amount').find(':selected').text();
  console.log(x);
};

const handleSubmitAnswer = function(e) {
  e.preventDefault();
  const question = getCurrentQuestion();
  const selected = $('input:checked').val();
  store.userAnswers.push(selected);
  

  if (selected === question.correct_answer) {
    store.feedback = 'You got it!';
  } else {
    store.feedback = `Too bad! The correct answer was: ${question.correct_answer}`;
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


fetchQuestionDataFromApi(decorateData);

// On DOM Ready, run render() and add event listeners
$(() => {
  render();

  $('.js-trivia-form').on('submit', 'js-question-amt',  handleQuestionAmt);
  $('.js-intro, .js-outro').on('click', '.js-start', handleStartQuiz);
  $('.js-question').on('submit', handleSubmitAnswer);
  $('.js-question-feedback').on('click', '.js-continue', handleNextQuestion);
});
