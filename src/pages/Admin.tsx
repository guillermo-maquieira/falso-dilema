import { Link } from "react-router-dom";
import { AdminPanel } from "@/components/AdminPanel";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Admin = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <header className="flex items-center gap-4 mb-8 max-w-2xl mx-auto">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Admin</h1>
      </header>

      <AdminPanel />
    </div>
  );
};

export default Admin;
