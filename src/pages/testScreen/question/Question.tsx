import { useState } from 'react';
import { MdOutlineRefresh } from 'react-icons/md';
import axios from 'axios';

import { QuestionData } from '../../../types/Exam';

import Button from '../../../components/Button';

import { useAuth } from '../../../context/AuthProvider';

import './question.scss';

interface QuestionProps {
  handleNextButtonClick: () => void;
  questionData: QuestionData;
  stats: any;
  setStats: any;
}

const Question: React.FC<QuestionProps> = ({
  handleNextButtonClick,
  questionData,
  stats,
  setStats,
}) => {
  const [optionId, setOptionId] = useState<string | null>(null);

  const { authState } = useAuth();

  const handleRadioClick = (val: string) => {
    setOptionId(val);
  };

  const submitAnswer = async () => {
    if (!optionId) {
      setStats({ ...stats, skippedQuestions: stats.skippedQuestions + 1 });
    } else {
      try {
        const response = await axios.post('/api/answer/submit', {
          question_id: questionData.question_id,
          option_id: optionId,
          username: authState.username,
        });
        if (response.status === 200) {
          setStats({
            ...stats,
            attemptedQuestions: stats.attemptedQuestions + 1,
          });
        }
      } catch (error) {}
    }
    handleNextButtonClick();
  };

  return (
    <div className="question_container">
      <p className="mt-[2rem]">
        <span className="font-bold">Q{questionData.number}: </span>
        {questionData.question_text}
      </p>
      <div className="options_list ml-[2rem]">
        {questionData.options.map((option) => (
          <div key={option.option_id}>
            <input
              type="radio"
              id={String(option.option_id)}
              value={option.option_id}
              checked={optionId === option.option_id}
              onChange={() => handleRadioClick(option.option_id)}
              name="temp"
            />
            <label htmlFor={String(option.option_id)}>
              {option.option_text}
            </label>
          </div>
        ))}
        <div className="reset_answer flex items-center text-blue-400">
          <MdOutlineRefresh className="mt-[1rem] mr-[0.5rem]" />
          <p className="mt-[1rem]">Reset answer</p>
        </div>
      </div>
      <div className="text-right mt-[2rem] mr-[2rem]">
        <Button onClick={submitAnswer}>Next</Button>
      </div>
    </div>
  );
};

export default Question;
