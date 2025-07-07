
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "lucide-react";

const AuthButton = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Button variant="outline" disabled className="border-blue-200">
        Loading...
      </Button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <User className="h-4 w-4" />
        {user.email}
      </div>
    );
  }

  return null;
};

export default AuthButton;
