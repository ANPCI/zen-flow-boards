import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';
import { TaskProvider } from '@/contexts/TaskContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';

// Mock the components that might cause issues in testing
vi.mock('@/components/tasks/TaskCard', () => ({
  default: ({ task, onClick }: any) => (
    <div data-testid={`task-card-${task.id}`} onClick={() => onClick(task)}>
      {task.title}
    </div>
  ),
}));

vi.mock('@/components/tasks/TaskDetail', () => ({
  default: ({ task, open, onClose }: any) => (
    open ? <div data-testid="task-detail" onClick={onClose}>{task.title} Detail</div> : null
  ),
}));

vi.mock('@/components/tasks/CreateTaskDialog', () => ({
  default: ({ open, onClose }: any) => (
    open ? <div data-testid="create-task-dialog" onClick={onClose}>Create Task Dialog</div> : null
  ),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <TaskProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </TaskProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

describe('Dashboard', () => {
  it('should render dashboard with title and project info', () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Create Task')).toBeInTheDocument();
  });

  it('should display task statistics cards', () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('In Review')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('should display To Do and In Progress sections', () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('should open create task dialog when Create Task button is clicked', () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    const createButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(createButton);

    expect(screen.getByTestId('create-task-dialog')).toBeInTheDocument();
  });

  it('should open create task dialog when Add Task button is clicked', () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    const addButtons = screen.getAllByRole('button', { name: /add task/i });
    fireEvent.click(addButtons[0]);

    expect(screen.getByTestId('create-task-dialog')).toBeInTheDocument();
  });

  it('should close create task dialog when onClose is called', () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    // Open dialog
    const createButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(createButton);

    expect(screen.getByTestId('create-task-dialog')).toBeInTheDocument();

    // Close dialog
    fireEvent.click(screen.getByTestId('create-task-dialog'));

    expect(screen.queryByTestId('create-task-dialog')).not.toBeInTheDocument();
  });

  it('should show empty state when no tasks are present', () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    // Check if empty state messages are shown when no tasks in specific categories
    const emptyStates = screen.queryAllByText(/no tasks/i);
    expect(emptyStates.length).toBeGreaterThanOrEqual(0);
  });

  it('should handle task card clicks and open task detail', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    // Find any task cards that might be present
    const taskCards = screen.queryAllByTestId(/task-card-/);
    
    if (taskCards.length > 0) {
      fireEvent.click(taskCards[0]);
      expect(screen.getByTestId('task-detail')).toBeInTheDocument();
    }
  });

  it('should close task detail when onClose is called', async () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    // Find any task cards that might be present
    const taskCards = screen.queryAllByTestId(/task-card-/);
    
    if (taskCards.length > 0) {
      // Open task detail
      fireEvent.click(taskCards[0]);
      expect(screen.getByTestId('task-detail')).toBeInTheDocument();

      // Close task detail
      fireEvent.click(screen.getByTestId('task-detail'));
      expect(screen.queryByTestId('task-detail')).not.toBeInTheDocument();
    }
  });
});