
let questions = []; // Array to store questions
let currentQuestion = 0;
let score = 0;

// Load quiz data from storage if available
function loadQuiz() {
    const storedQuestions = localStorage.getItem('quizQuestions');
    const storedCurrentQuestion = localStorage.getItem('currentQuestion');
    const storedScore = localStorage.getItem('score');

    if (storedQuestions) {
        questions = JSON.parse(storedQuestions);
        currentQuestion = parseInt(storedCurrentQuestion, 10) || 0;
        score = parseInt(storedScore, 10) || 0;
    } else {
        generateQuestions(); // If no data, generate fresh questions
    }
}

// Save quiz data to storage
function saveQuiz() {
    localStorage.setItem('quizQuestions', JSON.stringify(questions));
    localStorage.setItem('currentQuestion', currentQuestion);
    localStorage.setItem('score', score);
}

function generateQuestions() {
  for (let i = 0; i < 10; i++) {
    // Randomly choose addition, subtraction, or multiplication
    const operator = Math.random() < 0.33 ? '+' : (Math.random() < 0.66 ? '-' : 'x');
    
    let num1, num2;
    if (operator === 'x') {
      // Ensure numbers are within a reasonable range for multiplication
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
    } else {
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
    }
    
    const question = `What is ${num1} ${operator} ${num2}?`;
    let answer;
    switch (operator) {
      case '+':
        answer = num1 + num2;
        break;
      case '-':
        answer = num1 - num2;
        break;
      case 'x':
        answer = num1 * num2;
        break;
    }
    
    // Generate random wrong answers
    const wrongAnswers = [];
    for (let j = 0; j < 2; j++) {
      let wrongAnswer;
      if (operator === 'x') {
        wrongAnswer = Math.floor(Math.random() * 50); // Adjust range for multiplication
      } else {
        wrongAnswer = Math.floor(Math.random() * 20);
      }
      while (wrongAnswer === answer || wrongAnswers.includes(wrongAnswer)) {
        wrongAnswer = Math.floor(Math.random() * (operator === 'x' ? 50 : 20));
      }
      wrongAnswers.push(wrongAnswer);
    }
    
    const options = [answer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    questions.push({ question, answer, options });
  }
}

function displayQuestion() {
  const question = questions[currentQuestion];
  document.getElementById('question').textContent = question.question;
  
  // Update current question display
  document.getElementById('current-question').textContent = currentQuestion + 1;
  
  const answersContainer = document.getElementById('answers');
  answersContainer.innerHTML = ''; // Clear previous options
  
  question.options.forEach((option, index) => {
    const answerBar = document.createElement('div');
    answerBar.className = 'answer-bar list-group-item';
    answerBar.textContent = option;
    answersContainer.appendChild(answerBar);
  });
}

function checkAnswer() {
  const selectedOption = document.querySelector('.answer-bar.selected');
  if (!selectedOption) return; // No option selected

  const answer = parseInt(selectedOption.textContent);
  const question = questions[currentQuestion];
  
  let feedback;
  if (answer === question.answer) {
    score++;
    feedback = 'Correct!';
  } else {
    feedback = `Incorrect. The answer is ${question.answer}`;
  }
  
  const feedbackElement = document.getElementById('feedback');
  feedbackElement.textContent = feedback;
  feedbackElement.style.opacity = 1; // Make feedback visible
  
  setTimeout(() => {
    feedbackElement.style.opacity = 0; // Hide feedback after a delay
  }, 1000); // 1 second delay

  // Check if it's the last question
  if (currentQuestion === questions.length - 1) {
    feedbackElement.textContent += ' You finished the quiz!';
    document.querySelector('button').disabled = true; // Disable button
  } else {
    currentQuestion++;
    saveQuiz(); // Save progress
    displayQuestion();
  }
}

function resetQuiz() {
    // Clear localStorage
    localStorage.removeItem('quizQuestions');
    localStorage.removeItem('currentQuestion');
    localStorage.removeItem('score');

    // Reset variables
    questions = [];
    currentQuestion = 0;
    score = 0;

    // Start a new quiz
    generateQuestions();
    displayQuestion();
}

// Load quiz data on page load
loadQuiz();
displayQuestion();
