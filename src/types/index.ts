
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type Status = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';

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
  assignee?: User;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
};

export type Project = {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
};
