import logo from './logo.svg';
import { useState, useEffect } from 'react';
import './App.css';
import DOMPurify from 'dompurify';
function App() {
  const [isStarted, setStarted] = useState(false);
  const [questionNumber, setQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [gameEnded, setgameEnded]= useState(false)

  async function getData() {
    try {
      const response = await fetch(
        'https://opentdb.com/api.php?amount=10&category=19&difficulty=easy&type=multiple'
      );
      const data = await response.json();
      console.log(data);
      return data;
    } catch (err) {
      console.log(err.message);
    }
  }

  async function fetchQuestions() {
    const data = await getData();
    if (data && data.results) {
      setQuestions(data.results);
    }
  }

  useEffect(() => {
    fetchQuestions();
  }, []);

  const currentQuestion = questions[questionNumber];
  const cleanHtml = currentQuestion
    ? DOMPurify.sanitize(currentQuestion.question)
    : '';
  const answerChoices = currentQuestion
    ? [currentQuestion.correct_answer, ...currentQuestion.incorrect_answers]
    : [];
    for (let i=0;i<4;i++){
const randomNumber=Math.floor(Math.random()*4)
var temp= answerChoices[i]
answerChoices[i]=answerChoices[randomNumber]
answerChoices[randomNumber]=temp
    }
  function checkAnswer(choice) {
    if (!currentQuestion) return;
    if (choice === currentQuestion.correct_answer) {
      setQuestion((prev) => Math.min(prev + 1, questions.length - 1));
    }
    if (questionNumber>8){
      setgameEnded(true)}
  }
  function restartGame() {
    setQuestion(0);
    setgameEnded(false);
    fetchQuestions();
  }
  return (
    <>
      <h1>Celebrity Knowledge</h1>
      {!isStarted && <button onClick={() => setStarted(true)}>Start</button>}
      {isStarted && !gameEnded &&(
        <>
      <h2 dangerouslySetInnerHTML={{__html: cleanHtml}}></h2>
          <div>
            {answerChoices.map((choice, index) => (
                <button key={index} onClick={() => checkAnswer(choice)}>
                {choice}
              </button>
            ))}
          </div>
        </>
      )}
      {gameEnded &&(
        <>
        <button onClick={() => restartGame()}>Restart Game</button>
        </>
      )}
    </>
  );
}

export default App;
