import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

export function DashboardLayout({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) {
      setLocation("/");
    } else if (requiredRole && user.role !== requiredRole) {
      setLocation(`/${user.role}`);
    }
  }, [user, requiredRole, setLocation]);

  if (!user) return null;
  if (requiredRole && user.role !== requiredRole) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
              SM
            </div>
            <h1 className="text-xl font-bold tracking-tight text-primary">Student Mentor AI</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
              <User className="w-4 h-4" />
              <span className="capitalize">{user.role} Portal</span>
            </div>
            <Button variant="ghost" size="sm" onClick={logout} className="text-muted-foreground hover:text-foreground">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
