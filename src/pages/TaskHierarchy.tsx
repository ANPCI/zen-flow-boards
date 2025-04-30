
import React, { useState } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { Task, TaskType } from '@/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  ChevronRight, 
  Plus 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import TaskDetail from '@/components/tasks/TaskDetail';
import CreateTaskDialog from '@/components/tasks/CreateTaskDialog';
import { format } from 'date-fns';

const TaskHierarchy: React.FC = () => {
  const { tasks, currentProject } = useTaskContext();
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createTaskType, setCreateTaskType] = useState<TaskType>('epic');
  const [parentTaskId, setParentTaskId] = useState<string | undefined>(undefined);

  // Get root level tasks (epics without parents)
  const rootTasks = currentProject ? 
    currentProject.tasks.filter(task => 
      task.type === 'epic' && !task.parentId
    ) : [];

  const toggleExpand = (taskId: string) => {
    setExpandedIds(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };

  const handleCreateTask = (type: TaskType, parentId?: string) => {
    setCreateTaskType(type);
    setParentTaskId(parentId);
    setIsCreateOpen(true);
  };

  // Get child tasks by parent ID
  const getChildTasks = (parentId: string): Task[] => {
    return currentProject ? 
      currentProject.tasks.filter(task => task.parentId === parentId) : 
      [];
  };

  // Get appropriate icon color based on task type
  const getTypeColor = (type: TaskType) => {
    switch (type) {
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'story': return 'bg-blue-100 text-blue-800';
      case 'task': return 'bg-green-100 text-green-800';
      case 'subtask': return 'bg-gray-100 text-gray-800';
      default: return '';
    }
  };

  // Render task row with its children recursively
  const renderTaskRow = (task: Task, level = 0) => {
    const isExpanded = !!expandedIds[task.id];
    const childTasks = getChildTasks(task.id);
    const hasChildren = childTasks.length > 0;

    return (
      <React.Fragment key={task.id}>
        <TableRow 
          className="cursor-pointer hover:bg-muted/50" 
          onClick={() => handleTaskClick(task)}
        >
          <TableCell className="font-medium">
            <div className="flex items-center">
              <div style={{ width: `${level * 20}px` }} />
              {hasChildren ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 mr-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(task.id);
                  }}
                >
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </Button>
              ) : (
                <div className="w-8" />
              )}
              <Badge 
                variant="outline" 
                className={`mr-2 capitalize ${getTypeColor(task.type)}`}
              >
                {task.type}
              </Badge>
              {task.title}
            </div>
          </TableCell>
          <TableCell>{task.status}</TableCell>
          <TableCell>
            <Badge variant="outline" className={`capitalize bg-opacity-20 ${
              task.priority === 'low' ? 'bg-green-100 text-green-800' : 
              task.priority === 'medium' ? 'bg-blue-100 text-blue-800' : 
              task.priority === 'high' ? 'bg-amber-100 text-amber-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {task.priority}
            </Badge>
          </TableCell>
          <TableCell>
            {task.storyPoints !== undefined ? task.storyPoints : '-'}
          </TableCell>
          <TableCell>
            {task.assignee ? (
              <div className="flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={task.assignee.avatar} />
                  <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{task.assignee.name}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">Unassigned</span>
            )}
          </TableCell>
          <TableCell>
            {task.dueDate ? format(task.dueDate, 'MMM d, yyyy') : '-'}
          </TableCell>
          <TableCell>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                let nextType: TaskType = 'task';
                if (task.type === 'epic') nextType = 'story';
                else if (task.type === 'story') nextType = 'task';
                else if (task.type === 'task') nextType = 'subtask';
                handleCreateTask(nextType, task.id);
              }}
            >
              <Plus size={16} />
            </Button>
          </TableCell>
        </TableRow>

        {isExpanded && hasChildren && childTasks.map(childTask => 
          renderTaskRow(childTask, level + 1)
        )}
      </React.Fragment>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Task Hierarchy</h1>
          <p className="text-muted-foreground">
            {currentProject ? currentProject.name : 'All Tasks'}
          </p>
        </div>
        <Button 
          onClick={() => handleCreateTask('epic')}
          className="flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Create Epic
        </Button>
      </div>

      <div className="bg-white rounded-md border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Story Points</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rootTasks.length > 0 ? (
              rootTasks.map(task => renderTaskRow(task))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                  No epics found. Create an epic to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedTask && (
        <TaskDetail 
          task={selectedTask} 
          open={isDetailOpen} 
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedTask(null);
          }} 
        />
      )}

      <CreateTaskDialog 
        open={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)}
        defaultStatus="todo"
        defaultType={createTaskType}
        parentTaskId={parentTaskId}
      />
    </div>
  );
};

export default TaskHierarchy;
