import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, Status, Priority, User, Project, TaskType, TimeTracking } from '@/types';
import { toast } from '@/components/ui/use-toast';

// Demo users
const demoUsers: User[] = [
  { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: '3', name: 'Alex Johnson', avatar: 'https://i.pravatar.cc/150?img=3' },
];

// Demo tasks with added time tracking
const demoTasks: Task[] = [
  {
    id: '1',
    title: 'User Authentication Epic',
    description: 'Implement complete user authentication system',
    status: 'in-progress',
    priority: 'high',
    type: 'epic',
    childrenIds: ['2', '3'],
    createdAt: new Date('2023-04-15'),
    updatedAt: new Date('2023-04-15'),
    tags: ['auth', 'security'],
    storyPoints: 13,
    timeTracking: {
      originalEstimate: 2400, // 40 hours
      remainingEstimate: 1800, // 30 hours
      timeSpent: 600, // 10 hours
    },
    reporter: demoUsers[2],
    branch: 'epic/auth-system',
    components: ['Authentication', 'Frontend'],
    labels: ['core-feature', 'security']
  },
  {
    id: '2',
    title: 'Login Page Implementation',
    description: 'Create login page with email and password fields',
    status: 'todo',
    priority: 'high',
    type: 'story',
    parentId: '1',
    childrenIds: ['4', '5'],
    assignee: demoUsers[0],
    createdAt: new Date('2023-04-15'),
    updatedAt: new Date('2023-04-15'),
    tags: ['frontend', 'auth'],
    storyPoints: 5,
    timeTracking: {
      originalEstimate: 480, // 8 hours
      remainingEstimate: 480, // 8 hours
      timeSpent: 0,
    },
    reporter: demoUsers[1],
    branch: 'story/2-login-page',
    components: ['Frontend']
  },
  {
    id: '3',
    title: 'Registration Flow',
    description: 'Implement user registration with validation',
    status: 'backlog',
    priority: 'medium',
    type: 'story',
    parentId: '1',
    childrenIds: [],
    createdAt: new Date('2023-04-14'),
    updatedAt: new Date('2023-04-16'),
    tags: ['frontend', 'registration'],
    storyPoints: 8
  },
  {
    id: '4',
    title: 'Create login form component',
    description: 'Build form with validation using React Hook Form',
    status: 'in-progress',
    priority: 'medium',
    type: 'task',
    parentId: '2',
    childrenIds: ['6'],
    assignee: demoUsers[1],
    createdAt: new Date('2023-04-08'),
    updatedAt: new Date('2023-04-18'),
    tags: ['component', 'form'],
    storyPoints: 3
  },
  {
    id: '5',
    title: 'Implement authentication API',
    description: 'Connect login form to backend authentication API',
    status: 'todo',
    priority: 'high',
    type: 'task',
    parentId: '2',
    childrenIds: [],
    createdAt: new Date('2023-04-05'),
    updatedAt: new Date('2023-04-15'),
    tags: ['api', 'backend'],
    storyPoints: 2
  },
  {
    id: '6',
    title: 'Form validation',
    description: 'Add email and password validation to login form',
    status: 'todo',
    priority: 'low',
    type: 'subtask',
    parentId: '4',
    childrenIds: [],
    assignee: demoUsers[0],
    createdAt: new Date('2023-04-05'),
    updatedAt: new Date('2023-04-15'),
    tags: ['validation'],
    storyPoints: 1
  },
  {
    id: '7',
    title: 'Dashboard Redesign Epic',
    description: 'Redesign the main dashboard for better UX',
    status: 'todo',
    priority: 'medium',
    type: 'epic',
    childrenIds: ['8'],
    createdAt: new Date('2023-04-10'),
    updatedAt: new Date('2023-04-10'),
    tags: ['design', 'dashboard', 'ux'],
    storyPoints: 21
  },
  {
    id: '8',
    title: 'Chart Components',
    description: 'Create reusable chart components for dashboard',
    status: 'backlog',
    priority: 'medium',
    type: 'story',
    parentId: '7',
    childrenIds: [],
    assignee: demoUsers[2],
    createdAt: new Date('2023-04-08'),
    updatedAt: new Date('2023-04-18'),
    tags: ['charts', 'component'],
    storyPoints: 8
  },
];

// Demo projects
const demoProjects: Project[] = [
  {
    id: '1',
    name: 'ZenFlow App',
    description: 'Modern task management application',
    tasks: demoTasks,
    key: 'ZEN',
    lead: demoUsers[0],
    components: ['Authentication', 'Frontend', 'API', 'Dashboard']
  },
  {
    id: '2',
    name: 'Marketing Website',
    description: 'Company marketing website redesign',
    tasks: [],
    key: 'MKT',
    lead: demoUsers[1],
    components: ['Design', 'Frontend', 'Content']
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
  createGitHubBranch?: (task: Task) => Promise<string>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(demoTasks);
  const [users] = useState<User[]>(demoUsers);
  const [projects, setProjects] = useState<Project[]>(demoProjects);
  const [currentProject, setCurrentProject] = useState<Project | null>(demoProjects[0]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newId = Date.now().toString();
    
    // Set current user as reporter if not specified
    const reporter = taskData.reporter || users[0]; // In a real app, this would be the logged-in user
    
    const newTask: Task = {
      id: newId,
      createdAt: now,
      updatedAt: now,
      childrenIds: [],
      reporter,
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
    
    // Update parent task's childrenIds if this task has a parent
    if (taskData.parentId) {
      const parentTask = tasks.find(t => t.id === taskData.parentId);
      if (parentTask) {
        const updatedParent = {
          ...parentTask,
          childrenIds: [...parentTask.childrenIds, newId]
        };
        updateTask(updatedParent);
      }
    }
    
    toast({
      title: `${taskData.type.charAt(0).toUpperCase() + taskData.type.slice(1)} created`,
      description: `'${newTask.title}' has been added.`,
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
    
    if (!taskToDelete) return;
    
    // First, update any parent task to remove this task from its children
    if (taskToDelete.parentId) {
      const parentTask = tasks.find(t => t.id === taskToDelete.parentId);
      if (parentTask) {
        const updatedParent = {
          ...parentTask,
          childrenIds: parentTask.childrenIds.filter(childId => childId !== id)
        };
        
        setTasks(prevTasks => 
          prevTasks.map(t => t.id === parentTask.id ? updatedParent : t)
        );
      }
    }
    
    // Handle recursive deletion of child tasks
    const deleteTaskAndChildren = (taskId: string) => {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return [];
      
      // Collect all ids to delete (this task + all descendants)
      const idsToDelete = [taskId];
      
      // Recursively collect all child ids
      const collectChildIds = (childrenIds: string[]) => {
        childrenIds.forEach(childId => {
          idsToDelete.push(childId);
          const childTask = tasks.find(t => t.id === childId);
          if (childTask && childTask.childrenIds.length > 0) {
            collectChildIds(childTask.childrenIds);
          }
        });
      };
      
      collectChildIds(task.childrenIds);
      return idsToDelete;
    };
    
    const allIdsToDelete = deleteTaskAndChildren(id);
    
    // Delete all tasks
    setTasks(prevTasks => prevTasks.filter(task => !allIdsToDelete.includes(task.id)));
    
    // Also remove from projects
    if (currentProject) {
      const updatedProjectTasks = currentProject.tasks.filter(
        task => !allIdsToDelete.includes(task.id)
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
      title: `${taskToDelete.type.charAt(0).toUpperCase() + taskToDelete.type.slice(1)} deleted`,
      description: `'${taskToDelete.title}' and its children have been removed.`,
    });
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

  // Mock function for GitHub branch creation
  // In a real app, this would connect to GitHub API
  const createGitHubBranch = async (task: Task): Promise<string> => {
    // Generate a branch name based on task type and title
    const taskPrefix = task.type === 'bug' ? 'fix' : 
                      task.type === 'feature' ? 'feature' : 
                      task.type;
                      
    const slugifiedTitle = task.title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-');
    
    const branchName = `${taskPrefix}/${task.id}-${slugifiedTitle}`;
    
    // Update task with branch name
    const updatedTask = {
      ...task,
      branch: branchName,
    };
    
    updateTask(updatedTask);
    
    // In a real app, this would use GitHub API to create the branch
    // For now, just return the branch name
    return Promise.resolve(branchName);
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
        createGitHubBranch,
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
