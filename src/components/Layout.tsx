
import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Calendar, 
  LayoutDashboard, 
  ClipboardList, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/components/ui/use-toast";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  end?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, to, end = false, onClick }) => {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
        "hover:bg-secondary hover:text-primary",
        isActive 
          ? "bg-primary/10 text-primary font-medium" 
          : "text-muted-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
};

interface LayoutProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
  logout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ isLoggedIn, isAdmin, logout }) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!isLoggedIn) {
    return <Outlet />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile menu button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed z-40 inset-y-0 left-0 w-64 glass-morphism shadow-lg transition-transform duration-300 ease-in-out",
          isMobile && (isSidebarOpen ? "translate-x-0" : "-translate-x-full")
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 flex items-center">
            <Calendar className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-xl font-semibold">TimeOff</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-2 space-y-1.5">
            <NavItem 
              icon={<LayoutDashboard size={18} />} 
              label="Dashboard" 
              to="/" 
              end 
              onClick={() => isMobile && setIsSidebarOpen(false)}
            />
            <NavItem 
              icon={<ClipboardList size={18} />} 
              label="My Requests" 
              to="/requests" 
              onClick={() => isMobile && setIsSidebarOpen(false)}
            />
            {isAdmin && (
              <NavItem 
                icon={<ClipboardList size={18} />} 
                label="All Requests" 
                to="/admin/requests" 
                onClick={() => isMobile && setIsSidebarOpen(false)}
              />
            )}
            <NavItem 
              icon={<Settings size={18} />} 
              label="Settings" 
              to="/settings" 
              onClick={() => isMobile && setIsSidebarOpen(false)}
            />
          </nav>

          {/* Logout */}
          <div className="p-4 mt-auto">
            <Button 
              variant="ghost" 
              className="w-full flex items-center justify-start gap-3 text-muted-foreground hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main 
        className={cn(
          "flex-1 transition-all duration-300",
          !isMobile && "ml-64"
        )}
      >
        <div className="container py-8 px-4 md:px-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
