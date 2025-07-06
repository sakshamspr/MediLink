
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";

const AuthButton = () => {
  const { user, signInWithGoogle, signOut, loading } = useAuth();

  if (loading) {
    return (
      <Button variant="outline" disabled className="border-blue-200">
        Loading...
      </Button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="h-4 w-4" />
          {user.email}
        </div>
        <Button
          variant="outline"
          onClick={signOut}
          className="border-blue-200 hover:bg-blue-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={signInWithGoogle}
      className="border-blue-200 hover:bg-blue-50"
    >
      Sign In with Google
    </Button>
  );
};

export default AuthButton;
