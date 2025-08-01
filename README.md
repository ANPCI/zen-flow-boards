# Task Management Application

A modern, feature-rich task management application built with React, TypeScript, and shadcn/ui components. This application provides a comprehensive solution for managing tasks, projects, and team collaboration with support for Kanban boards, task hierarchy, and detailed task tracking.

## ✨ Features

### Task Management
- **Multiple Views**: Dashboard, Kanban Board, Task Hierarchy, and My Tasks views
- **Task Types**: Support for epics, stories, tasks, subtasks, bugs, and features
- **Priority Levels**: Low, Medium, High, and Urgent priority levels
- **Status Tracking**: Backlog, To Do, In Progress, Review, and Done statuses
- **Time Tracking**: Original estimates, remaining estimates, and time spent
- **Story Points**: Agile story point estimation

### Advanced Features
- **Task Hierarchy**: Parent-child relationships between tasks (Epic → Story → Task → Subtask)
- **User Assignment**: Assign tasks to team members with avatar support
- **Due Dates**: Set and track task deadlines
- **Tags and Labels**: Categorize tasks with custom tags and labels
- **Comments**: Collaborate with team members through task comments
- **File Attachments**: Upload and manage task-related files
- **Change History**: Track all task modifications with detailed history
- **Sprint Management**: Organize tasks into sprints

### User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Mode Support**: Toggle between light and dark themes
- **Smooth Animations**: Enhanced UX with custom animations
- **Toast Notifications**: Real-time feedback with Sonner toast notifications
- **Keyboard Shortcuts**: Efficient navigation and task management

## 🚀 Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **UI Components**: shadcn/ui component library
- **Styling**: Tailwind CSS with custom animations
- **Routing**: React Router DOM for client-side routing
- **State Management**: React Context API with custom hooks
- **Data Fetching**: TanStack Query (React Query)
- **Testing**: Vitest with React Testing Library
- **Code Quality**: ESLint for linting

## 📁 Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── layout/        # Layout components
│   │   ├── tasks/         # Task-related components
│   │   └── ui/            # shadcn/ui components
│   ├── contexts/          # React Context providers
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── pages/             # Page components
│   ├── test/              # Test configuration
│   └── types/             # TypeScript type definitions
├── components.json        # shadcn/ui configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── vite.config.ts         # Vite configuration
└── vitest.config.ts       # Testing configuration
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

## 📋 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run build:dev` - Build the application in development mode
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint for code quality checks
- `npm run test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ui` - Run tests with Vitest UI

## 🧪 Testing

The application includes comprehensive tests using Vitest and React Testing Library:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Structure
- Unit tests for individual components
- Integration tests for component interactions
- Mock data and utilities for consistent testing
- Setup configuration in `src/test/setup.ts`

## 🎨 UI Components

The application uses shadcn/ui components with Tailwind CSS for styling:

- **Layout Components**: Sidebar navigation, responsive app layout
- **Task Components**: Task cards, detailed task views, creation dialogs
- **UI Components**: Buttons, dialogs, forms, calendars, charts, and more
- **Custom Animations**: Fade-in and slide-in animations for enhanced UX

## 📊 Data Models

### Task Structure
```typescript
type Task = {
  id: string
  title: string
  description: string
  status: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  type: 'epic' | 'story' | 'task' | 'subtask' | 'bug' | 'feature'
  assignee?: User
  dueDate?: Date
  tags: string[]
  storyPoints?: number
  parentId?: string
  childrenIds: string[]
  timeTracking?: TimeTracking
  // ... and more fields
}
```

### User Management
- User profiles with avatars
- Task assignment and reporting
- Watchers and collaborators
- Activity tracking

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your preferred hosting service:
   - Vercel
   - Netlify
   - GitHub Pages
   - AWS S3 + CloudFront
   - Or any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style and patterns
- Write tests for new features
- Update documentation as needed
- Use conventional commit messages
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔧 Configuration

### Tailwind CSS
Custom configuration with:
- Design system colors and spacing
- Custom animations (fade-in, slide-in)
- Responsive breakpoints
- Dark mode support

### Vite Configuration
- Path aliases (`@/` points to `src/`)
- React SWC plugin for fast compilation
- Development server on port 8080

### Testing Setup
- Vitest with jsdom environment
- React Testing Library integration
- Global test utilities and mocks
- Coverage reporting

## 🎯 Roadmap

- [ ] Real-time collaboration features
- [ ] Advanced reporting and analytics
- [ ] Mobile app with React Native
- [ ] Integration with external tools (GitHub, Slack, etc.)
- [ ] Advanced search and filtering
- [ ] Bulk operations for tasks
- [ ] Custom fields and workflows

## 🐛 Known Issues

Please check the [Issues](../../issues) section for known bugs and feature requests.

## 📞 Support

For support, please create an issue in the repository or contact the development team.

---

Built with ❤️ using React, TypeScript, and shadcn/ui