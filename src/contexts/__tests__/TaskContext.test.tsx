import { render, renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { TaskProvider, useTaskContext } from '../TaskContext'
import { ReactNode } from 'react'

const wrapper = ({ children }: { children: ReactNode }) => (
  <TaskProvider>{children}</TaskProvider>
)

describe('TaskContext', () => {
  it('provides initial demo data', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper })
    
    expect(result.current.tasks).toBeDefined()
    expect(result.current.tasks.length).toBeGreaterThan(0)
    expect(result.current.users).toBeDefined()
    expect(result.current.users.length).toBeGreaterThan(0)
    expect(result.current.projects).toBeDefined()
    expect(result.current.projects.length).toBeGreaterThan(0)
  })

  it('adds new task correctly', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper })
    
    const initialTaskCount = result.current.tasks.length
    
    act(() => {
      result.current.addTask({
        title: 'New Test Task',
        description: 'Test description',
        status: 'todo',
        priority: 'low',
        type: 'task',
        tags: ['test'],
        childrenIds: [],
      })
    })
    
    expect(result.current.tasks.length).toBe(initialTaskCount + 1)
    expect(result.current.tasks[result.current.tasks.length - 1].title).toBe('New Test Task')
  })

  it('updates task status correctly', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper })
    
    const firstTask = result.current.tasks[0]
    const originalStatus = firstTask.status
    const newStatus = originalStatus === 'todo' ? 'in-progress' : 'todo'
    
    act(() => {
      result.current.updateTaskStatus(firstTask.id, newStatus)
    })
    
    const updatedTask = result.current.tasks.find(t => t.id === firstTask.id)
    expect(updatedTask?.status).toBe(newStatus)
  })

  it('filters tasks by status correctly', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper })
    
    const todoTasks = result.current.getTasksByStatus('todo')
    const inProgressTasks = result.current.getTasksByStatus('in-progress')
    
    todoTasks.forEach(task => {
      expect(task.status).toBe('todo')
    })
    
    inProgressTasks.forEach(task => {
      expect(task.status).toBe('in-progress')
    })
  })

  it('deletes task correctly', () => {
    const { result } = renderHook(() => useTaskContext(), { wrapper })
    
    const initialTaskCount = result.current.tasks.length
    const firstTask = result.current.tasks[0]
    
    act(() => {
      result.current.deleteTask(firstTask.id)
    })
    
    expect(result.current.tasks.length).toBeLessThan(initialTaskCount)
    expect(result.current.tasks.find(t => t.id === firstTask.id)).toBeUndefined()
  })
})