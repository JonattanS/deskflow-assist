import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { UserMenu } from "../UserMenu"; // Ajusta la ruta si está en otra carpeta

export const Header = () => {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">MA</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Mesa de Ayuda</h1>
            <p className="text-sm text-muted-foreground">Área de Contabilidad</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Aquí usamos el UserMenu que adapta la lógica desde el contexto */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
