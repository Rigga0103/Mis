import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../components/Footer';

const UserLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (sidebarOpen) setSidebarOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleSidebar}
              className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-md p-1"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/user/dashboard" className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold text-green-600">MIS</span>
              <span className="text-xs sm:text-sm bg-green-600 text-white px-2 py-0.5 rounded">USER</span>
            </Link>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            {user && (
              <div className="flex items-center gap-2">
                <img 
                  src={user.image || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600'} 
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-200" 
                />
                <span className="text-sm font-medium text-gray-700 hidden sm:inline-block">
                  {user.name}
                </span>
              </div>
            )}
            <button 
              onClick={logout}
              className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-md px-2 py-1"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline-block text-sm">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-[65px]">
        {/* Sidebar */}
        <aside 
          className={`w-64 bg-white border-r border-gray-200 fixed top-[65px] bottom-0 left-0 z-20 transform transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full overflow-y-auto">
            <nav className="p-4 space-y-1">
              <Link
                to="/user/dashboard"
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  isActive('/user/dashboard')
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={closeSidebar}
              >
                <LayoutDashboard size={20} className="shrink-0" />
                <span className="font-medium ml-3">Dashboard</span>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 ml-0 lg:ml-64 min-h-screen pb-16">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-10 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}
    </div>
  );
};

export default UserLayout;