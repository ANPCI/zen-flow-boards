
import React from 'react';
import { Task } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-amber-100 text-amber-800',
  urgent: 'bg-red-100 text-red-800',
};

const typeColors = {
  epic: 'bg-purple-100 text-purple-800',
  story: 'bg-blue-100 text-blue-800',
  task: 'bg-green-100 text-green-800',
  subtask: 'bg-gray-100 text-gray-800',
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  return (
    <div 
      className="task-card hover-card cursor-pointer" 
      onClick={() => onClick(task)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-1 mb-1">
          <Badge 
            variant="outline" 
            className={`capitalize text-xs py-0 px-1 ${typeColors[task.type]}`}
          >
            {task.type}
          </Badge>
          <h3 className="font-medium text-sm truncate flex-1">{task.title}</h3>
        </div>
        <div className={`text-xs rounded-full px-2 py-0.5 font-medium ${priorityColors[task.priority]}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </div>
      </div>
      
      <p className="text-xs text-gray-500 mb-3 truncate">{task.description}</p>
      
      {task.storyPoints !== undefined && (
        <div className="mb-2 text-xs">
          <Badge variant="secondary" className="text-xs py-0">
            {task.storyPoints} {task.storyPoints === 1 ? 'Point' : 'Points'}
          </Badge>
        </div>
      )}
      
      <div className="flex flex-wrap gap-1 mb-3">
        {task.tags.map((tag) => (
          <Badge key={tag} variant="outline" className="text-xs bg-secondary">
            {tag}
          </Badge>
        ))}
      </div>
      
      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
        <div className="flex items-center">
          {task.assignee ? (
            <Avatar className="h-5 w-5 mr-1">
              <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
              <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : (
            <span className="text-xs text-gray-400">Unassigned</span>
          )}
        </div>
        
        <div className="flex items-center">
          {task.status === 'done' ? (
            <div className="flex items-center text-green-600">
              <CheckCircle size={12} className="mr-1" />
              <span>Done</span>
            </div>
          ) : task.dueDate ? (
            <div className="flex items-center">
              <Calendar size={12} className="mr-1" />
              <span>{format(task.dueDate, 'MMM d')}</span>
            </div>
          ) : (
            <span>No due date</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
