import * as React from "react";
import { Table, Tag, Space } from "antd";
import WorkoutContext from "../Contexts/WorkoutContext";

class WorkoutList extends React.Component {
  state = {};
  static contextType = WorkoutContext;
  columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <a>{text}</a>
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration"
    },
    {
      title: "Target Muscles",
      key: "targetMuscles",
      dataIndex: "targetMuscles",
      render: (tags) => (
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
