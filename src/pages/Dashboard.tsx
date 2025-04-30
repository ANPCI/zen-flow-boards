
import React, { useState } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { Status, Task } from '@/types';
import TaskCard from '@/components/tasks/TaskCard';
import TaskDetail from '@/components/tasks/TaskDetail';
import CreateTaskDialog from '@/components/tasks/CreateTaskDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, LayoutDashboard, CheckCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { currentProject, getTasksByStatus } = useTaskContext();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const todoTasks = getTasksByStatus('todo');
  const inProgressTasks = getTasksByStatus('in-progress');
  const reviewTasks = getTasksByStatus('review');
  const doneTasks = getTasksByStatus('done');

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };

  const handleCreateTask = () => {
    setIsCreateOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold animate-fade-in">Dashboard</h1>
          <p className="text-muted-foreground">
            {currentProject ? currentProject.name : 'All Tasks'}
          </p>
        </div>
        <Button onClick={handleCreateTask} className="flex items-center">
          <Plus size={16} className="mr-2" />
          Create Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="animate-slide-in" style={{ animationDelay: '0ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center mr-2">
                <LayoutDashboard size={14} className="text-blue-600" />
              </div>
              Total Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todoTasks.length + inProgressTasks.length + reviewTasks.length + doneTasks.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {currentProject ? `in ${currentProject.name}` : 'across all projects'}
            </p>
          </CardContent>
        </Card>

        <Card className="animate-slide-in" style={{ animationDelay: '100ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <div className="w-6 h-6 rounded bg-amber-100 flex items-center justify-center mr-2">
                <LayoutDashboard size={14} className="text-amber-600" />
              </div>
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks.length}</div>
            <p className="text-xs text-muted-foreground">tasks currently in progress</p>
          </CardContent>
        </Card>

        <Card className="animate-slide-in" style={{ animationDelay: '200ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <div className="w-6 h-6 rounded bg-purple-100 flex items-center justify-center mr-2">
                <LayoutDashboard size={14} className="text-purple-600" />
              </div>
              In Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reviewTasks.length}</div>
            <p className="text-xs text-muted-foreground">tasks waiting for review</p>
          </CardContent>
        </Card>

        <Card className="animate-slide-in" style={{ animationDelay: '300ms' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <div className="w-6 h-6 rounded bg-green-100 flex items-center justify-center mr-2">
                <CheckCircle size={14} className="text-green-600" />
              </div>
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doneTasks.length}</div>
            <p className="text-xs text-muted-foreground">tasks completed</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">To Do</h2>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 px-2 text-xs" 
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus size={14} className="mr-1" />
              Add Task
            </Button>
          </div>
          <div className="space-y-3">
            {todoTasks.length === 0 ? (
              <div className="border border-dashed rounded-lg p-4 text-center text-muted-foreground text-sm">
                No tasks in to do yet. Create one!
              </div>
            ) : (
              todoTasks.map((task) => (
                <TaskCard key={task.id} task={task} onClick={handleTaskClick} />
              ))
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">In Progress</h2>
          </div>
          <div className="space-y-3">
            {inProgressTasks.length === 0 ? (
              <div className="border border-dashed rounded-lg p-4 text-center text-muted-foreground text-sm">
                No tasks in progress
              </div>
            ) : (
              inProgressTasks.map((task) => (
                <TaskCard key={task.id} task={task} onClick={handleTaskClick} />
              ))
            )}
          </div>
        </div>
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
      />
    </div>
  );
};

export default Dashboard;
