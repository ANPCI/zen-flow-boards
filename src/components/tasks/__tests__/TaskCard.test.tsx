import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TaskCard from '../TaskCard'
import { Task, User } from '@/types'

const mockUser: User = {
  id: '1',
  name: 'John Doe',
  avatar: 'https://i.pravatar.cc/150?img=1'
}

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'This is a test task',
  status: 'todo',
  priority: 'medium',
  type: 'task',
  assignee: mockUser,
  createdAt: new Date('2023-04-15'),
  updatedAt: new Date('2023-04-15'),
  tags: ['test', 'frontend'],
  childrenIds: [],
  storyPoints: 3
}

describe('TaskCard', () => {
  it('renders task title', () => {
    render(<TaskCard task={mockTask} onClick={vi.fn()} />)
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('renders task description', () => {
    render(<TaskCard task={mockTask} onClick={vi.fn()} />)
    expect(screen.getByText('This is a test task')).toBeInTheDocument()
  })

  it('displays priority badge', () => {
    render(<TaskCard task={mockTask} onClick={vi.fn()} />)
    expect(screen.getByText('medium')).toBeInTheDocument()
  })

  it('shows assignee name when assignee exists', () => {
    render(<TaskCard task={mockTask} onClick={vi.fn()} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('displays story points when available', () => {
    render(<TaskCard task={mockTask} onClick={vi.fn()} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})