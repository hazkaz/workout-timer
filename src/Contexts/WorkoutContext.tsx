import * as React from "react";
import { Workout } from "../App";

export type TWorkoutContext = {
  workouts: Array<Workout>;
  updateWorkouts: any;
};

const defaultWorkout: TWorkoutContext = {
  workouts: [
    {
      key: "1",
      name: "Mountain Climbers",
      duration: 4,
      targetMuscles: ["Shoulder", "Abs"]
    },
    {
      key: "2",
      name: "Supermans",
      duration: 3,
      targetMuscles: ["Lats", "Lower Back"]
    },
    {
      key: "3",
      name: "Rest Break",
      duration: 7,
      targetMuscles: ["Ass"]
    }
  ],
  updateWorkouts: () => {}
};

const WorkoutContext = React.createContext<TWorkoutContext>(defaultWorkout);

export default WorkoutContext;
export { defaultWorkout };
