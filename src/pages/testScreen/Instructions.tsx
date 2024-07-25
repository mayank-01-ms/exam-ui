import Button from '../../components/Button';

interface Props {
  startExam: () => void;
}
const Instructions: React.FC<Props> = ({ startExam }) => {
  return (
    <div className="p-[2rem]">
      <h1 className="font-bold text-3xl">Instructions</h1>
      <ol className="list-decimal ml-[2rem] mt-[1rem]">
        <li>Exiting full screen or switching tabs will exit the exam.</li>
        <li>
          Make sure to select answer and click on Next, else the answer won't be
          saved.
        </li>
        <li>
          If an option is not selected and time for that question expires, the
          question will be marked as skipped
        </li>
        <li>All the best !!</li>
      </ol>
      <Button onClick={() => startExam()}>Start Test</Button>
    </div>
  );
};

export default Instructions;