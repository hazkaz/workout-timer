import * as React from 'react';
import './WorkoutList.css';
import { Table, Tag, Input, Button } from 'antd';
import { DeleteTwoTone, PlusOutlined, MenuOutlined } from '@ant-design/icons';
import WorkoutContext from '../Contexts/WorkoutContext';
import { Workout } from '../App';
import {
  SortableContainer as sortableContainer,
  SortableElement as sortableElement,
  SortableHandle as sortableHandle
} from 'react-sortable-hoc';

const DragHandle = sortableHandle(() => (
  <MenuOutlined style={{ cursor: 'pointer', color: '#999' }} />
));
const SortableItem = sortableElement((props: any) => <tr {...props} />);
const SortableContainer = sortableContainer((props: any) => (
  <tbody {...props} />
));


class WorkoutList extends React.Component {
  state = {};
  static contextType = WorkoutContext;
  context!: React.ContextType<typeof WorkoutContext>;

  columns = [
    {
      title: '',
      dataIndex: 'sort',
      width: 30,
      className: 'drag-visible',
      render: () => <DragHandle />
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Workout, index: number) => (
        <Input
          value={text}
          key={record.key}
          onChange={(event) =>
            this.handleUpdateName(record.key, event.target.value)
          }
        />
      )
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration: number, record: Workout, index: number) => (
        <Input
          key={record.key}
          value={duration}
          onChange={(event) =>
            this.handleUpdateDuration(record.key, event.target.value)
          }
        />
      )
    },
    {
      title: 'Target Muscles',
      key: 'targetMuscles',
      dataIndex: 'targetMuscles',
      render: (tags: Array<string>) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      )
    },
    {
      title: '',
      key: 'delete',
      render: (text: string, record: Workout, index: number) => (
        <Button
          onClick={(event) => this.handleDeleteWorkout(record.key)}
          icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
        >
          Delete
        </Button>
      )
    }
  ];

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

  handleDeleteWorkout = (workoutId: string) => {
    const newWorkouts = [...this.context.workouts];
    const workoutIndex = newWorkouts.findIndex((w) => w.key === workoutId);
    if (workoutIndex !== -1) {
      newWorkouts.splice(workoutIndex, 1);
      this.context.updateWorkouts(newWorkouts);
    }
  };

  handleAddWorkout = () => {
    const newWorkouts = [...this.context.workouts];
    const newKey = this.context.workouts.length + Math.random();
    newWorkouts.push({
      key: String(newKey),
      name: '',
      duration: 30,
      index: newKey,
      targetMuscles: []
    });
    this.context.updateWorkouts(newWorkouts);
  };

  DraggableBodyRow = ({ ...restProps }) => {
    const { workouts } = this.context;
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = workouts.findIndex(
      (x) => x.key === restProps['data-row-key']
    );
    return <SortableItem index={index} {...restProps} />;
  };

  onSortEnd = ({ oldIndex, newIndex }: { oldIndex: any; newIndex: any }) => {
    const newWorkouts = [...this.context.workouts];
    if (oldIndex !== newIndex) {
      const oldWorkout = newWorkouts.splice(oldIndex, 1);
      newWorkouts.splice(newIndex, 0, ...oldWorkout);
      this.context.updateWorkouts(newWorkouts);
    }
  };
  DraggableContainer = (props: any) => (
    <SortableContainer
      useDragHandle
      helperClass="row-dragging"
      onSortEnd={this.onSortEnd}
      {...props}
    />
  );
  render() {
    return (
      <>
        <div className="workout-list-header">
          <Button
            onClick={this.handleAddWorkout}
            className="add-workout-button"
            type="primary"
            icon={<PlusOutlined />}
          >
            Add Workout
          </Button>
          <h2 className="workout-header-title">Workout List</h2>
        </div>
        <Table
          columns={this.columns}
          dataSource={this.context.workouts}
          pagination={false}
          components={{
            body: {
              wrapper: this.DraggableContainer,
              row: this.DraggableBodyRow
            }
          }}
        />
      </>
    );
  }
}

export default WorkoutList;
