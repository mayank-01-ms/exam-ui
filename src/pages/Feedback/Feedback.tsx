import { useState } from 'react';
import Button from '../../components/Button';
import axios from 'axios';

const Feedback = () => {
  const [feedbackText, setFeedbackText] = useState<string>('');

  const submitFeedback = async () => {
    await axios.post('api/submit/feedback', {
      feedback: feedbackText,
    });
  };

  return (
    <div className="max-w-sm mx-auto mt-[2rem]">
      <label
        htmlFor="message"
        className="block mb-2 text-sm font-medium text-gray-900"
      >
        <h1 className="text-2xl">Feedback</h1>
      </label>
      <textarea
        id="message"
        rows={4}
        value={feedbackText}
        onChange={(e) => setFeedbackText(e.target.value)}
        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
        placeholder="Leave a feedback..."
      ></textarea>
      <div className="mt-[1rem]">
        <Button onClick={submitFeedback}>Submit</Button>
      </div>
    </div>
  );
};

export default Feedback;
