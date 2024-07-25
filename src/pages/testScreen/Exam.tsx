import { useEffect, useState } from 'react';
import axios from 'axios';

import Question from './question/Question';

import { ExamState, QuestionData, Stats } from '../../types/Exam';

import { useAuth } from '../../context/AuthProvider';

let questionNumber = 1;
const _questionData: QuestionData = {
  number: 1,
  question_text: '',
  options: [],
  question_id: '',
  test_id: '',
};

interface Props {
  toggleFullScreen: (val: boolean) => void;
  setExamState: (val: ExamState) => void;
}

const Exam: React.FC<Props> = ({ toggleFullScreen, setExamState }) => {
  const { authState } = useAuth();

  const [seconds, setSeconds] = useState<number>(authState.timePerQuestion);
  const [timerWidth, setTimerWidth] = useState<number>(100);

  const [questionData, setQuestionData] = useState<QuestionData>(_questionData);
  const [stats, setStats] = useState<Stats>({
    attemptedQuestions: 0,
    skippedQuestions: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) setSeconds(seconds - 1);
      else clearInterval(interval);
    }, 1000);
    if (seconds === 0) handleNextButtonClick();
    return () => {
      clearInterval(interval);
    };
  }, [seconds]);

  // make this a CSS animation
  useEffect(() => {
    const interval = setInterval(() => {
      if (timerWidth > 0) setTimerWidth(timerWidth - 0.037);
      else clearInterval(interval);
    }, 10);
    return () => {
      clearInterval(interval);
    };
  }, [timerWidth]);

  const getNextQuestion = async () => {
    try {
      const response = await axios.post('/api/question', {
        username: authState.username,
      });
      if (response.status === 200) {
        setQuestionData({ ...response.data, number: ++questionNumber });
      }
    } catch (error) {}
  };

  const handleNextButtonClick = () => {
    // submit the response here then show the next question
    // show loading and error state for submit first
    if (questionNumber === authState.totalQuestions) {
      endExam();
      return;
    }
    getNextQuestion();
    // if submit then increase attempted else increase skipped
    setSeconds(authState.timePerQuestion);
    setTimerWidth(100);
  };

  const endExam = async () => {
    toggleFullScreen(false);
    setExamState('ENDED');
  };

  return (
    <div className="question_container bg-white">
      <div
        id="timer"
        className="bg-blue-700 h-[10px]"
        style={{ width: timerWidth + '%' }}
      ></div>
      <div className="bg-white p-[1rem] text-center font-bold text-xl border-b-2 border-slate-200 relative">
        <p className="bg-blue-400 text-center text-white py-[0.25rem] px-[1rem] inline-block rounded-lg absolute top-[10px] left-0 text-base font-normal">
          Time left: {seconds} seconds
        </p>
        Question {questionData.number} of {authState.totalQuestions}
        <p
          onClick={endExam}
          className="ml-[1rem] bg-red-700 text-white font-bold py-[0.25rem] px-[1rem] rounded-lg inline-block absolute top-[10px] right-0"
        >
          End Test
        </p>
      </div>
      <Question
        handleNextButtonClick={handleNextButtonClick}
        questionData={questionData}
        stats={stats}
        setStats={setStats}
      />
      <div className="mt-[2rem]">
        <span className="ml-[1rem] bg-green-400 text-white font-bold py-[0.25rem] px-[1rem]">
          Attempted: {stats.attemptedQuestions}
        </span>
        <span className="ml-[1rem] bg-red-400 text-white font-bold py-[0.25rem] px-[1rem]">
          Skipped: {stats.skippedQuestions}
        </span>
      </div>
    </div>
  );
};

export default Exam;
