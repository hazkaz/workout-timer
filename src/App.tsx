import * as React from "react";
import "./styles.css";
import { Progress, Button } from "antd";
import WorkoutList from "./Components/WorkoutList";
import WorkoutContext, { defaultWorkout } from "./Contexts/WorkoutContext";

class App extends React.Component {
  state = {
    timerStarted: Date.now(),
    timerRunning: false,
    timerDuration: 30,
    timeRemaining: 30,
    timeRemainingExact: 30,
    workouts: defaultWorkout.workouts,
    currentWorkoutIndex: 0
  };

  componentDidMount = () => {
    this.setState((oldState) => {
      if (oldState.workouts.length > 0) {
        return {
          timerDuration: oldState.workouts[0].duration,
          timeRemaining: oldState.workouts[0].duration,
          timeRemainingExact: oldState.workouts[0].duration
        };
      }
    });
  };

  componentDidUpdate = () => {};

  updateWorkout = (newWorkouts) => {
    this.setState({ workouts: newWorkouts });
  };

  startTimer = () => {
    this.setState(
      { timerRunning: true, timerStarted: Date.now() },
      this.updateTimer
    );
  };

  updateTimer = () => {
    if (this.state.timerRunning) {
      const timeRemainingExact =
        this.state.workouts[this.state.currentWorkoutIndex].duration -
        (Date.now() - this.state.timerStarted) / 1000;
      const timeRemaining = Math.ceil(timeRemainingExact);
      if (timeRemaining > 0 && timeRemaining !== this.state.timeRemaining) {
        this.setState(
          {
            timeRemaining: timeRemaining,
            timeRemainingExact: timeRemainingExact
          },
          () => setTimeout(this.updateTimer, 100)
        );
      } else if (timeRemaining <= 0) {
        this.setState(
          (oldState) => {
            if (oldState.currentWorkoutIndex === oldState.workouts.length - 1) {
              return {
                timeRemaining: 0,
                timeRemainingExact: 0,
                timerRunning: false
              };
            } else {
              const newWorkoutIndex = oldState.currentWorkoutIndex + 1;
              return {
                currentWorkoutIndex: newWorkoutIndex,
                timerStarted: Date.now(),
                timerDuration: oldState.workouts[newWorkoutIndex].duration,
                timeRemaining: oldState.workouts[newWorkoutIndex].duration,
                timeRemainingExact: oldState.workouts[newWorkoutIndex].duration,
                timerRunning: true
              };
            }
          },
          () => setTimeout(this.updateTimer, 100)
        );
      } else {
        this.setState({ timeRemainingExact: timeRemainingExact }, () =>
          setTimeout(this.updateTimer, 100)
        );
      }
    }
  };

  stopTimer = () => {
    this.setState({
      timerRunning: false
    });
  };

  resetTimer() {}

  render() {
    return (
      <div className="App">
        <WorkoutContext.Provider value={defaultWorkout}>
          <h1>Workout Timer</h1>
          <Progress
            type="circle"
            percent={
              (this.state.timeRemainingExact * 100) / this.state.timerDuration
            }
            format={() => `${this.state.timeRemaining}s`}
          />
          <div className="control-box">
            <Button
              onClick={
                this.state.timerRunning ? this.stopTimer : this.startTimer
              }
              className="start-button"
            >
              {this.state.timerRunning ? "Stop" : "Start"}
            </Button>
          </div>
          <WorkoutList />
        </WorkoutContext.Provider>
      </div>
    );
  }
}

export default App;
