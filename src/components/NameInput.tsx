import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface NameInputProps {
  onSubmit: (name: string) => void;
}

export function NameInput({ onSubmit }: NameInputProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto animate-bounce-in">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <span className="text-6xl block mb-4">👋</span>
          <h2 className="text-2xl font-bold mb-2">¡Bienvenido!</h2>
          <p className="text-muted-foreground">¿Cómo te llamás?</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            className="text-center text-lg h-12"
            autoFocus
          />
          <Button type="submit" className="w-full" disabled={!name.trim()}>
            Empezar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
