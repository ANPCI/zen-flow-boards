import React, { useState } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { Task, Priority, Status, User, TaskType } from '@/types';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Trash2, ChevronRight, Clock, GitBranchIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

interface TaskDetailProps {
  task: Task | null;
  open: boolean;
  onClose: () => void;
}

const statusOptions: { value: Status; label: string }[] = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
];

const priorityOptions: { value: Priority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const typeOptions: { value: TaskType; label: string }[] = [
  { value: 'epic', label: 'Epic' },
  { value: 'story', label: 'Story' },
  { value: 'task', label: 'Task' },
  { value: 'subtask', label: 'Subtask' },
];

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

// Helper function to format minutes to hours and minutes
const formatMinutes = (minutes?: number): string => {
  if (!minutes) return '0h 0m';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

// Helper function to parse hours and minutes input to minutes
const parseTimeInput = (timeString: string): number | undefined => {
  // Format should be like "2h 30m" or "2h" or "30m"
  if (!timeString.trim()) return undefined;
  
  let minutes = 0;
  const hourMatch = timeString.match(/(\d+)h/);
  const minuteMatch = timeString.match(/(\d+)m/);
  
  if (hourMatch) minutes += parseInt(hourMatch[1]) * 60;
  if (minuteMatch) minutes += parseInt(minuteMatch[1]);
  
  return minutes > 0 ? minutes : undefined;
};

const TaskDetail: React.FC<TaskDetailProps> = ({ task, open, onClose }) => {
  const { updateTask, deleteTask, users, tasks } = useTaskContext();
  
  const [editedTask, setEditedTask] = useState<Task | null>(task);
  const [newTag, setNewTag] = useState('');
  const [originalEstimateInput, setOriginalEstimateInput] = useState('');
  const [remainingEstimateInput, setRemainingEstimateInput] = useState('');
  const [timeSpentInput, setTimeSpentInput] = useState('');
  const [branchName, setBranchName] = useState('');
  
  React.useEffect(() => {
    setEditedTask(task);
    
    // Initialize time tracking input fields
    if (task?.timeTracking?.originalEstimate) {
      setOriginalEstimateInput(formatMinutes(task.timeTracking.originalEstimate));
    } else {
      setOriginalEstimateInput('');
    }
    
    if (task?.timeTracking?.remainingEstimate) {
      setRemainingEstimateInput(formatMinutes(task.timeTracking.remainingEstimate));
    } else {
      setRemainingEstimateInput('');
    }
    
    if (task?.timeTracking?.timeSpent) {
      setTimeSpentInput(formatMinutes(task.timeTracking.timeSpent));
    } else {
      setTimeSpentInput('');
    }
    
    // Initialize branch name
    setBranchName(task?.branch || '');
  }, [task]);
  
  if (!editedTask) return null;
  
  // Get parent task if exists
  const parentTask = editedTask.parentId 
    ? tasks.find(t => t.id === editedTask.parentId) 
    : null;
  
  // Get child tasks
  const childTasks = tasks.filter(t => 
    editedTask.childrenIds.includes(t.id)
  );
  
  const handleSave = () => {
    if (editedTask) {
      // Process time tracking inputs
      const originalEstimate = parseTimeInput(originalEstimateInput);
      const remainingEstimate = parseTimeInput(remainingEstimateInput);
      const timeSpent = parseTimeInput(timeSpentInput);
      
      const updatedTask = {
        ...editedTask,
        timeTracking: {
          originalEstimate,
          remainingEstimate,
          timeSpent,
        },
        branch: branchName || undefined,
      };
      
      updateTask(updatedTask);
      onClose();
    }
  };
  
  const handleCreateBranch = () => {
    if (!editedTask) return;
    
    // Generate a branch name based on task type and title
    const taskPrefix = editedTask.type === 'bug' ? 'fix' : 
                      editedTask.type === 'feature' ? 'feature' : 
                      editedTask.type;
                      
    const slugifiedTitle = editedTask.title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '-');
    
    const newBranchName = `${taskPrefix}/${editedTask.id}-${slugifiedTitle}`;
    setBranchName(newBranchName);
    
    // In a real application, this would connect to GitHub API
    // For now, we'll just update the task with the branch name
    handleChange('branch', newBranchName);
  };
  
  const handleDelete = () => {
    if (editedTask) {
      deleteTask(editedTask.id);
      onClose();
    }
  };
  
  const handleChange = (field: keyof Task, value: any) => {
    setEditedTask((prev) => prev ? { ...prev, [field]: value } : null);
  };
  
  const handleAddTag = () => {
    if (newTag && editedTask) {
      if (!editedTask.tags.includes(newTag)) {
        handleChange('tags', [...editedTask.tags, newTag]);
      }
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    if (editedTask) {
      handleChange('tags', editedTask.tags.filter(tag => tag !== tagToRemove));
    }
  };
  
  const handleAssigneeChange = (userId: string) => {
    if (userId === 'unassigned') {
      handleChange('assignee', undefined);
    } else {
      const selectedUser = users.find(user => user.id === userId);
      handleChange('assignee', selectedUser);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Badge 
              variant="outline" 
              className={`mr-2 capitalize ${typeColors[editedTask.type]}`}
            >
              {editedTask.type}
            </Badge>
            Task Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {parentTask && (
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">Parent</label>
              <div className="col-span-3 flex items-center border p-2 rounded-md bg-muted/30">
                <Badge 
                  variant="outline" 
                  className={`mr-2 capitalize ${typeColors[parentTask.type]}`}
                >
                  {parentTask.type}
                </Badge>
                <span>{parentTask.title}</span>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">Title</label>
            <Input
              className="col-span-3"
              value={editedTask.title}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">Description</label>
            <Textarea
              className="col-span-3"
              value={editedTask.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">Type</label>
            <Select 
              value={editedTask.type} 
              onValueChange={(value: TaskType) => handleChange('type', value)}
              disabled={true} // Disable type change as it would break hierarchy
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center">
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${typeColors[type.value].split(' ')[0]}`}></span>
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">Status</label>
            <Select 
              value={editedTask.status} 
              onValueChange={(value: Status) => handleChange('status', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">Priority</label>
            <Select 
              value={editedTask.priority} 
              onValueChange={(value: Priority) => handleChange('priority', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value}>
                    <div className="flex items-center">
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${priorityColors[priority.value].split(' ')[0]}`}></span>
                      {priority.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">Story Points</label>
            <Input
              className="col-span-3"
              type="number"
              min="0"
              value={editedTask.storyPoints ?? ''}
              onChange={(e) => handleChange('storyPoints', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="Estimate story points"
            />
          </div>
          
          {/* Time Tracking Section */}
          <div className="grid grid-cols-4 items-start gap-4">
            <label className="text-right text-sm font-medium pt-2">Time Tracking</label>
            <div className="col-span-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">Original Estimate</label>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input
                      value={originalEstimateInput}
                      onChange={(e) => setOriginalEstimateInput(e.target.value)}
                      placeholder="e.g., 4h 30m"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Remaining Estimate</label>
                  <Input
                    value={remainingEstimateInput}
                    onChange={(e) => setRemainingEstimateInput(e.target.value)}
                    placeholder="e.g., 2h 15m"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Time Spent</label>
                <Input
                  value={timeSpentInput}
                  onChange={(e) => setTimeSpentInput(e.target.value)}
                  placeholder="e.g., 1h 45m"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Format: 1h 30m, 45m, or 2h
              </p>
            </div>
          </div>
          
          {/* GitHub Branch Integration */}
          <div className="grid grid-cols-4 items-start gap-4">
            <label className="text-right text-sm font-medium pt-2">GitHub Branch</label>
            <div className="col-span-3">
              <div className="flex items-center gap-2">
                <Input
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder="feature/task-123-description"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCreateBranch}
                >
                  <GitBranchIcon className="h-4 w-4 mr-1" />
                  Generate
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Format: type/task-id-title
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">Assignee</label>
            <Select 
              value={editedTask.assignee?.id || 'unassigned'} 
              onValueChange={handleAssigneeChange}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Unassigned">
                  {editedTask.assignee && (
                    <div className="flex items-center">
                      <Avatar className="h-5 w-5 mr-2">
                        <AvatarImage src={editedTask.assignee.avatar} />
                        <AvatarFallback>{editedTask.assignee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {editedTask.assignee.name}
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">
                  <span className="text-muted-foreground">Unassigned</span>
                </SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center">
                      <Avatar className="h-5 w-5 mr-2">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {user.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">Due Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="col-span-3 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {editedTask.dueDate ? (
                    format(editedTask.dueDate, 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={editedTask.dueDate}
                  onSelect={(date) => handleChange('dueDate', date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">Tags</label>
            <div className="col-span-3">
              <div className="flex flex-wrap gap-1 mb-2">
                {editedTask.tags.map((tag) => (
                  <Badge 
                    key={tag} 
                    className="bg-secondary text-foreground hover:bg-secondary/80"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag}
                    <span className="ml-1 cursor-pointer">×</span>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button type="button" size="sm" onClick={handleAddTag}>
                  Add
                </Button>
              </div>
            </div>
          </div>
          
          {childTasks.length > 0 && (
            <div className="grid grid-cols-4 items-start gap-4">
              <label className="text-right text-sm font-medium pt-2">Children</label>
              <div className="col-span-3 border rounded-md divide-y">
                {childTasks.map(child => (
                  <div 
                    key={child.id}
                    className="p-2 flex items-center justify-between hover:bg-muted/30"
                  >
                    <div className="flex items-center">
                      <Badge 
                        variant="outline" 
                        className={`mr-2 capitalize ${typeColors[child.type]}`}
                      >
                        {child.type}
                      </Badge>
                      <span>{child.title}</span>
                    </div>
                    <div className={`px-2 py-1 text-xs rounded-full ${priorityColors[child.priority]}`}>
                      {child.priority}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button variant="destructive" onClick={handleDelete} className="flex items-center">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetail;
