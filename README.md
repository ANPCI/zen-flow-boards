# ZenFlow - Intuitive Task Management

A modern, intuitive project and task management tool built with React, TypeScript, and Vite. ZenFlow provides a comprehensive solution for managing tasks, projects, and team collaboration with features like Kanban boards, task hierarchies, time tracking, and more.

## ✨ Features

### Core Features
- **Dashboard View** - Get an overview of all your tasks and project metrics
- **Kanban Board** - Visualize and manage tasks with drag-and-drop functionality
- **Task Hierarchy** - Organize work with Epic → Story → Task → Subtask structure
- **Multiple Task Types** - Support for Epics, Stories, Tasks, Subtasks, Bugs, and Features
- **Priority Management** - Low, Medium, High, and Urgent priority levels
- **Status Tracking** - Backlog, To Do, In Progress, Review, and Done statuses

### Advanced Features
- **Time Tracking** - Original estimates, remaining estimates, and time spent tracking
- **User Assignment** - Assign tasks to team members with avatar integration
- **Comments & Collaboration** - Task comments and discussion threads
- **File Attachments** - Attach files and documents to tasks
- **Task History** - Complete change history and audit trail
- **Sprint Management** - Organize tasks into sprints
- **GitHub Integration** - Automatic branch creation and linking
- **Story Points** - Agile story point estimation
- **Labels & Components** - Flexible tagging and categorization

### UI/UX Features
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Modern UI Components** - Built with shadcn/ui and Radix UI primitives
- **Dark/Light Theme Support** - Automatic theme switching with next-themes
- **Smooth Animations** - Polished animations using Tailwind CSS
- **Accessible** - WCAG compliant with proper ARIA attributes

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing
- **TanStack Query** - Data fetching and caching

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, customizable UI components
- **Radix UI** - Accessible, unstyled UI primitives
- **Lucide React** - Beautiful icons
- **next-themes** - Theme management

### Forms & Validation
- **React Hook Form** - Performant forms with minimal re-renders
- **Zod** - TypeScript-first schema validation
- **@hookform/resolvers** - Validation resolver for React Hook Form

### Data Visualization
- **Recharts** - Composable charting library for React

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm, yarn, or bun package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vite_react_shadcn_ts
   ```

2. **Install dependencies**
   ```bash
   # Using npm
   npm install
   
   # Using yarn
   yarn install
   
   # Using bun
   bun install
   ```

3. **Start the development server**
   ```bash
   # Using npm
   npm run dev
   
   # Using yarn
   yarn dev
   
   # Using bun
   bun dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080` to see the application.

### Building for Production

```bash
# Build for production
npm run build

# Preview the production build
npm run preview

# Build for development (useful for debugging)
npm run build:dev
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (AppLayout, Sidebar)
│   ├── tasks/          # Task-specific components
│   └── ui/             # shadcn/ui components
├── contexts/           # React contexts for state management
│   └── TaskContext.tsx # Main task management context
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard view
│   ├── KanbanBoard.tsx # Kanban board interface
│   ├── MyTasks.tsx     # Personal task view
│   ├── TaskHierarchy.tsx # Hierarchical task view
│   └── NotFound.tsx    # 404 page
├── types/              # TypeScript type definitions
│   └── index.ts        # Core types (Task, Project, User, etc.)
├── App.tsx             # Main app component
└── main.tsx            # Application entry point
```

## 🔧 Configuration

### Environment Variables
The application uses environment variables for configuration. Create a `.env` file in the root directory:

```env
# Example environment variables
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GITHUB_TOKEN=your_github_token_here
```

### Tailwind Configuration
The project uses a custom Tailwind configuration in `tailwind.config.ts` with:
- Custom color palette
- Extended animations
- Typography plugin
- Component-specific styling

### Vite Configuration
The `vite.config.ts` includes:
- Path aliases (`@/` for `src/`)
- React SWC plugin for fast refresh
- Development server configuration
- Component tagging for development

## 📊 Data Models

### Task
```typescript
type Task = {
  id: string;
  title: string;
  description: string;
  status: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'epic' | 'story' | 'task' | 'subtask' | 'bug' | 'feature';
  assignee?: User;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  storyPoints?: number;
  parentId?: string;
  childrenIds: string[];
  timeTracking?: TimeTracking;
  // ... additional fields
};
```

### Project
```typescript
type Project = {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  key?: string;
  lead?: User;
  components?: string[];
  sprints?: Sprint[];
};
```

## 🎯 Usage

### Creating Tasks
1. Navigate to the Dashboard or any task view
2. Click the "Create Task" or "+" button
3. Fill in the task details including title, description, type, and priority
4. Assign the task to a team member (optional)
5. Set due date and story points (optional)
6. Click "Create" to save the task

### Managing Task Hierarchy
- **Epics** contain multiple Stories
- **Stories** contain multiple Tasks
- **Tasks** can contain Subtasks
- Use the Task Hierarchy view to see the complete project structure

### Using the Kanban Board
- Drag and drop tasks between columns
- Each column represents a different status
- Tasks automatically update their status when moved

### Time Tracking
- Set original estimates when creating tasks
- Log time spent on tasks
- Update remaining estimates as work progresses
- View time tracking reports in the dashboard

## 🎨 Customization

### Theming
The application supports custom theming through CSS variables defined in `src/index.css`. You can customize:
- Primary and secondary colors
- Background colors
- Border colors
- Text colors
- Component-specific styles

### Adding New Components
1. Create new components in the appropriate `components/` subdirectory
2. Follow the existing naming conventions
3. Use TypeScript for type safety
4. Import and use shadcn/ui components where possible

### Extending Task Types
To add new task types:
1. Update the `TaskType` union type in `src/types/index.ts`
2. Update the task creation form in `CreateTaskDialog.tsx`
3. Add appropriate icons and styling

## 🧪 Testing

The project is set up for testing with modern testing tools:

```bash
# Run tests (when test suite is added)
npm run test

# Run tests in watch mode
npm run test:watch

# Generate test coverage
npm run test:coverage
```

## 📦 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on every push

### Netlify
1. Build the project: `npm run build`
2. Upload the `dist/` folder to Netlify
3. Configure redirects for client-side routing

### Self-hosted
1. Build the project: `npm run build`
2. Serve the `dist/` folder with any web server
3. Configure your web server for SPA routing

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Standards
- Use TypeScript for all new code
- Follow the existing code style
- Add proper JSDoc comments for functions
- Ensure responsive design for all UI components
- Write meaningful commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page for existing problems
2. Create a new issue with detailed information
3. Provide reproduction steps and environment details

## 🗺️ Roadmap

### Upcoming Features
- [ ] Real-time collaboration with WebSocket support
- [ ] Advanced reporting and analytics
- [ ] Calendar integration
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] API integration for external tools
- [ ] Advanced search and filtering
- [ ] Bulk operations
- [ ] Custom fields
- [ ] Workflow automation

### Performance Improvements
- [ ] Code splitting and lazy loading
- [ ] Service worker for offline support
- [ ] Image optimization
- [ ] Bundle size optimization

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Vite](https://vitejs.dev/) for the fast build tool
- [Lucide](https://lucide.dev/) for the icon set

---

Built with ❤️ using React, TypeScript, and modern web technologies.