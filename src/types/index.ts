
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type Status = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';

export type TaskType = 'epic' | 'story' | 'task' | 'subtask';

export type User = {
  id: string;
  name: string;
  avatar: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  type: TaskType;
  assignee?: User;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  storyPoints?: number;
  parentId?: string; // Reference to parent task (epic->story->task->subtask)
  childrenIds: string[]; // References to children tasks
};

export type Project = {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
};

export interface TaskRelationship {
  parentId: string | null;
  childrenIds: string[];
}

