
import { Heart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import AuthButton from "./AuthButton";

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-800">MediLink</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-gray-600 hover:text-blue-600 transition-colors ${
                isActive('/') ? 'text-blue-600 font-medium' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              to="/explore" 
              className={`text-gray-600 hover:text-blue-600 transition-colors ${
                isActive('/explore') ? 'text-blue-600 font-medium' : ''
              }`}
            >
              Find Doctors
            </Link>
          </div>

          <AuthButton />
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
