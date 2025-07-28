# Task Management Application

A modern task management application built with React, TypeScript, and Vite, featuring a beautiful UI powered by Shadcn/ui components.

## Features

- 📋 Task Management with multiple views:
  - Dashboard Overview
  - Kanban Board
  - Task Hierarchy
  - My Tasks View
- 🎨 Modern UI with Shadcn/ui components
- 🌓 Dark/Light theme support
- 📱 Responsive design
- 🚀 Built with performance in mind

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui (Radix UI)
- **State Management**: React Context
- **Form Handling**: React Hook Form
- **Data Validation**: Zod
- **Routing**: React Router
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Query Management**: TanStack Query

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn or bun package manager

### Installation

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install dependencies
```bash
npm install
# or
yarn install
# or
bun install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
# or
bun dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `dev` - Start development server
- `build` - Build for production
- `build:dev` - Build for development
- `preview` - Preview production build
- `lint` - Run ESLint

## Project Structure

```
├── public/             # Static assets
├── src/
│   ├── components/    # Reusable UI components
│   │   ├── layout/   # Layout components
│   │   ├── tasks/    # Task-related components
│   │   └── ui/       # UI components (Shadcn)
│   ├── contexts/     # React contexts
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility functions
│   ├── pages/        # Application pages/routes
│   └── types/        # TypeScript type definitions
├── App.tsx           # Root component
└── main.tsx         # Application entry point
```

## Key Features

1. **Dashboard**
   - Overview of tasks and projects
   - Activity charts and statistics

2. **Kanban Board**
   - Drag-and-drop task management
   - Multiple columns for task status

3. **Task Hierarchy**
   - Tree view of tasks and subtasks
   - Parent-child relationship visualization

4. **My Tasks**
   - Personal task list
   - Task filtering and sorting

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework