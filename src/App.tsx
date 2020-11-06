import * as React from "react";
import "./styles.css";
import { Progress, Button } from "antd";
import WorkoutList from "./WorkoutList";

class App extends React.Component {
  state = {
    timerStarted: Date.now(),
    timerRunning: false,
    timerDuration: 30,
    timeRemaining: 30,
    timeRemainingExact: 30
  };

  componentDidMount = () => {};

  componentDidUpdate = () => {};

  startTimer = () => {
    this.setState(
      { timerRunning: true, timerStarted: Date.now() },
      this.updateTimer
    );
  };

  updateTimer = () => {
    if (this.state.timerRunning) {
      const timeRemainingExact =
        this.state.timerDuration -
        (Date.now() - this.state.timerStarted) / 1000;
      const timeRemaining = Math.ceil(timeRemainingExact);
      if (timeRemaining > 0 && timeRemaining !== this.state.timeRemaining) {
        this.setState({
          timeRemaining: timeRemaining,
          timeRemainingExact: timeRemainingExact
        });
        setTimeout(this.updateTimer, 100);
      } else if (timeRemaining <= 0) {
        this.setState({
          timeRemaining: 0,
          timeRemainingExact: 0,
          timerRunning: false
        });
      } else {
        this.setState({ timeRemainingExact: timeRemainingExact });
        setTimeout(this.updateTimer, 100);
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
            onClick={this.state.timerRunning ? this.stopTimer : this.startTimer}
            className="start-button"
          >
            {this.state.timerRunning ? "Stop" : "Start"}
          </Button>
        </div>
        <WorkoutList />
      </div>
    );
  }
}

export default App;
