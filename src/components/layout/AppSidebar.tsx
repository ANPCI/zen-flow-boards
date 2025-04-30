
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useTaskContext } from '@/contexts/TaskContext';
import { LogOut, LayoutDashboard, Kanban, Settings, User, Plus, Archive } from 'lucide-react';

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projects, currentProject, setCurrentProject } = useTaskContext();
  
  const mainMenuItems = [
    {
      title: 'Dashboard',
      path: '/',
      icon: LayoutDashboard,
    },
    {
      title: 'Kanban Board',
      path: '/board',
      icon: Kanban,
    },
    {
      title: 'My Tasks',
      path: '/my-tasks',
      icon: Archive,
    },
    {
      title: 'Settings',
      path: '/settings',
      icon: Settings,
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleProjectSelect = (projectId: string) => {
    const selectedProject = projects.find(p => p.id === projectId) || null;
    setCurrentProject(selectedProject);
  };

  return (
    <Sidebar>
      <SidebarHeader className="px-2 py-4">
        <div className="flex items-center px-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center mr-2">
            <span className="text-white font-semibold">Z</span>
          </div>
          <div className="font-semibold text-sidebar-foreground">ZenFlow</div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => handleNavigation(item.path)} 
                    active={location.pathname === item.path}
                  >
                    <item.icon size={18} />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <div className="flex justify-between items-center pr-2">
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <button 
              className="h-5 w-5 rounded-sm flex items-center justify-center hover:bg-sidebar-accent/40 transition-colors duration-200"
              onClick={() => navigate('/new-project')}
            >
              <Plus size={14} />
            </button>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map((project) => (
                <SidebarMenuItem key={project.id}>
                  <SidebarMenuButton 
                    onClick={() => handleProjectSelect(project.id)}
                    active={currentProject?.id === project.id}
                  >
                    <span className="w-4 h-4 rounded-sm bg-primary/30 flex items-center justify-center mr-1">
                      {project.name.charAt(0).toUpperCase()}
                    </span>
                    <span>{project.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center mr-2">
                <User size={14} />
              </div>
              <div className="text-sm">
                <div className="font-medium text-sidebar-foreground">John Doe</div>
                <div className="text-xs text-sidebar-foreground/70">Admin</div>
              </div>
            </div>
            <button className="h-8 w-8 rounded flex items-center justify-center hover:bg-sidebar-accent/40 transition-colors duration-200">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
