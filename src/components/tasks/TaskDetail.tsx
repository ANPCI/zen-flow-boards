
import React, { useState } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { Task, Priority, Status, User } from '@/types';
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
import { CalendarIcon, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

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

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-amber-100 text-amber-800',
  urgent: 'bg-red-100 text-red-800',
};

const TaskDetail: React.FC<TaskDetailProps> = ({ task, open, onClose }) => {
  const { updateTask, deleteTask, users } = useTaskContext();
  
  const [editedTask, setEditedTask] = useState<Task | null>(task);
  const [newTag, setNewTag] = useState('');
  
  React.useEffect(() => {
    setEditedTask(task);
  }, [task]);
  
  if (!editedTask) return null;
  
  const handleSave = () => {
    if (editedTask) {
      updateTask(editedTask);
      onClose();
    }
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
    const selectedUser = users.find(user => user.id === userId);
    handleChange('assignee', selectedUser);
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
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
            <label className="text-right text-sm font-medium">Assignee</label>
            <Select 
              value={editedTask.assignee?.id || ''} 
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
                <SelectItem value="">
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
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <label className="text-right text-sm font-medium pt-2">Tags</label>
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
