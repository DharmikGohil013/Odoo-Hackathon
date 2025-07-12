import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/slices/authSlice'
import { 
  LayoutDashboard, 
  Users, 
  Award, 
  MessageSquare, 
  Megaphone, 
  ArrowLeftRight, 
  BarChart3, 
  Shield,
  X,
  UsersRound,
  LogOut,
  Settings,
  Moon,
  Sun
} from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'User Management', href: '/users', icon: Users },
  { name: 'Skills Moderation', href: '/skills', icon: Award },
  { name: 'Feedback Management', href: '/feedback', icon: MessageSquare },
  { name: 'Announcements', href: '/announcements', icon: Megaphone },
  { name: 'Swap Monitor', href: '/swaps', icon: ArrowLeftRight },
  { name: 'Groups Management', href: '/groups', icon: UsersRound },
  { name: 'Reports & Analytics', href: '/reports', icon: BarChart3 },
]

export default function AdminSidebar({ onCloseSidebar }) {
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [darkMode, setDarkMode] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully')
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    // Toggle dark mode class on document
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo and close button */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">SkillSwap</h2>
            <p className="text-sm text-gray-500">Admin Panel</p>
          </div>
        </div>
        <button
          onClick={onCloseSidebar}
          className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onCloseSidebar}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 ${
                isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
              }`} />
              <span className="font-medium">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-gray-200 p-4 space-y-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
        >
          {darkMode ? <Sun className="w-5 h-5 mr-3" /> : <Moon className="w-5 h-5 mr-3" />}
          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {/* User Info */}
        {user && (
          <div className="px-4 py-2">
            <p className="text-sm font-medium text-gray-900">{user.name || 'Admin User'}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}