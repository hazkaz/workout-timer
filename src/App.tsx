import * as React from 'react';
import './styles.css';
import './App.css';
import { Progress, Button } from 'antd';
import WorkoutList from './Components/WorkoutList';
import WorkoutContext, { defaultWorkout } from './Contexts/WorkoutContext';
import { shortHighBeep, longHighBeep } from './utils';

type AppProps = {};

export type Workout = {
  key: string;
  name: string;
  duration: number;
  index: number;
  targetMuscles: Array<string>;
};
type AppState = {
  timerStarted: number;
  timerRunning: boolean;
  timerPaused: boolean;
  timerDuration: number;
  timeRemaining: number;
  timeRemainingExact: number;
  currentWorkoutIndex: number;
  workouts: Array<Workout>;
};

class App extends React.Component<AppProps, AppState> {
  state: AppState = {
    timerStarted: Date.now(),
    timerRunning: false,
    timerPaused: false,
    timerDuration: 30,
    timeRemaining: 30,
    timeRemainingExact: 30,
    workouts: defaultWorkout.workouts,
    currentWorkoutIndex: 0
  };

  componentDidMount = () => {
    this.setState({
      timerDuration: this.state.workouts[0].duration,
      timeRemaining: this.state.workouts[0].duration,
      timeRemainingExact: this.state.workouts[0].duration
    });
  };

  componentDidUpdate = () => {};

  updateWorkout = (newWorkouts: Array<Workout>) => {
    if (newWorkouts.length > 0) {
      this.setState({
        workouts: newWorkouts,
        timerDuration: newWorkouts[0].duration,
        timeRemaining: newWorkouts[0].duration,
        timeRemainingExact: newWorkouts[0].duration
      });
    } else {
      this.setState({
        workouts: newWorkouts,
        timerDuration: 0,
        timeRemaining: 0,
        timeRemainingExact: 0
      });
    }
  };

  startTimer = () => {
    if (this.state.workouts && this.state.workouts.length > 0) {
      if (this.state.timerPaused) {
        this.setState(
          {
            timerPaused: false,
            timerRunning: true,
            // TODO: make resistant to change in workout during pause
            timerStarted:
              Date.now() -
              (this.state.workouts[this.state.currentWorkoutIndex].duration -
                this.state.timeRemainingExact) *
                1000
          },
          this.updateTimer
        );
      } else {
        this.setState((oldState) => {
          return {
            timerRunning: true,
            timerStarted: Date.now()
          };
        }, this.updateTimer);
      }
    }
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
          () => {
            setTimeout(this.updateTimer, 100);
            if (timeRemaining < 5) {
              shortHighBeep();
            }
          }
        );
      } else if (timeRemaining <= 0) {
        this.setState(
          (oldState) => {
            if (oldState.currentWorkoutIndex === oldState.workouts.length - 1) {
              return {
                timeRemaining: 0,
                timeRemainingExact: 0,
                timerRunning: false,
                timerStarted: this.state.timerStarted,
                timerDuration: this.state.timerDuration,
                currentWorkoutIndex: this.state.currentWorkoutIndex
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
          () => {
            longHighBeep();
            setTimeout(this.updateTimer, 100);
          }
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

  pauseTimer = () => {
    this.setState({
      timerRunning: false,
      timerPaused: true
    });
  };

  resetTimer = () => {
    this.setState({
      timerRunning: false,
      timerStarted: Date.now(),
      timerDuration:
        this.state.workouts.length > 0 ? this.state.workouts[0].duration : 0,
      timeRemaining:
        this.state.workouts.length > 0 ? this.state.workouts[0].duration : 0,
      timeRemainingExact:
        this.state.workouts.length > 0 ? this.state.workouts[0].duration : 0
    });
  };

  render() {
    const workoutContextValue = {
      workouts: this.state.workouts,
      updateWorkouts: this.updateWorkout
    };
    return (
      <div className="App">
        <WorkoutContext.Provider value={workoutContextValue}>
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
              type="primary"
              onClick={
                this.state.timerRunning ? this.pauseTimer : this.startTimer
              }
              className="timer-button start-button"
              disabled={
                !(this.state.workouts && this.state.workouts.length > 0)
              }
            >
              {this.state.timerRunning ? 'Pause' : 'Start'}
            </Button>
            <Button
              type="dashed"
              onClick={this.resetTimer}
              className="timer-button reset-button"
            >
              Reset
            </Button>
          </div>
          <WorkoutList />
        </WorkoutContext.Provider>
      </div>
    );
  }
}

export default App;
