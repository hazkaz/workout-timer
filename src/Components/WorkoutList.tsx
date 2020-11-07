import * as React from "react";
import { Table, Tag, Input } from "antd";
import WorkoutContext from "../Contexts/WorkoutContext";
import { Workout } from "../App";

class WorkoutList extends React.Component {
  state = {};
  static contextType = WorkoutContext;
  context!: React.ContextType<typeof WorkoutContext>;
  handleUpdateName = (workoutId: string, workoutNewName: string) => {
    const newWorkouts = [...this.context.workouts];
    const workoutIndex = newWorkouts.findIndex((w) => w.key === workoutId);
    if (workoutIndex !== -1) {
      newWorkouts[workoutIndex].name = workoutNewName;
      this.context.updateWorkouts(newWorkouts);
    }
  };
  handleUpdateDuration = (workoutId: string, workoutNewDuration: string) => {
    const newWorkouts = [...this.context.workouts];
    const workoutIndex = newWorkouts.findIndex((w) => w.key === workoutId);
    if (workoutIndex !== -1) {
      const workoutNewDurationValue = parseInt(workoutNewDuration, 10);
      if (!isNaN(workoutNewDurationValue)) {
        newWorkouts[workoutIndex].duration = workoutNewDurationValue;
        this.context.updateWorkouts(newWorkouts);
      }
    }
  };
  columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Workout, index: number) => (
        <Input
          value={text}
          onChange={(event) =>
            this.handleUpdateName(record.key, event.target.value)
          }
        />
      )
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (duration: number, record: Workout, index: number) => (
        <Input
          value={duration}
          onChange={(event) =>
            this.handleUpdateDuration(record.key, event.target.value)
          }
        />
      )
    },
    {
      title: "Target Muscles",
      key: "targetMuscles",
      dataIndex: "targetMuscles",
      render: (tags: Array<string>) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "loser") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      )
    }
  ];

  // workout = (w) => {
  //   return <List.Item>{w.name}</List.Item>;
  // };
  render() {
    return (
      <>
        <h2>Workout List</h2>
        <Table
          columns={this.columns}
          dataSource={this.context.workouts}
          pagination={false}
        />
      </>
    );
  }
}

export default WorkoutList;
