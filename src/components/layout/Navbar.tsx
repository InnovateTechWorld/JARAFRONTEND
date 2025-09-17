import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { LogOut, Settings, User, Sparkles, LayoutDashboard, Wand2, Video } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Jara</span>
            </Link>

            {user && (
              <div className="hidden md:flex space-x-1">
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/pages"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/pages')
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Pages
                </Link>
                <Link
                  to="/payment-links"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/payment-links')
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Payment Links
                </Link>
                <Link
                  to="/create-jara-page"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/create-jara-page')
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Create Jara Page
                </Link>
                <Link
                  to="/ai-generator"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/ai-generator')
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  AI Generator
                </Link>
                <Link
                  to="/videos"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/videos')
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Videos
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden md:block">{user.email}</span>
                </Menu.Button>

                <Transition
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 focus:outline-none z-50">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/dashboard"
                            className={`flex items-center px-4 py-2 text-sm ${
                              active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                            }`}
                          >
                            <LayoutDashboard className="w-4 h-4 mr-3" />
                            Dashboard
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/settings"
                            className={`flex items-center px-4 py-2 text-sm ${
                              active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                            }`}
                          >
                            <Settings className="w-4 h-4 mr-3" />
                            Settings
                          </Link>
                        )}
                      </Menu.Item>
                      <div className="border-t border-gray-200 my-1" />
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`flex items-center w-full px-4 py-2 text-sm text-left ${
                              active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                            }`}
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Sign Out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/auth">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}