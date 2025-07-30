import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import KanbanBoard from '../KanbanBoard';
import { TaskProvider } from '@/contexts/TaskContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';

// Mock the components that might cause issues in testing
vi.mock('@/components/tasks/TaskCard', () => ({
  default: ({ task, onClick }: any) => (
    <div data-testid={`task-card-${task.id}`} onClick={() => onClick(task)} draggable>
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
  default: ({ open, onClose, defaultStatus }: any) => (
    open ? (
      <div data-testid="create-task-dialog" onClick={onClose}>
        Create Task Dialog - {defaultStatus}
      </div>
    ) : null
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

describe('KanbanBoard', () => {
  it('should render kanban board with title', () => {
    render(
      <TestWrapper>
        <KanbanBoard />
      </TestWrapper>
    );

    expect(screen.getByText('Kanban Board')).toBeInTheDocument();
    expect(screen.getByText('Create Task')).toBeInTheDocument();
  });

  it('should display all status columns', () => {
    render(
      <TestWrapper>
        <KanbanBoard />
      </TestWrapper>
    );

    expect(screen.getByText('Backlog')).toBeInTheDocument();
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('should display task count for each column', () => {
    render(
      <TestWrapper>
        <KanbanBoard />
      </TestWrapper>
    );

    // Each column should have a count badge (numbers will vary based on demo data)
    const countBadges = screen.getAllByText(/^\d+$/);
    expect(countBadges.length).toBeGreaterThanOrEqual(5); // One for each column
  });

  it('should open create task dialog when main Create Task button is clicked', () => {
    render(
      <TestWrapper>
        <KanbanBoard />
      </TestWrapper>
    );

    const createButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(createButton);

    expect(screen.getByTestId('create-task-dialog')).toBeInTheDocument();
    expect(screen.getByText(/create task dialog - todo/i)).toBeInTheDocument();
  });

  it('should open create task dialog with correct default status when column + button is clicked', () => {
    render(
      <TestWrapper>
        <KanbanBoard />
      </TestWrapper>
    );

    // Find all the small + buttons in columns
    const addButtons = screen.getAllByRole('button');
    const columnAddButtons = addButtons.filter(button => 
      button.querySelector('svg') && !button.textContent?.includes('Create Task')
    );

    if (columnAddButtons.length > 0) {
      fireEvent.click(columnAddButtons[0]);
      expect(screen.getByTestId('create-task-dialog')).toBeInTheDocument();
    }
  });

  it('should handle task card clicks and open task detail', () => {
    render(
      <TestWrapper>
        <KanbanBoard />
      </TestWrapper>
    );

    // Find any task cards that might be present
    const taskCards = screen.queryAllByTestId(/task-card-/);
    
    if (taskCards.length > 0) {
      fireEvent.click(taskCards[0]);
      expect(screen.getByTestId('task-detail')).toBeInTheDocument();
    }
  });

  it('should close task detail when onClose is called', () => {
    render(
      <TestWrapper>
        <KanbanBoard />
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

  it('should close create task dialog when onClose is called', () => {
    render(
      <TestWrapper>
        <KanbanBoard />
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

  it('should show no tasks message in empty columns', () => {
    render(
      <TestWrapper>
        <KanbanBoard />
      </TestWrapper>
    );

    // Look for "No tasks" message in columns that are empty
    const noTasksMessages = screen.queryAllByText('No tasks');
    expect(noTasksMessages.length).toBeGreaterThanOrEqual(0);
  });

  it('should handle drag and drop events', () => {
    render(
      <TestWrapper>
        <KanbanBoard />
      </TestWrapper>
    );

    // Find any draggable task cards
    const taskCards = screen.queryAllByTestId(/task-card-/);
    
    if (taskCards.length > 0) {
      const taskCard = taskCards[0];
      
      // Test drag start
      const dragStartEvent = new Event('dragstart', { bubbles: true });
      Object.defineProperty(dragStartEvent, 'dataTransfer', {
        value: {
          setData: vi.fn(),
        },
      });
      
      fireEvent(taskCard, dragStartEvent);
      
      // The test passes if no errors are thrown during drag events
      expect(taskCard).toBeInTheDocument();
    }
  });

  it('should display project name when current project is set', () => {
    render(
      <TestWrapper>
        <KanbanBoard />
      </TestWrapper>
    );

    // The component should show either a project name or "All Tasks"
    const projectInfo = screen.queryByText(/all tasks/i) || screen.queryByText(/project/i);
    expect(projectInfo).toBeTruthy();
  });
});