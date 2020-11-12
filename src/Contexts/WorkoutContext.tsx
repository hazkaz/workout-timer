import * as React from 'react';
import { Workout } from '../App';

export type TWorkoutContext = {
  workouts: Array<Workout>;
  updateWorkouts: any;
};

const defaultWorkout: TWorkoutContext = {
  workouts: [
    {
      key: '1',
      name: 'Mountain Climbers',
      duration: 4,
      index: 0,
      targetMuscles: ['Shoulder', 'Abs']
    },
    {
      key: '2',
      name: 'Supermans',
      duration: 3,
      index: 2,
      targetMuscles: ['Lats', 'Lower Back']
    },
    {
      key: '3',
      name: 'Rest Break',
      duration: 7,
      index: 3,
      targetMuscles: ['Ass']
    }
  ],
  updateWorkouts: () => {}
};

const WorkoutContext = React.createContext<TWorkoutContext>(defaultWorkout);

export default WorkoutContext;
export { defaultWorkout };
