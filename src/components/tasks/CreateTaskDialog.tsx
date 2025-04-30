
import React, { useState } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import { Priority, Status, User, TaskType } from '@/types';
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
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
  defaultStatus?: Status;
  defaultType?: TaskType;
  parentTaskId?: string;
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

const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({ 
  open, 
  onClose, 
  defaultStatus = 'todo',
  defaultType = 'task',
  parentTaskId 
}) => {
  const { addTask, users, tasks } = useTaskContext();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<Status>(defaultStatus);
  const [priority, setPriority] = useState<Priority>('medium');
  const [type, setType] = useState<TaskType>(defaultType);
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [storyPoints, setStoryPoints] = useState<number | undefined>(undefined);
  
  // Get parent task if parentTaskId is provided
  const parentTask = parentTaskId ? tasks.find(t => t.id === parentTaskId) : undefined;

  // Determine allowed task types based on parent
  const allowedTypes = () => {
    if (!parentTask) return typeOptions;
    
    switch(parentTask.type) {
      case 'epic':
        return typeOptions.filter(t => t.value === 'story');
      case 'story':
        return typeOptions.filter(t => t.value === 'task');
      case 'task':
        return typeOptions.filter(t => t.value === 'subtask');
      default:
        return typeOptions;
    }
  };
  
  // Reset form and set defaults
  React.useEffect(() => {
    if (open) {
      setTitle('');
      setDescription('');
      setStatus(defaultStatus);
      setPriority('medium');
      setType(defaultType);
      setAssigneeId('');
      setDueDate(undefined);
      setTags([]);
      setNewTag('');
      setStoryPoints(undefined);
      
      // Set appropriate type based on parent
      if (parentTask) {
        if (parentTask.type === 'epic') setType('story');
        else if (parentTask.type === 'story') setType('task');
        else if (parentTask.type === 'task') setType('subtask');
      }
    }
  }, [open, defaultStatus, defaultType, parentTask]);
  
  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSubmit = () => {
    if (!title.trim()) return;
    
    const assignee = assigneeId ? users.find(user => user.id === assigneeId) : undefined;
    
    addTask({
      title,
      description,
      status,
      priority,
      type,
      assignee,
      dueDate,
      tags,
      storyPoints,
      parentId: parentTaskId,
      childrenIds: []
    });
    
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        onClose();
      }
    }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {parentTask 
              ? `Create New ${type.charAt(0).toUpperCase() + type.slice(1)} under "${parentTask.title}"`
              : `Create New ${type.charAt(0).toUpperCase() + type.slice(1)}`
            }
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">Title</label>
            <Input
              className="col-span-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">Description</label>
            <Textarea
              className="col-span-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">Type</label>
            <Select 
              value={type} 
              onValueChange={(value: TaskType) => setType(value)}
              disabled={!!parentTask} // Disable if parent task exists
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {allowedTypes().map((typeOption) => (
                  <SelectItem key={typeOption.value} value={typeOption.value}>
                    <div className="flex items-center">
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${typeColors[typeOption.value].split(' ')[0]}`}></span>
                      {typeOption.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">Status</label>
            <Select value={status} onValueChange={(value: Status) => setStatus(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((statusOption) => (
                  <SelectItem key={statusOption.value} value={statusOption.value}>
                    {statusOption.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">Priority</label>
            <Select value={priority} onValueChange={(value: Priority) => setPriority(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((priorityOption) => (
                  <SelectItem key={priorityOption.value} value={priorityOption.value}>
                    <div className="flex items-center">
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${priorityColors[priorityOption.value].split(' ')[0]}`}></span>
                      {priorityOption.label}
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
              value={storyPoints ?? ''}
              onChange={(e) => setStoryPoints(e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="Estimate story points"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm font-medium">Assignee</label>
            <Select value={assigneeId} onValueChange={setAssigneeId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Unassigned">
                  {assigneeId && (
                    <div className="flex items-center">
                      <Avatar className="h-5 w-5 mr-2">
                        <AvatarImage src={users.find(u => u.id === assigneeId)?.avatar} />
                        <AvatarFallback>
                          {users.find(u => u.id === assigneeId)?.name.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      {users.find(u => u.id === assigneeId)?.name || 'Unknown'}
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
                  {dueDate ? (
                    format(dueDate, 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <label className="text-right text-sm font-medium pt-2">Tags</label>
            <div className="col-span-3">
              <div className="flex flex-wrap gap-1 mb-2">
                {tags.map((tag) => (
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
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim()}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
