
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, Status, Priority, User, Project } from '@/types';
import { toast } from '@/components/ui/use-toast';

// Demo users
const demoUsers: User[] = [
  { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: '3', name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?img=3' },
];

// Demo tasks
const demoTasks: Task[] = [
  {
    id: '1',
    title: 'Redesign dashboard UI',
    description: 'Update the dashboard with the new design system',
    status: 'todo',
    priority: 'high',
    assignee: demoUsers[0],
    createdAt: new Date('2023-04-15'),
    updatedAt: new Date('2023-04-15'),
    tags: ['design', 'ui'],
  },
  {
    id: '2',
    title: 'Fix login page bug',
    description: 'Users unable to login on mobile devices',
    status: 'in-progress',
    priority: 'urgent',
    assignee: demoUsers[1],
    createdAt: new Date('2023-04-14'),
    updatedAt: new Date('2023-04-16'),
    tags: ['bug', 'frontend'],
  },
  {
    id: '3',
    title: 'Create API documentation',
    description: 'Document all API endpoints for the frontend team',
    status: 'backlog',
    priority: 'medium',
    createdAt: new Date('2023-04-10'),
    updatedAt: new Date('2023-04-10'),
    tags: ['documentation', 'api'],
  },
  {
    id: '4',
    title: 'Implement authentication flow',
    description: 'Add OAuth integration with Google and GitHub',
    status: 'review',
    priority: 'high',
    assignee: demoUsers[2],
    createdAt: new Date('2023-04-08'),
    updatedAt: new Date('2023-04-18'),
    tags: ['auth', 'security'],
  },
  {
    id: '5',
    title: 'Optimize image loading',
    description: 'Improve performance of image loading on the product page',
    status: 'done',
    priority: 'medium',
    assignee: demoUsers[0],
    createdAt: new Date('2023-04-05'),
    updatedAt: new Date('2023-04-15'),
    tags: ['performance', 'frontend'],
  },
  {
    id: '6',
    title: 'Setup CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment',
    status: 'todo',
    priority: 'high',
    createdAt: new Date('2023-04-17'),
    updatedAt: new Date('2023-04-17'),
    tags: ['devops', 'automation'],
  },
];

// Demo projects
const demoProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website',
    tasks: demoTasks.slice(0, 3),
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'New mobile app for iOS and Android',
    tasks: demoTasks.slice(3),
  },
];

interface TaskContextType {
  tasks: Task[];
  users: User[];
  projects: Project[];
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (taskId: string, newStatus: Status) => void;
  getTasksByStatus: (status: Status) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(demoTasks);
  const [users] = useState<User[]>(demoUsers);
  const [projects, setProjects] = useState<Project[]>(demoProjects);
  const [currentProject, setCurrentProject] = useState<Project | null>(demoProjects[0]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newTask: Task = {
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
      ...taskData,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    
    // Also add to current project if one is selected
    if (currentProject) {
      const updatedProject = {
        ...currentProject,
        tasks: [...currentProject.tasks, newTask],
      };
      
      setProjects(projects.map(p => 
        p.id === currentProject.id ? updatedProject : p
      ));
      
      setCurrentProject(updatedProject);
    }
    
    toast({
      title: "Task created",
      description: `'${newTask.title}' has been added to your tasks.`,
    });
  };

  const updateTask = (updatedTask: Task) => {
    const newTask = {
      ...updatedTask,
      updatedAt: new Date(),
    };
    
    setTasks((prevTasks) => 
      prevTasks.map((task) => (task.id === updatedTask.id ? newTask : task))
    );
    
    // Also update in projects
    if (currentProject) {
      const updatedProjectTasks = currentProject.tasks.map((task) => 
        task.id === updatedTask.id ? newTask : task
      );
      
      const updatedProject = {
        ...currentProject,
        tasks: updatedProjectTasks,
      };
      
      setProjects(projects.map(p => 
        p.id === currentProject.id ? updatedProject : p
      ));
      
      setCurrentProject(updatedProject);
    }
    
    toast({
      title: "Task updated",
      description: `'${updatedTask.title}' has been updated.`,
    });
  };

  const deleteTask = (id: string) => {
    const taskToDelete = tasks.find(task => task.id === id);
    
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    
    // Also remove from projects
    if (currentProject) {
      const updatedProjectTasks = currentProject.tasks.filter(
        (task) => task.id !== id
      );
      
      const updatedProject = {
        ...currentProject,
        tasks: updatedProjectTasks,
      };
      
      setProjects(projects.map(p => 
        p.id === currentProject.id ? updatedProject : p
      ));
      
      setCurrentProject(updatedProject);
    }
    
    if (taskToDelete) {
      toast({
        title: "Task deleted",
        description: `'${taskToDelete.title}' has been removed.`,
      });
    }
  };

  const updateTaskStatus = (taskId: string, newStatus: Status) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    
    if (taskToUpdate) {
      const updatedTask = {
        ...taskToUpdate,
        status: newStatus,
        updatedAt: new Date(),
      };
      
      updateTask(updatedTask);
    }
  };

  const getTasksByStatus = (status: Status) => {
    if (!currentProject) return [];
    return currentProject.tasks.filter(task => task.status === status);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        users,
        projects,
        currentProject,
        setCurrentProject,
        addTask,
        updateTask,
        deleteTask,
        updateTaskStatus,
        getTasksByStatus,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
