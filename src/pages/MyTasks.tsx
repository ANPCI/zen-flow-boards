
import React, { useState } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { Task } from '@/types';
import TaskCard from '@/components/tasks/TaskCard';
import TaskDetail from '@/components/tasks/TaskDetail';
import CreateTaskDialog from '@/components/tasks/CreateTaskDialog';
import { Button } from '@/components/ui/button';
import { Plus, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';

// Assuming the first user is the current user in our demo
const CURRENT_USER_ID = "1"; 

const MyTasks: React.FC = () => {
  const { tasks } = useTaskContext();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Filter tasks assigned to current user
  const myTasks = tasks.filter(task => task.assignee?.id === CURRENT_USER_ID);
  
  // Group by due date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const overdueTask = myTasks.filter(task => 
    task.dueDate && task.dueDate < today && task.status !== 'done'
  );
  
  const todayTasks = myTasks.filter(task => 
    task.dueDate && 
    task.dueDate.getDate() === today.getDate() &&
    task.dueDate.getMonth() === today.getMonth() &&
    task.dueDate.getFullYear() === today.getFullYear()
  );
  
  const tomorrowTasks = myTasks.filter(task => 
    task.dueDate && 
    task.dueDate.getDate() === tomorrow.getDate() &&
    task.dueDate.getMonth() === tomorrow.getMonth() &&
    task.dueDate.getFullYear() === tomorrow.getFullYear()
  );
  
  const laterTasks = myTasks.filter(task => 
    !task.dueDate || 
    (task.dueDate > tomorrow && 
     (task.dueDate < nextWeek))
  );
  
  const futureTasks = myTasks.filter(task => 
    task.dueDate && task.dueDate >= nextWeek
  );

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
          <h1 className="text-3xl font-bold">My Tasks</h1>
          <p className="text-muted-foreground">Tasks assigned to you</p>
        </div>
        <Button onClick={handleCreateTask} className="flex items-center">
          <Plus size={16} className="mr-2" />
          Create Task
        </Button>
      </div>

      <div className="space-y-8">
        {overdueTask.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center text-red-500">
              <Calendar size={18} className="mr-2" />
              Overdue
            </h2>
            <div className="space-y-3">
              {overdueTask.map((task) => (
                <TaskCard key={task.id} task={task} onClick={handleTaskClick} />
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar size={18} className="mr-2" />
            Today
          </h2>
          <div className="space-y-3">
            {todayTasks.length === 0 ? (
              <div className="border border-dashed rounded-lg p-4 text-center text-muted-foreground text-sm">
                No tasks for today
              </div>
            ) : (
              todayTasks.map((task) => (
                <TaskCard key={task.id} task={task} onClick={handleTaskClick} />
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar size={18} className="mr-2" />
            Tomorrow
          </h2>
          <div className="space-y-3">
            {tomorrowTasks.length === 0 ? (
              <div className="border border-dashed rounded-lg p-4 text-center text-muted-foreground text-sm">
                No tasks for tomorrow
              </div>
            ) : (
              tomorrowTasks.map((task) => (
                <TaskCard key={task.id} task={task} onClick={handleTaskClick} />
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar size={18} className="mr-2" />
            This Week
          </h2>
          <div className="space-y-3">
            {laterTasks.length === 0 ? (
              <div className="border border-dashed rounded-lg p-4 text-center text-muted-foreground text-sm">
                No tasks for this week
              </div>
            ) : (
              laterTasks.map((task) => (
                <TaskCard key={task.id} task={task} onClick={handleTaskClick} />
              ))
            )}
          </div>
        </div>

        {futureTasks.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar size={18} className="mr-2" />
              Later
            </h2>
            <div className="space-y-3">
              {futureTasks.map((task) => (
                <TaskCard key={task.id} task={task} onClick={handleTaskClick} />
              ))}
            </div>
          </div>
        )}
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

export default MyTasks;
