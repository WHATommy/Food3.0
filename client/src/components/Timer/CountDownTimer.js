import DateTimeDisplay from "./DateTimeDisplay";
import useCountDown from "./useCountDown";

const ShowCounter = ({ seconds }) => {
  return (
    <div className="show-counter">
        <DateTimeDisplay value={seconds} type={"Seconds"} isDanger={false} />
    </div>
  );
};

const CountDownTimer = ({ targetDate }) => {
    
  const [seconds] = useCountDown(targetDate);

  if (seconds <= 0) {
  } else {
    return (
      <ShowCounter
        seconds={seconds}
      />
    );
  }
};

export default CountDownTimer;