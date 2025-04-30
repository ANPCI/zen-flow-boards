
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Kanban,
  CheckSquare,
  ListChecks,
  Menu,
} from 'lucide-react';

const AppSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);
  const location = useLocation();

  const navItems = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard size={18} />,
      path: '/',
    },
    {
      name: 'Kanban Board',
      icon: <Kanban size={18} />,
      path: '/board',
    },
    {
      name: 'My Tasks',
      icon: <CheckSquare size={18} />,
      path: '/my-tasks',
    },
    {
      name: 'Task Hierarchy',
      icon: <ListChecks size={18} />,
      path: '/hierarchy',
    },
  ];

  return (
    <div
      className={`h-screen bg-card border-r border-border flex flex-col ${
        collapsed ? 'w-[60px]' : 'w-[240px]'
      } transition-all duration-300`}
    >
      <div className="p-4 flex items-center justify-between border-b">
        <h1
          className={`font-bold text-xl ${
            collapsed ? 'hidden' : 'block'
          } transition-all duration-300`}
        >
          ZenFlow
        </h1>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu size={18} />
        </Button>
      </div>

      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  location.pathname === item.path ? 'bg-secondary' : ''
                }`}
                asChild
              >
                <Link to={item.path}>
                  {item.icon}
                  <span className={collapsed ? 'hidden' : 'ml-2'}>
                    {item.name}
                  </span>
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AppSidebar;
