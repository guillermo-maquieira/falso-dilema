import { Link } from "react-router-dom";
import { AdminPanel } from "@/components/AdminPanel";
import { AdminLogin } from "@/components/AdminLogin";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const Admin = () => {
  const { isAuthenticated, isLoading, verifyPassword, logout } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={verifyPassword} />;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <header className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Admin</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={logout}>
          <LogOut className="w-5 h-5" />
        </Button>
      </header>

      <AdminPanel />
    </div>
  );
};

export default Admin;
