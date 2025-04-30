
import React, { useState } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { Status, Task } from '@/types';
import TaskCard from '@/components/tasks/TaskCard';
import TaskDetail from '@/components/tasks/TaskDetail';
import CreateTaskDialog from '@/components/tasks/CreateTaskDialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const statusColumns: { id: Status; title: string }[] = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

const KanbanBoard: React.FC = () => {
  const { getTasksByStatus, updateTaskStatus, currentProject } = useTaskContext();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createInColumn, setCreateInColumn] = useState<Status>('todo');

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };

  const handleCreateTask = (status: Status) => {
    setCreateInColumn(status);
    setIsCreateOpen(true);
  };

  // Simple drag and drop functionality
  const handleDragStart = (e: React.DragEvent, taskId: string, currentStatus: Status) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('currentStatus', currentStatus);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: Status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const currentStatus = e.dataTransfer.getData('currentStatus');
    
    if (currentStatus !== newStatus) {
      updateTaskStatus(taskId, newStatus);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Kanban Board</h1>
          <p className="text-muted-foreground">
            {currentProject ? currentProject.name : 'All Tasks'}
          </p>
        </div>
        <Button onClick={() => handleCreateTask('todo')} className="flex items-center">
          <Plus size={16} className="mr-2" />
          Create Task
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-220px)]">
        {statusColumns.map((column) => (
          <div 
            key={column.id}
            className="kanban-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <h3 className="font-medium">{column.title}</h3>
                <div className="ml-2 bg-secondary-foreground/10 text-secondary-foreground text-xs px-2 py-0.5 rounded-full">
                  {getTasksByStatus(column.id).length}
                </div>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 w-6 p-0 rounded-full"
                onClick={() => handleCreateTask(column.id)}
              >
                <Plus size={14} />
              </Button>
            </div>
            <div className="space-y-3">
              {getTasksByStatus(column.id).map((task) => (
                <div 
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id, task.status)}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <TaskCard task={task} onClick={handleTaskClick} />
                </div>
              ))}
              {getTasksByStatus(column.id).length === 0 && (
                <div className="border border-dashed border-border rounded-md p-4 text-center text-sm text-muted-foreground">
                  No tasks
                </div>
              )}
            </div>
          </div>
        ))}
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
        defaultStatus={createInColumn}
      />
    </div>
  );
};

export default KanbanBoard;
