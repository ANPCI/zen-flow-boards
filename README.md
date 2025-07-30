# Task Management Application

A modern, feature-rich task management application built with React, TypeScript, and Vite. This application provides a comprehensive project management solution similar to Jira, with support for task hierarchies, Kanban boards, time tracking, and advanced task organization.

![Task Management App](./public/placeholder.svg)

## 🚀 Features

### Core Functionality
- **Dashboard View**: Overview of all tasks with status-based filtering and metrics
- **Kanban Board**: Drag-and-drop task management across different status columns
- **Task Hierarchy**: Support for Epic → Story → Task → Subtask relationships
- **My Tasks**: Personal task view with filtering and sorting capabilities

### Task Management
- **Multiple Task Types**: Epic, Story, Task, Subtask, Bug, Feature
- **Priority Levels**: Low, Medium, High, Urgent
- **Status Tracking**: Backlog, To Do, In Progress, Review, Done
- **Time Tracking**: Original estimates, remaining time, and time spent
- **Task Relationships**: Parent-child task hierarchies

### Advanced Features
- **User Assignment**: Assign tasks to team members with avatar support
- **Due Date Management**: Set and track task deadlines
- **Tags and Labels**: Categorize tasks with custom tags and labels
- **Comments System**: Add comments and collaborate on tasks
- **File Attachments**: Upload and manage task-related files
- **Change History**: Track all task modifications over time
- **Sprint Management**: Organize tasks into sprints
- **Project Components**: Group tasks by project components
- **Watchers**: Subscribe to task updates

### UI/UX
- **Modern Design**: Clean, intuitive interface with shadcn/ui components
- **Responsive Layout**: Works seamlessly on desktop and mobile devices
- **Dark/Light Mode**: Automatic theme detection and switching
- **Animations**: Smooth transitions and loading states
- **Accessible**: WCAG compliant with keyboard navigation support

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing and navigation

### UI Framework
- **shadcn/ui** - Reusable and customizable UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful and consistent icons

### State Management
- **React Context** - Global state management for tasks and projects
- **React Query (TanStack Query)** - Server state management and caching
- **Local Storage** - Persistent client-side data storage

### Development Tools
- **ESLint** - Code linting and style enforcement
- **Vitest** - Fast unit testing framework
- **Testing Library** - React component testing utilities

## 📦 Installation

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn or bun

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vite_react_shadcn_ts
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080` to view the application.

## 🚀 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server on port 8080 |
| `npm run build` | Build for production |
| `npm run build:dev` | Build in development mode |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |
| `npm test` | Run tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate test coverage report |
| `npm run test:ui` | Open Vitest UI for interactive testing |

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (AppLayout)
│   ├── tasks/          # Task-related components
│   └── ui/             # shadcn/ui components
├── contexts/           # React Context providers
│   └── TaskContext.tsx # Global task state management
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
│   ├── Dashboard.tsx   # Main dashboard view
│   ├── KanbanBoard.tsx # Kanban board interface
│   ├── MyTasks.tsx     # Personal tasks view
│   ├── TaskHierarchy.tsx # Hierarchical task view
│   └── NotFound.tsx    # 404 error page
├── test/               # Test configuration
├── types/              # TypeScript type definitions
└── main.tsx           # Application entry point
```

## 🎯 Usage

### Creating Tasks
1. Click the "Create Task" button on any page
2. Fill in the task details:
   - **Title**: Brief task description
   - **Description**: Detailed task information
   - **Type**: Epic, Story, Task, Subtask, Bug, or Feature
   - **Priority**: Low, Medium, High, or Urgent
   - **Assignee**: Team member responsible for the task
   - **Due Date**: Task deadline
   - **Tags**: Categorization labels
   - **Story Points**: Effort estimation
3. Click "Create" to add the task to your project

### Managing Tasks
- **Edit Tasks**: Click on any task card to open the detail view
- **Update Status**: Drag tasks between columns on the Kanban board
- **Assign Tasks**: Select assignees from the user dropdown
- **Set Priorities**: Use the priority selector to indicate urgency
- **Track Time**: Log time spent and update estimates
- **Add Comments**: Collaborate with team members using the comment system

### Navigation
- **Dashboard** (`/`): Overview of all tasks with key metrics
- **Kanban Board** (`/board`): Drag-and-drop task management
- **My Tasks** (`/my-tasks`): Personal task queue and assignments
- **Task Hierarchy** (`/hierarchy`): Tree view of task relationships

## 🧪 Testing

The application includes comprehensive test coverage using Vitest and Testing Library.

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Open interactive test UI
npm run test:ui
```

### Test Structure
```
src/
└── test/
    ├── setup.ts        # Test configuration
    └── **/*.test.tsx   # Component tests
```

## 🎨 Customization

### Themes
The application supports automatic dark/light mode detection. You can customize the theme by modifying the CSS variables in `src/index.css`.

### Components
All UI components are built with shadcn/ui and can be customized through the `components.json` configuration file.

### Colors
The color scheme uses Tailwind CSS with a slate base color. Modify `tailwind.config.ts` to change the color palette.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and patterns
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Use meaningful commit messages

## 📋 Roadmap

### Upcoming Features
- [ ] Real-time collaboration with WebSocket support
- [ ] Advanced reporting and analytics
- [ ] Integration with GitHub/GitLab
- [ ] Email notifications
- [ ] Mobile app development
- [ ] API for third-party integrations
- [ ] Advanced search and filtering
- [ ] Bulk task operations
- [ ] Custom fields and workflows
- [ ] Time tracking reports

## 🐛 Known Issues

- Drag and drop may not work on touch devices (mobile)
- Large task lists may impact performance
- File attachments are stored locally (no cloud storage yet)

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) section
2. Create a new issue with detailed information
3. Join our community discussions

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Radix UI](https://www.radix-ui.com/) for accessible UI primitives  
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide](https://lucide.dev/) for the icon library
- [Vite](https://vitejs.dev/) for the blazing fast build tool

---

**Built with ❤️ using React, TypeScript, and shadcn/ui**