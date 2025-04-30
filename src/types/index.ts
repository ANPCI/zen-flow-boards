
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type Status = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';

export type TaskType = 'epic' | 'story' | 'task' | 'subtask' | 'bug' | 'feature';

export type User = {
  id: string;
  name: string;
  avatar: string;
};

export type TimeTracking = {
  originalEstimate?: number; // in minutes
  remainingEstimate?: number; // in minutes
  timeSpent?: number; // in minutes
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
  timeTracking?: TimeTracking; // Time tracking field
  reporter?: User; // Person who created the task
  branch?: string; // GitHub branch associated with this task
  components?: string[]; // Components affected by this task
  labels?: string[]; // Labels for categorizing tasks
  watchers?: User[]; // Users watching this task
  comments?: Comment[]; // Comments on the task
  attachments?: Attachment[]; // Files attached to the task
  history?: HistoryItem[]; // Change history
  sprints?: string[]; // Sprint IDs this task belongs to
};

export type Comment = {
  id: string;
  author: User;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Attachment = {
  id: string;
  name: string;
  url: string;
  size: number;
  uploadedBy: User;
  uploadedAt: Date;
};

export type HistoryItem = {
  id: string;
  user: User;
  timestamp: Date;
  field: string;
  oldValue: any;
  newValue: any;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  key?: string; // Project key (e.g., "PROJ")
  lead?: User; // Project lead
  components?: string[]; // Project components
  sprints?: Sprint[]; // Sprints in this project
};

export type Sprint = {
  id: string;
  name: string;
  goal?: string;
  startDate?: Date;
  endDate?: Date;
  status: 'future' | 'active' | 'completed';
};

export interface TaskRelationship {
  parentId: string | null;
  childrenIds: string[];
}
